import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'name slug price discountPrice images ratings brand'
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json({ success: true, data: wishlist });
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.body;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  const populated = await wishlist.populate(
    'products',
    'name slug price discountPrice images ratings brand'
  );

  res.json({ success: true, data: populated });
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    throw new AppError('Wishlist not found', 404);
  }

  wishlist.products = wishlist.products.filter(
    (p: any) => p.toString() !== productId
  );
  await wishlist.save();

  const populated = await wishlist.populate(
    'products',
    'name slug price discountPrice images ratings brand'
  );

  res.json({ success: true, data: populated });
});

export const isInWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  const inWishlist = wishlist
    ? wishlist.products.some((p: any) => p.toString() === productId)
    : false;

  res.json({ success: true, data: { inWishlist } });
});
