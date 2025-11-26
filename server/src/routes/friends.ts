import { Router } from 'express';
import { 
  sendFriendRequest, 
  getFriends, 
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendshipStatus
} from '../controllers/friends.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/request', authMiddleware, sendFriendRequest);
router.get('/', authMiddleware, getFriends);
router.get('/requests', authMiddleware, getFriendRequests);
router.post('/accept/:id', authMiddleware, acceptFriendRequest);
router.post('/decline/:id', authMiddleware, declineFriendRequest);
router.delete('/:id', authMiddleware, removeFriend);
router.get('/status/:targetUserId', authMiddleware, getFriendshipStatus); // ← ВАЖНО: ДОБАВЬ ЭТУ СТРОКУ

export default router;