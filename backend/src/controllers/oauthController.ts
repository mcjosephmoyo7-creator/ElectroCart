import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { WithId } from 'mongodb';
import { getDatabase } from '../config/db.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || process.env.APP_URL || 'http://localhost:5000';
const STATE_COOKIE = 'oauthState';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as any);
};

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const sanitizeRedirect = (value: unknown): string => {
  const raw = typeof value === 'string' ? value : '/';
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('//') || raw.startsWith('/api')) return '/';
  return raw.slice(0, 200);
};

const createState = (redirect: string, res: Response): string => {
  const nonce = crypto.randomBytes(16).toString('hex');
  const state = Buffer.from(JSON.stringify({ redirect, nonce })).toString('base64url');
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60 * 1000,
  });
  return state;
};

const verifyState = (req: Request, res: Response, state: unknown): string | null => {
  const expected = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { path: '/' });
  if (!expected || typeof state !== 'string' || state !== expected) return null;
  try {
    const parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    return sanitizeRedirect(parsed.redirect);
  } catch {
    return null;
  }
};

const noCredentialsError = (res: Response, provider: string) => {
  res.redirect(
    `${FRONTEND_URL}/auth/login?error=${encodeURIComponent(`${provider}_oauth_not_configured`)}`
  );
};

interface OAuthProfile {
  provider: 'google' | 'facebook';
  providerId: string;
  email?: string;
  name?: string;
  picture?: string;
}

async function findOrCreateOAuthUser(profile: OAuthProfile): Promise<WithId<any>> {
  const users = getDatabase().collection('users');

  let user = await users.findOne({
    oauthProvider: profile.provider,
    oauthProviderId: profile.providerId,
  });
  if (!user && profile.email) {
    user = await users.findOne({ email: profile.email });
  }

  if (user) {
    if (!user.oauthProvider) {
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            oauthProvider: profile.provider,
            oauthProviderId: profile.providerId,
            avatar: profile.picture || user.avatar,
            updatedAt: new Date(),
          },
        }
      );
    }
    return users.findOne({ _id: user._id }) as Promise<WithId<any>>;
  }

  const baseUsername =
    (profile.name || profile.email?.split('@')[0] || 'guest')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20) || 'guest';
  let username = baseUsername;
  let counter = 1;
  while (await users.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter += 1;
  }

  const doc = {
    username,
    email: profile.email || '',
    avatar: profile.picture,
    role: 'customer',
    isActive: true,
    oauthProvider: profile.provider,
    oauthProviderId: profile.providerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const { insertedId } = await users.insertOne(doc);
  return { _id: insertedId, ...doc } as WithId<any>;
}

const completeOAuthLogin = async (res: Response, profile: OAuthProfile, redirect: string) => {
  const user = await findOrCreateOAuthUser(profile);
  const token = generateToken(user._id.toString());
  setTokenCookie(res, token);
  res.redirect(`${FRONTEND_URL}${redirect || '/'}`);
};

// ---------------------------------------------------------------------------
// Google OAuth 2.0
// ---------------------------------------------------------------------------

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export const googleLogin = (req: Request, res: Response) => {
  const { GOOGLE_CLIENT_ID: clientId } = process.env;
  if (!clientId) return noCredentialsError(res, 'google');

  const redirect = sanitizeRedirect(req.query.redirect);
  const state = createState(redirect, res);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state,
  });
  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const redirect = verifyState(req, res, state);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return noCredentialsError(res, 'google');
  if (!redirect || typeof code !== 'string') {
    return res.redirect(`${FRONTEND_URL}?auth_error=invalid_state`);
  }

  try {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
    if (!tokenData.access_token) throw new Error(tokenData.error || 'Token exchange failed');

    const userRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = (await userRes.json()) as {
      id?: string;
      email?: string;
      name?: string;
      picture?: string;
    };
    if (!profile.id) throw new Error('Failed to fetch Google profile');

    await completeOAuthLogin(
      res,
      { provider: 'google', providerId: profile.id, email: profile.email, name: profile.name, picture: profile.picture },
      redirect
    );
  } catch {
    res.redirect(`${FRONTEND_URL}${redirect}?auth_error=oauth_failed`);
  }
};

// ---------------------------------------------------------------------------
// Facebook OAuth 2.0
// ---------------------------------------------------------------------------

const FACEBOOK_AUTH_URL = 'https://www.facebook.com/v20.0/dialog/oauth';
const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v20.0/oauth/access_token';
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com/v20.0/me';

export const facebookLogin = (req: Request, res: Response) => {
  const { FACEBOOK_APP_ID: appId } = process.env;
  if (!appId) return noCredentialsError(res, 'facebook');

  const redirect = sanitizeRedirect(req.query.redirect);
  const state = createState(redirect, res);
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: `${BACKEND_URL}/api/auth/facebook/callback`,
    response_type: 'code',
    scope: 'email,public_profile',
    state,
  });
  res.redirect(`${FACEBOOK_AUTH_URL}?${params.toString()}`);
};

export const facebookCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const redirect = verifyState(req, res, state);
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appId || !appSecret) return noCredentialsError(res, 'facebook');
  if (!redirect || typeof code !== 'string') {
    return res.redirect(`${FRONTEND_URL}?auth_error=invalid_state`);
  }

  try {
    const tokenRes = await fetch(
      `${FACEBOOK_TOKEN_URL}?${new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: `${BACKEND_URL}/api/auth/facebook/callback`,
        code,
      })}`
    );
    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: unknown };
    if (!tokenData.access_token) throw new Error('Facebook token exchange failed');

    const profileRes = await fetch(
      `${FACEBOOK_GRAPH_URL}?${new URLSearchParams({
        fields: 'id,name,email,picture.type(large)',
        access_token: tokenData.access_token,
      })}`
    );
    const profile = (await profileRes.json()) as {
      id?: string;
      name?: string;
      email?: string;
      picture?: { data?: { url?: string } };
    };
    if (!profile.id) throw new Error('Failed to fetch Facebook profile');

    await completeOAuthLogin(
      res,
      { provider: 'facebook', providerId: profile.id, email: profile.email, name: profile.name, picture: profile.picture?.data?.url },
      redirect
    );
  } catch {
    res.redirect(`${FRONTEND_URL}${redirect}?auth_error=oauth_failed`);
  }
};