import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorizeRole(['admin']), createProduct);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteProduct);

export default router;