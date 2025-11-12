import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BadgeService } from '../services/badge.service';

const prisma = new PrismaClient();

// Сохраняем ответ на вопрос
export const saveQuestionAnswer = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { quizId, questionIndex, selectedAnswer, isCorrect } = req.body;

  try {
    // Находим существующий прогресс
    let progress = await prisma.userQuizProgress.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: parseInt(quizId)
        }
      }
    });

    const answers = progress?.answers ? (progress.answers as any) : {};
    
    // Сохраняем ответ на текущий вопрос
    answers[questionIndex] = {
      selectedAnswer,
      isCorrect,
      answeredAt: new Date().toISOString()
    };

    if (progress) {
      // Обновляем существующий прогресс
      progress = await prisma.userQuizProgress.update({
        where: {
          userId_quizId: {
            userId,
            quizId: parseInt(quizId)
          }
        },
        data: {
          answers: answers
        }
      });
    } else {
      // Создаем новый прогресс
      progress = await prisma.userQuizProgress.create({
        data: {
          userId,
          quizId: parseInt(quizId),
          score: 0,
          total: 0,
          answers: answers
        }
      });
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error saving question answer:', error);
    res.status(500).json({ error: 'Ошибка сохранения ответа' });
  }
};

// Получаем прогресс по квизу
export const getQuizProgress = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { quizId } = req.params;

  try {
    const progress = await prisma.userQuizProgress.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: parseInt(quizId)
        }
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    res.status(500).json({ error: 'Ошибка получения прогресса' });
  }
};

export const saveQuizProgress = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { quizId, score, total } = req.body;

  try {
    // Находим пользователя и существующий прогресс
    const [user, existingProgress] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userQuizProgress.findUnique({
        where: {
          userId_quizId: {
            userId,
            quizId: parseInt(quizId)
          }
        },
        include: {
          quiz: {
            include: {
              category: true
            }
          }
        }
      })
    ]);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    let progress;
    let pointsChange = 0;
    let pointsMessage = '';

    // Логика начисления очков
    if (existingProgress) {
      // Штраф за повторную попытку: -10 очков
      pointsChange -= 10;
      pointsMessage += 'Повторная попытка: -10 очков. ';

      // Обновляем прогресс и увеличиваем счетчик попыток
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
          attempts: existingProgress.attempts + 1,
          completed: score === total
        },
        include: {
          quiz: {
            include: {
              category: true
            }
          }
        }
      });
    } else {
      // Первая попытка: нет бонуса
      pointsMessage += 'Первая попытка. ';

      // Создаем новую запись прогресса
      progress = await prisma.userQuizProgress.create({
        data: {
          userId,
          quizId: parseInt(quizId),
          score,
          total,
          attempts: 1,
          completed: score === total
        },
        include: {
          quiz: {
            include: {
              category: true
            }
          }
        }
      });
    }

    // Бонус за идеальный результат: +10 очков
    const isPerfect = score === total;
    if (isPerfect) {
      pointsChange += 10;
      pointsMessage += 'Идеальный результат: +10 очков. ';
    }

    // Проверяем, пройдены ли все квизы в категории (только если у квиза есть категория)
    if (progress.quiz.categoryId) {
      const categoryCompleted = await checkCategoryCompletion(userId, progress.quiz.categoryId);
      if (categoryCompleted) {
        pointsChange += 50;
        pointsMessage += 'Все квизы категории пройдены: +50 очков. ';
      }
    }

    // Гарантируем, что очки не уйдут в минус
    const newPoints = Math.max(0, user.points + pointsChange);
    
    // Обновляем очки пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: newPoints
      }
    });

    // Проверяем и выдаем бейджи
    const earnedBadges = await BadgeService.checkAndAwardBadges(userId);

    res.json({ 
      progress, 
      points: {
        change: pointsChange,
        total: updatedUser.points,
        message: pointsMessage
      },
      earnedBadges
    });

  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Ошибка сохранения прогресса' });
  }
};

// Функция проверки завершения всех квизов в категории
async function checkCategoryCompletion(userId: number, categoryId: number): Promise<boolean> {
  try {
    // Находим все квизы в категории
    const categoryQuizzes = await prisma.quiz.findMany({
      where: { categoryId },
      select: { id: true }
    });

    if (categoryQuizzes.length === 0) return false;

    // Находим прогресс пользователя по этим квизам
    const userProgress = await prisma.userQuizProgress.findMany({
      where: {
        userId,
        quizId: { in: categoryQuizzes.map(q => q.id) },
        completed: true
      }
    });

    // Проверяем, все ли квизы пройдены
    return userProgress.length === categoryQuizzes.length && 
           userProgress.every(progress => progress.completed);
  } catch (error) {
    console.error('Error checking category completion:', error);
    return false;
  }
}

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