import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserRole,
  toggleUserActive,
  getDashboardStats,
  getRecentOrders,
  getSalesChart,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-orders', getRecentOrders);
router.get('/dashboard/sales-chart', getSalesChart);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.put('/:id/active', toggleUserActive);

export default router;
