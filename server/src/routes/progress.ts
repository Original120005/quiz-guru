import { Router } from 'express';
import { saveQuizProgress, getUserProgress } from '../controllers/progress.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/save', authMiddleware, saveQuizProgress);
router.get('/my-progress', authMiddleware, getUserProgress);

export default router;