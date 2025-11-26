import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Существующая функция
export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      email: true, 
      name: true, 
      score: true, 
      points: true,
      createdAt: true 
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json({ user });
};

// Новая функция поиска (исправленная)
export const searchUsers = async (req: Request, res: Response) => {
  const { q } = req.query;
  const userId = req.userId!;

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    return res.status(400).json({ error: 'Минимум 2 символа для поиска' });
  }

  try {
    // Получаем всех пользователей и фильтруем на стороне JS
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: userId } // Исключаем текущего пользователя
      },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        avatar: true,
        createdAt: true
      }
    });

    // Фильтруем результаты на стороне JS (case-insensitive)
    const searchTerm = q.toLowerCase();
    const users = allUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm))
    ).slice(0, 10); // Ограничиваем до 10 результатов

    res.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Ошибка поиска пользователей' });
  }
};