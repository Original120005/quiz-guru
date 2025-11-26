import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Rate limiting только на логин (регистрация обычно реже используется)
router.post('/register', register);
router.post('/login', authRateLimit, login); // ← ДОБАВЛЯЕМ MIDDLEWARE

export default router;