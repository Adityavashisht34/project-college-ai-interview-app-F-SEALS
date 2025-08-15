import { Router } from 'express';
import { signup, login, me, logout } from '../controllers/authController.js';
import { signupValidator, loginValidator } from '../utils/validators.js';
import { protect } from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/me', protect, me);
router.post('/logout', protect, logout);

export default router;