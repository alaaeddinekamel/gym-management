import express from 'express';
import {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach
} from '../controllers/coach.controller.js';
import { authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.post('/', authorizeRole(['admin']), createCoach);
router.put('/:id', authorizeRole(['admin']), updateCoach);
router.delete('/:id', authorizeRole(['admin']), deleteCoach);

export default router;