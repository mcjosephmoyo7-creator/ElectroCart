import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const isPlaceholder =
  !process.env.SMTP_HOST ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS ||
  process.env.SMTP_HOST === 'placeholder';

if (isPlaceholder) {
  console.warn('SMTP credentials are missing. Emails will not be sent.');
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
} as nodemailer.TransportOptions);

export const MAIL_FROM = process.env.EMAIL_FROM || 'mcjosephmoyo7@gmail.com';
export const MAIL_TO = process.env.EMAIL_TO || 'mcjosephmoyo7@gmail.com';

export default transporter;
