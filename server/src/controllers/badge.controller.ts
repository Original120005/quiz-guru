import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserBadges = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });

    res.json({ badges: userBadges });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ error: 'Ошибка получения бейджей' });
  }
};

export const getAllBadges = async (req: Request, res: Response) => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: [
        {
          type: 'asc'
        },
        {
          rarity: 'desc'
        }
      ]
    });

    res.json({ badges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Ошибка получения списка бейджей' });
  }
};