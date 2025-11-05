import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const badges = [
  // Прогрессивные бейджи
  {
    name: "Новичок",
    description: "Пройди свой первый квиз",
    icon: "🎮",
    color: "#cd7f32", // бронза
    rarity: "common",
    type: "progressive",
    condition: {
      type: "quizzes_completed",
      threshold: 1
    }
  },
  {
    name: "Любитель", 
    description: "Пройди 10 квизов",
    icon: "🎯",
    color: "#c0c0c0", // серебро
    rarity: "rare",
    type: "progressive", 
    condition: {
      type: "quizzes_completed",
      threshold: 10
    }
  },
  {
    name: "Эксперт",
    description: "Пройди 25 квизов", 
    icon: "🏆",
    color: "#ffd700", // золото
    rarity: "epic",
    type: "progressive",
    condition: {
      type: "quizzes_completed", 
      threshold: 25
    }
  },
  {
    name: "Легенда",
    description: "Пройди 50 квизов",
    icon: "💎", 
    color: "#b9f2ff", // алмаз
    rarity: "legendary",
    type: "progressive",
    condition: {
      type: "quizzes_completed",
      threshold: 50
    }
  },

  // Категорийные бейджи
  {
    name: "Географ",
    description: "Пройди все квизы по географии",
    icon: "🌍",
    color: "#4CAF50", // зеленый
    rarity: "rare",
    type: "category", 
    condition: {
      type: "category_completed",
      categorySlug: "geography"
    }
  },
  {
    name: "Геймер",
    description: "Пройди все квизы по играм",
    icon: "🎮", 
    color: "#9C27B0", // фиолетовый
    rarity: "rare",
    type: "category",
    condition: {
      type: "category_completed", 
      categorySlug: "games"
    }
  },
  {
    name: "Спортсмен",
    description: "Пройди все квизы по спорту",
    icon: "⚽",
    color: "#FF9800", // оранжевый
    rarity: "rare",
    type: "category",
    condition: {
      type: "category_completed",
      categorySlug: "sport" 
    }
  },
  {
    name: "Зоолог",
    description: "Пройди все квизы по животным",
    icon: "🐾",
    color: "#795548", // коричневый
    rarity: "rare", 
    type: "category",
    condition: {
      type: "category_completed",
      categorySlug: "animals"
    }
  },

  // Мастерские бейджи
  {
    name: "Идеал",
    description: "Получи 5 идеальных результатов",
    icon: "⭐",
    color: "#FFD700", // золотой
    rarity: "epic",
    type: "mastery",
    condition: {
      type: "perfect_quizzes",
      threshold: 5
    }
  },
  {
    name: "Негрешим",
    description: "Получи 15 идеальных результатов", 
    icon: "🌟",
    color: "#E5E4E2", // платина
    rarity: "epic",
    type: "mastery",
    condition: {
      type: "perfect_quizzes",
      threshold: 15
    }
  },
  {
    name: "Бог квизов",
    description: "Получи 30 идеальных результатов",
    icon: "💫",
    color: "#B9F2FF", // бриллиант
    rarity: "legendary", 
    type: "mastery",
    condition: {
      type: "perfect_quizzes",
      threshold: 30
    }
  }
];

async function seedBadges() {
  console.log('Начинаем добавление бейджей...');

  // Сначала удаляем старые бейджи если есть
  await prisma.userBadge.deleteMany({});
  await prisma.badge.deleteMany({});
  console.log('Очищены старые бейджи');

  for (const badgeData of badges) {
    try {
      await prisma.badge.create({
        data: badgeData
      });
      console.log(`✓ Добавлен бейдж: "${badgeData.name}"`);
    } catch (error) {
      console.log(`✗ Ошибка с бейджем "${badgeData.name}":`, error);
    }
  }
  
  console.log('Готово! Добавлены все бейджи');
}

seedBadges()
  .catch(console.error)
  .finally(() => prisma.$disconnect());