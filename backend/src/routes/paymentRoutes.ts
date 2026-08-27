import { Router, raw } from 'express';
import {
  createPaymentIntent,
  createCheckoutSession,
  webhookHandler,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/webhook', raw({ type: 'application/json' }), webhookHandler);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/create-checkout-session', protect, createCheckoutSession);

export default router;
