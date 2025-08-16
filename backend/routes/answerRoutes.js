import { Router } from 'express';
import { submitAnswer, listAnswersByUser } from '../controllers/answerController.js';
import { answerCreateValidator } from '../utils/validators.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.post('/', answerCreateValidator, submitAnswer);
router.get('/me', listAnswersByUser);

export default router;