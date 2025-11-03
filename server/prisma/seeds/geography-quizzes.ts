import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const geographyQuizzes = [
  {
    title: "Страны и столицы мира",
    description: "Проверь знания географических столиц",
    questions: [
      {
        question: "Какая столица у Новой Зеландии?",
        options: ["Окленд", "Крайстчерч", "Веллингтон", "Квинстаун"],
        correct: 2
      },
      {
        question: "Столица Бразилии?",
        options: ["Рио-де-Жанейро", "Сан-Паулу", "Бразилиа", "Салвадор"],
        correct: 2
      },
      {
        question: "Какая страна имеет столицу Анкара?",
        options: ["Турция", "Сирия", "Иран", "Ирак"],
        correct: 0
      },
      {
        question: "Столица Южной Африки?",
        options: ["Кейптаун", "Йоханнесбург", "Претория", "Все три верны"],
        correct: 3
      },
      {
        question: "Какая столица находится в Европе?",
        options: ["Баку", "Ереван", "Тбилиси", "Бухарест"],
        correct: 3
      },
      {
        question: "Столица самой большой по площади страны?",
        options: ["Пекин", "Оттава", "Москва", "Вашингтон"],
        correct: 2
      }
    ]
  },
  {
    title: "Природные чудеса и рекорды",
    description: "Тест о природных феноменах и географических рекордах",
    questions: [
      {
        question: "Самая длинная река в мире?",
        options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"],
        correct: 0
      },
      {
        question: "Самое глубокое озеро в мире?",
        options: ["Байкал", "Танганьика", "Верхнее", "Виктория"],
        correct: 0
      },
      {
        question: "В какой стране находится пустыня Атакама?",
        options: ["Перу", "Боливия", "Чили", "Аргентина"],
        correct: 2
      },
      {
        question: "Самый высокий водопад в мире?",
        options: ["Анхель", "Ниагара", "Виктория", "Игуасу"],
        correct: 0
      },
      {
        question: "Какая гора является самой высокой в Африке?",
        options: ["Килиманджаро", "Кения", "Меру", "Рувензори"],
        correct: 0
      },
      {
        question: "Самый большой остров в мире?",
        options: ["Мадагаскар", "Гренландия", "Новая Гвинея", "Борнео"],
        correct: 1
      }
    ]
  }
];

async function seedGeographyQuizzes() {
  console.log('Начинаем добавление квизов по географии...');
  
  for (const quizData of geographyQuizzes) {
    try {
      await prisma.quiz.create({
        data: {
          ...quizData,
          authorId: 1,
          categoryId: 3 // География
        }
      });
      console.log(`✓ Добавлен квиз: "${quizData.title}"`);
    } catch (error) {
      console.log(`✗ Ошибка с квизом "${quizData.title}":`, error);
    }
  }
  
  console.log('Готово! Добавлены квизы по географии');
}

seedGeographyQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());