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

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        category: { slug }
      },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};