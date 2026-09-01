import { Router } from 'express';
import {
  googleLogin,
  googleCallback,
  facebookLogin,
  facebookCallback,
} from '../controllers/oauthController.js';

const router = Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.get('/facebook', facebookLogin);
router.get('/facebook/callback', facebookCallback);

export default router;