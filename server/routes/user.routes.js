import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authorizeRole(['admin']), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authorizeRole(['admin']), updateUser);
router.delete('/:id', authorizeRole(['admin']), deleteUser);

export default router;