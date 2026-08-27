import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/', restrictTo('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', restrictTo('admin'), updateOrderStatus);
router.put('/:id/payment', restrictTo('admin'), updatePaymentStatus);

export default router;
