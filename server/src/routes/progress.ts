import { Router } from 'express';
import { 
  saveQuizProgress, 
  getUserProgress,
  saveQuestionAnswer,
  getQuizProgress
} from '../controllers/progress.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/save', authMiddleware, saveQuizProgress);
router.get('/my-progress', authMiddleware, getUserProgress);
router.post('/save-answer', authMiddleware, saveQuestionAnswer);
router.get('/quiz/:quizId', authMiddleware, getQuizProgress);

export default router;