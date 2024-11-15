import express from 'express';
import {
  getAllSchedules,
  getUserSchedules,
  createSchedule,
  updateScheduleStatus
} from '../controllers/schedule.controller.js';
import { authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authorizeRole(['admin']), getAllSchedules);
router.get('/user', getUserSchedules);
router.post('/', createSchedule);
router.patch('/:id/status', updateScheduleStatus);

export default router;