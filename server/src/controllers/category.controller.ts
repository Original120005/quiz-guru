import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { quizzes: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getQuizzesByCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { difficulty } = req.query;

  try {
    const whereClause: any = {
      category: { slug }
    };

    // Добавляем фильтр по сложности если указан
    if (difficulty && difficulty !== 'all') {
      whereClause.difficulty = difficulty;
    }

    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      include: {
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        {
          // Используем правильный синтаксис для порядка
          createdAt: 'desc' as const
        }
      ]
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};