import { Router } from 'express';
import { generateQuestion } from '../controllers/questionController.js';
import { questionGenerateValidator } from '../utils/validators.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.post('/generate', questionGenerateValidator, generateQuestion);

export default router;