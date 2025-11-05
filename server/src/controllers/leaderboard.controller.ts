import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // Получаем топ 20 пользователей по очкам
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        createdAt: true
      },
      orderBy: {
        points: 'desc'
      },
      take: 20
    });

    // Если пользователь авторизован, находим его позицию
    let userPosition = null;
    const userId = req.userId;

    if (userId) {
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          points: true
        },
        orderBy: {
          points: 'desc'
        }
      });

      const position = allUsers.findIndex(user => user.id === userId) + 1;
      const userData = allUsers.find(user => user.id === userId);

      if (userData) {
        userPosition = {
          position,
          points: userData.points,
          name: (await prisma.user.findUnique({ 
            where: { id: userId },
            select: { name: true }
          }))?.name || 'Без имени'
        };
      }
    }

    res.json({
      leaderboard: topUsers.map((user, index) => ({
        ...user,
        position: index + 1
      })),
      userPosition
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Ошибка получения рейтинга' });
  }
};