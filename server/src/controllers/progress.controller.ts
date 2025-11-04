import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveQuizProgress = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { quizId, score, total } = req.body;

  try {
    // Сначала находим существующий прогресс
    const existingProgress = await prisma.userQuizProgress.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: parseInt(quizId)
        }
      }
    });

    let progress;
    
    if (existingProgress) {
      // Если прогресс уже есть - увеличиваем счетчик попыток
      progress = await prisma.userQuizProgress.update({
        where: {
          userId_quizId: {
            userId,
            quizId: parseInt(quizId)
          }
        },
        data: {
          score,
          total,
          attempts: existingProgress.attempts + 1, // Увеличиваем попытки
          completed: score === total
        }
      });
    } else {
      // Если прогресса нет - создаем новую запись
      progress = await prisma.userQuizProgress.create({
        data: {
          userId,
          quizId: parseInt(quizId),
          score,
          total,
          attempts: 1, // Первая попытка
          completed: score === total
        }
      });
    }

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