import { Request, Response } from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page = '1',
    limit = '12',
  } = req.query;

  const filter: any = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) {
      filter.category = cat._id;
    } else {
      filter.category = null;
    }
  }
  if (brand) filter.brand = { $regex: brand, $options: 'i' };
  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { brand: searchRegex },
    ];
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (minRating) {
    filter.ratings = { $gte: Number(minRating) };
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === 'price' || sort === 'price-asc') sortOption = { price: 1 };
  else if (sort === '-price' || sort === 'price-desc') sortOption = { price: -1 };
  else if (sort === 'createdAt' || sort === 'newest') sortOption = { createdAt: -1 };
  else if (sort === '-ratings' || sort === 'rating') sortOption = { ratings: -1 };
  else if (sort === '-sold' || sort === 'bestselling') sortOption = { sold: -1 };
  else if (sort === '-isFeatured' || sort === 'featured') sortOption = { isFeatured: -1, createdAt: -1 };

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    },
  });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    'category',
    'name slug'
  );
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ success: true, data: product });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ success: true, data: product });
});

export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(10)
    .sort('-createdAt');
  res.json({ success: true, data: products });
});

export const getNewArrivals = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ isActive: true })
    .populate('category', 'name slug')
    .limit(8)
    .sort('-createdAt');
  res.json({ success: true, data: products });
});

export const getBestSellers = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ isActive: true })
    .populate('category', 'name slug')
    .limit(8)
    .sort('-sold');
  res.json({ success: true, data: products });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    specifications,
    stock,
    tags,
    isFeatured,
  } = req.body;

  let images: string[] = [];

  const isCloudinaryReady =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder';

  if (req.file && isCloudinaryReady) {
    const b64 = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await (cloudinary as any).uploader.upload(dataURI, {
      folder: 'shopcart/products',
    });
    images.push(result.secure_url);
  } else if (req.file) {
    images.push(`https://placehold.co/500x500?text=${encodeURIComponent(name || 'Product')}`);
  }

  if (Array.isArray(req.body.images) && req.body.images.length > 0) {
    images = req.body.images;
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now().toString(36);

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    discountPrice,
    category,
    brand,
    images,
    specifications: specifications ? (typeof specifications === 'string' ? JSON.parse(specifications) : specifications) : [],
    stock: stock || 0,
    tags: tags ? (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : tags) : [],
    isFeatured: isFeatured === 'true' || isFeatured === true,
  });

  const populated = await product.populate('category', 'name slug');

  res.status(201).json({ success: true, data: populated });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const updateData = { ...req.body };

  if (updateData.specifications && typeof updateData.specifications === 'string') {
    updateData.specifications = JSON.parse(updateData.specifications);
  }
  if (updateData.tags && typeof updateData.tags === 'string') {
    updateData.tags = updateData.tags.split(',').map((t: string) => t.trim());
  }
  if (updateData.isFeatured !== undefined) {
    updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
  }

  const isCloudinaryReady =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder';

  if (req.file) {
    if (isCloudinaryReady) {
      const b64 = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await (cloudinary as any).uploader.upload(dataURI, {
        folder: 'shopcart/products',
      });
      updateData.images = [result.secure_url];
    } else {
      updateData.images = [`https://placehold.co/500x500?text=${encodeURIComponent(updateData.name || 'Product')}`];
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

export const toggleFeatured = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.json({ success: true, data: product });
});
