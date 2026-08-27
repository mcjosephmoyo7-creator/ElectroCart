import { Request, Response } from 'express';
import stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';

const isPlaceholder =
  !process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder';

export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const { amount, currency = 'usd' } = req.body;

  if (isPlaceholder) {
    res.json({
      success: true,
      data: {
        clientSecret: 'mock_secret_' + Date.now(),
        amount,
        currency,
      },
    });
    return;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
  });

  res.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
    },
  });
});

export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;

  if (isPlaceholder) {
    res.json({
      success: true,
      data: {
        url: `${process.env.FRONTEND_URL}/checkout/success?session_id=mock_${Date.now()}`,
        sessionId: 'mock_session_' + Date.now(),
      },
    });
    return;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    metadata: { orderId: order._id.toString() },
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.json({
    success: true,
    data: { url: session.url, sessionId: session.id },
  });
});

export const webhookHandler = asyncHandler(async (req: Request, res: Response) => {
  if (isPlaceholder) {
    res.json({ received: true });
    return;
  }

  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    }
  }

  res.json({ received: true });
});
