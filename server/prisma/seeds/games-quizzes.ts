import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gamesQuizzes = [
  {
    title: "Легендарные видеоигры 2000-х",
    description: "Ностальгический тест по играм нулевых",
    questions: [
      {
        question: "В какой игре впервые появился крафтинг предметов?",
        options: ["World of Warcraft", "Minecraft", "Terraria", "The Elder Scrolls III: Morrowind"],
        correct: 1
      },
      {
        question: "Какая игра установила рекорд по предзаказам в 2004 году?",
        options: ["Half-Life 2", "World of Warcraft", "Halo 2", "GTA: San Andreas"],
        correct: 2
      },
      {
        question: "Какой жанр популяризовала игра 'Guitar Hero' в 2005?",
        options: ["Ритм-игры", "Симуляторы", "Хорроры", "Стратегии"],
        correct: 0
      },
      {
        question: "Какая компания разработала серию игр 'Mass Effect'?",
        options: ["Bethesda", "BioWare", "Ubisoft", "CD Projekt Red"],
        correct: 1
      },
      {
        question: "Какой игровой движок использовался в 'Half-Life 2'?",
        options: ["Unreal Engine 2", "Source", "id Tech 3", "CryEngine"],
        correct: 1
      },
      {
        question: "В какой игре появилась знаменитая фраза 'It's dangerous to go alone! Take this.'?",
        options: ["The Legend of Zelda", "Final Fantasy", "Chrono Trigger", "EarthBound"],
        correct: 0
      }
    ]
  },
  {
    title: "Киберспорт и чемпионаты",
    description: "Тест о профессиональном гейминге и турнирах",
    questions: [
      {
        question: "Какой турнир по Dota 2 имеет самый большой призовой фонд?",
        options: ["ESL One", "The International", "DreamHack", "StarLadder"],
        correct: 1
      },
      {
        question: "В какой игре проводится чемпионат мира 'League of Legends World Championship'?",
        options: ["Dota 2", "League of Legends", "Counter-Strike", "Overwatch"],
        correct: 1
      },
      {
        question: "Какая страна доминировала в StarCraft: Brood War в 2000-х?",
        options: ["США", "Китай", "Южная Корея", "Швеция"],
        correct: 2
      },
      {
        question: "Какой киберспортивный дисциплиной является 'Melee'?",
        options: ["Super Smash Bros.", "Street Fighter", "Tekken", "Mortal Kombat"],
        correct: 0
      },
      {
        question: "Какой организации принадлежит серия турниров 'ESL Pro League'?",
        options: ["ESL", "DreamHack", "MLG", "IEM"],
        correct: 0
      },
      {
        question: "В каком году киберспорт впервые включили в программу Азиатских игр?",
        options: ["2018", "2020", "2022", "2024"],
        correct: 0
      }
    ]
  }
];

async function seedGamesQuizzes() {
  console.log('Начинаем добавление квизов по играм...');

  for (const quizData of gamesQuizzes) {
    try {
      await prisma.quiz.create({
        data: {
          ...quizData,
          categoryId: 2 // Игры
        }
      });
      console.log(`✓ Добавлен квиз: "${quizData.title}"`);
    } catch (error) {
      console.log(`✗ Ошибка с квизом "${quizData.title}":`, error);
    }
  }
  
  console.log('Готово! Добавлены квизы по играм');
}

seedGamesQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());