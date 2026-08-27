import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', isInWishlist);

export default router;
