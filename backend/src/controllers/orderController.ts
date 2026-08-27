import { Request, Response } from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  if (!shippingAddress) {
    throw new AppError('Shipping address is required', 400);
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product as any;
    if (!product || !product.isActive) {
      throw new AppError(`Product ${product?.name || 'unknown'} is no longer available`, 400);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const price = product.discountPrice || product.price;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price,
      quantity: item.quantity,
    });

    subtotal += price * item.quantity;

    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'card',
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost,
    tax,
    total,
    notes,
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, data: order });
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'username email');
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.json({ success: true, data: order });
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = '1', limit = '10' } = req.query;

  const filter: any = {};
  if (status) filter.orderStatus = status;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'username email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    },
  });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.orderStatus = orderStatus;

  if (orderStatus === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }

  await order.save();

  res.json({ success: true, data: order });
});

export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.paymentStatus = paymentStatus;
  await order.save();

  res.json({ success: true, data: order });
});
