import { Router } from 'express';
import { getQuizById } from '../controllers/quiz.controller';

const router = Router();

router.get('/:id', getQuizById);

export default router;