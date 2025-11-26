import { Request, Response, NextFunction } from 'express';

// Простой in-memory rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const authRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const WINDOW_MS = 15 * 60 * 1000; // 15 минут
  const MAX_ATTEMPTS = 5; // Максимум 5 попыток

  const userAttempts = loginAttempts.get(ip);

  if (!userAttempts) {
    // Первая попытка
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return next();
  }

  // Проверяем не истекло ли окно
  if (now - userAttempts.lastAttempt > WINDOW_MS) {
    // Сброс счетчика
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return next();
  }

  // Проверяем количество попыток
  if (userAttempts.count >= MAX_ATTEMPTS) {
    return res.status(429).json({ 
      error: 'Слишком много попыток входа. Попробуйте через 15 минут' 
    });
  }

  // Увеличиваем счетчик
  userAttempts.count++;
  userAttempts.lastAttempt = now;
  
  next();
};