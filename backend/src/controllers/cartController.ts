import { Request, Response } from 'express';
import Cart from '../models/Cart.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name slug price discountPrice images stock isActive'
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  const populated = await cart.populate(
    'items.product',
    'name slug price discountPrice images stock isActive'
  );

  res.json({ success: true, data: populated });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    throw new AppError('Item not found in cart', 404);
  }

  item.quantity = quantity;
  await cart.save();

  const populated = await cart.populate(
    'items.product',
    'name slug price discountPrice images stock isActive'
  );

  res.json({ success: true, data: populated });
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();

  const populated = await cart.populate(
    'items.product',
    'name slug price discountPrice images stock isActive'
  );

  res.json({ success: true, data: populated });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  await cart.save();

  res.json({ success: true, data: cart });
});
