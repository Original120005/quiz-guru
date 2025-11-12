import { Router } from 'express';
import { getCategories, getQuizzesByCategory } from '../controllers/category.controller';


const router = Router();

router.get('/', getCategories);
router.get('/:slug/quizzes', getQuizzesByCategory);

export default router;