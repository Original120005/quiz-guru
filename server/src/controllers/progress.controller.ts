import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveQuizProgress = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { quizId, score, total } = req.body;

  try {
    const progress = await prisma.userQuizProgress.upsert({
      where: {
        userId_quizId: {
          userId,
          quizId: parseInt(quizId)
        }
      },
      update: {
        score,
        total,
        completed: score === total
      },
      create: {
        userId,
        quizId: parseInt(quizId),
        score,
        total,
        completed: score === total
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Ошибка сохранения прогресса' });
  }
};

export const getUserProgress = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const progress = await prisma.userQuizProgress.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            category: true
          }
        }
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Ошибка получения прогресса' });
  }
};