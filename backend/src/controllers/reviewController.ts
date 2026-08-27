import { Request, Response } from 'express';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'username avatar')
    .sort('-createdAt');
  res.json({ success: true, data: reviews });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    throw new AppError('You have already reviewed this product', 409);
  }

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    paymentStatus: 'paid',
  });

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  const populated = await review.populate('user', 'username avatar');

  res.status(201).json({ success: true, data: populated });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this review', 403);
  }

  const { rating, title, comment } = req.body;
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;

  await review.save();

  const populated = await review.populate('user', 'username avatar');

  res.json({ success: true, data: populated });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this review', 403);
  }

  await Review.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Review deleted successfully' });
});

export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('product', 'name slug images')
    .sort('-createdAt');
  res.json({ success: true, data: reviews });
});
