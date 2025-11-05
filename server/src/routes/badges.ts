import { Router } from 'express';
import { getUserBadges, getAllBadges } from '../controllers/badge.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-badges', authMiddleware, getUserBadges);
router.get('/all', authMiddleware, getAllBadges);

export default router;