import { Request, Response } from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find().sort('-createdAt').skip(skip).limit(limitNum),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      users,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    },
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ success: true, data: user });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!role || !['customer', 'admin'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ success: true, data: user });
});

export const toggleUserActive = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, data: user });
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    deliveredOrders,
    salesData,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } },
    ]),
  ]);

  const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

  res.json({
    success: true,
    data: {
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      deliveredOrders,
    },
  });
});

export const getRecentOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .populate('user', 'username email')
    .sort('-createdAt')
    .limit(10);
  res.json({ success: true, data: orders });
});

export const getSalesChart = asyncHandler(async (_req: Request, res: Response) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        paymentStatus: 'paid',
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        totalSales: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: salesData });
});
