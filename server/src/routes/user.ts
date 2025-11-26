import { Router } from 'express';
import { getMe, searchUsers } from '../controllers/user.controller'; // Один импорт
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.get('/search', authMiddleware, searchUsers);

export default router;