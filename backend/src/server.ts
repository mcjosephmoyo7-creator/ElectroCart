import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || 'localhost';
const APP_URL = process.env.APP_URL || `http://${HOST}:${PORT}`;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

app.use(helmet());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'ElectroCart backend is running 🚀',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Shopcart API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth', authLimiter, oauthRoutes);
app.use('/api/categories', apiLimiter, categoryRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/cart', apiLimiter, cartRoutes);
app.use('/api/wishlist', apiLimiter, wishlistRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/payments', apiLimiter, paymentRoutes);
app.use('/api', apiLimiter, contactRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, HOST, () => {
      console.log(`MongoDB connected successfully ✅`);
      console.log(`ElectroCart server running at: ${APP_URL}`);
      console.log(`Health check: ${APP_URL}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start ElectroCart server:", error);
    process.exit(1);
  }
};

start();

export default app;
