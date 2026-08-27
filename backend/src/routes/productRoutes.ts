import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/', getProducts);
router.get('/search', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/', protect, restrictTo('admin'), upload.single('image'), createProduct);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);
router.patch('/:id/featured', protect, restrictTo('admin'), toggleFeatured);

export default router;
