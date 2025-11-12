import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BadgeService {
  // Проверяем и выдаем бейджи пользователю
  static async checkAndAwardBadges(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          include: {
            quiz: {
              include: {
                category: true
              }
            }
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) return [];

    const earnedBadges = [];
    const allBadges = await prisma.badge.findMany();

    for (const badge of allBadges) {
      // Проверяем, есть ли уже этот бейдж у пользователя
      const alreadyHasBadge = user.badges.some(userBadge => userBadge.badgeId === badge.id);
      if (alreadyHasBadge) continue;

      // Проверяем условие бейджа
      const condition = badge.condition as any;
      let shouldAward = false;

      switch (condition.type) {
        case 'quizzes_completed':
          shouldAward = await this.checkQuizzesCompleted(userId, condition.threshold);
          break;
        
        case 'category_completed':
          shouldAward = await this.checkCategoryCompleted(userId, condition.categorySlug);
          break;
        
        case 'perfect_quizzes':
          shouldAward = await this.checkPerfectQuizzes(userId, condition.threshold);
          break;

        case 'hard_quizzes_completed':
          shouldAward = await this.checkHardQuizzesCompleted(userId, condition.threshold);
          break;
      }

      if (shouldAward) {
        // Выдаем бейдж
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id
          },
          include: {
            badge: true
          }
        });
        
        earnedBadges.push(userBadge);
        console.log(`🎉 Пользователь ${userId} получил бейдж: ${badge.name}`);
      }
    }

    return earnedBadges;
  }

  // Проверка количества пройденных квизов
  private static async checkQuizzesCompleted(userId: number, threshold: number): Promise<boolean> {
    const completedQuizzes = await prisma.userQuizProgress.count({
      where: { 
        userId,
        completed: true
      }
    });
    
    return completedQuizzes >= threshold;
  }

  // Проверка завершения категории
  private static async checkCategoryCompleted(userId: number, categorySlug: string): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        quizzes: {
          select: { id: true }
        }
      }
    });

    if (!category || category.quizzes.length === 0) return false;

    const userProgress = await prisma.userQuizProgress.findMany({
      where: {
        userId,
        quizId: { in: category.quizzes.map(q => q.id) },
        completed: true
      }
    });

    return userProgress.length === category.quizzes.length;
  }

  // Проверка идеальных результатов
  private static async checkPerfectQuizzes(userId: number, threshold: number): Promise<boolean> {
    const perfectQuizzes = await prisma.userQuizProgress.count({
      where: {
        userId,
        completed: true,
        score: {
          equals: prisma.userQuizProgress.fields.total
        }
      }
    });
    
    return perfectQuizzes >= threshold;
  }

  // Проверка пройденных сложных квизов
  private static async checkHardQuizzesCompleted(userId: number, threshold: number): Promise<boolean> {
    const hardQuizzesCompleted = await prisma.userQuizProgress.count({
      where: { 
        userId,
        completed: true,
        quiz: {
          is: {
            difficulty: 'hard'
          }
        }
      }
    });
    
    return hardQuizzesCompleted >= threshold;
  }
}