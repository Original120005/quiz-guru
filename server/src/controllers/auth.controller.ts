import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Простая валидация пароля
const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Пароль должен быть не менее 6 символов' };
  }
  return { valid: true };
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  // Валидация пароля
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email уже занят' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Вход успешен',
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
};