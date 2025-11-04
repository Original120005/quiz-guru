import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const animalsQuizzes = [
  {
    title: "Мир дикой природы",
    description: "Интересные факты о животных со всего мира",
    questions: [
      {
        question: "Какое животное самое быстрое на суше?",
        options: ["Гепард", "Антилопа гну", "Лев", "Газель"],
        correct: 0
      },
      {
        question: "Сколько сердец у осьминога?",
        options: ["1", "2", "3", "4"],
        correct: 2
      },
      {
        question: "Какое млекопитающее умеет летать?",
        options: ["Белка-летяга", "Летучая мышь", "Тушканчик", "Оба первых варианта"],
        correct: 3
      },
      {
        question: "Самый большой вид медведя?",
        options: ["Бурый медведь", "Белый медведь", "Гризли", "Панда"],
        correct: 1
      },
      {
        question: "Какая птица может летать задом наперед?",
        options: ["Колибри", "Попугай", "Стриж", "Ласточка"],
        correct: 0
      },
      {
        question: "Сколько лет может прожить гренландская акула?",
        options: ["До 100 лет", "До 200 лет", "До 400 лет", "До 500 лет"],
        correct: 3
      }
    ]
  },
  {
    title: "Морские обитатели",
    description: "Загадочный мир океана и его жителей",
    questions: [
      {
        question: "Самое большое животное на Земле?",
        options: ["Кашалот", "Синий кит", "Гигантский кальмар", "Китовая акула"],
        correct: 1
      },
      {
        question: "Сколько щупалец у осьминога?",
        options: ["6", "8", "10", "12"],
        correct: 1
      },
      {
        question: "Какая рыба может ходить по суше?",
        options: ["Илистый прыгун", "Летучая рыба", "Рыба-клоун", "Мурена"],
        correct: 0
      },
      {
        question: "Какой морской обитатель имеет три сердца?",
        options: ["Осьминог", "Кальмар", "Медуза", "Акула"],
        correct: 1
      },
      {
        question: "Самая ядовитая рыба в мире?",
        options: ["Рыба-камень", "Рыба-фугу", "Рыба-лев", "Морской дракон"],
        correct: 0
      },
      {
        question: "Какое морское млекопитающее известно как 'морская корова'?",
        options: ["Дюгонь", "Морж", "Тюлень", "Дельфин"],
        correct: 0
      }
    ]
  }
];

async function seedAnimalsQuizzes() {
  console.log('Начинаем добавление квизов по животным...');

  for (const quizData of animalsQuizzes) {
    try {
      await prisma.quiz.create({
        data: {
          ...quizData,
          categoryId: 1 // Игры
        }
      });
      console.log(`✓ Добавлен квиз: "${quizData.title}"`);
    } catch (error) {
      console.log(`✗ Ошибка с квизом "${quizData.title}":`, error);
    }
  }
  
  console.log('Готово! Добавлены квизы по животным');
}

seedAnimalsQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());