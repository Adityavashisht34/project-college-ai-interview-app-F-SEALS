import { Router } from 'express';
import { createInterview, listInterviews, getInterview } from '../controllers/interviewController.js';
import { interviewCreateValidator } from '../utils/validators.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.post('/', interviewCreateValidator, createInterview);
router.get('/', listInterviews);
router.get('/:id', getInterview);

export default router;
