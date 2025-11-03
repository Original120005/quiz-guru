import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, score: true, createdAt: true }
  });

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json({ user });
};