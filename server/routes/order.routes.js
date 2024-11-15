import express from 'express';
import {
  getAllOrders,
  getOrdersByUser,
  createOrder,
  updateOrderStatus
} from '../controllers/order.controller.js';
import { authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authorizeRole(['admin']), getAllOrders);
router.get('/user', getOrdersByUser);
router.post('/', createOrder);
router.patch('/:id/status', authorizeRole(['admin']), updateOrderStatus);

export default router;