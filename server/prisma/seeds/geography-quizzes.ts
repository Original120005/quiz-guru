import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const geographyQuizzes = [
  {
    title: "Страны и столицы мира",
    description: "Проверь знания географических столиц",
    questions: [
      {
        question: "Какая столица у этой страны?",
        imageUrl: "/quiz-images/geography/revo.png",
        options: ["Пекин", "Сеул", "Токио", "Бангкок"],
        correct: 2,
        fact: "Токио - самый populous мегаполис в мире с населением более 37 миллионов человек!"
      },
      {
        question: "Угадай столицу по достопримечательности",
        imageUrl: "/quiz-images/geography/ak.png",
        options: ["Лондон", "Париж", "Рим", "Берлин"],
        correct: 1,
        fact: "Эйфелева башня была построена как временное сооружение для Всемирной выставки 1889 года!"
      },
      {
        question: "Какая страна имеет эту столицу?",
        imageUrl: "/quiz-images/geography/revo.png",
        options: ["Франция", "Германия", "Великобритания", "Испания"],
        correct: 2,
        fact: "Лондонский Биг-Бен на самом деле называется Башней Елизаветы, а Биг-Бен - это имя колокола внутри!"
      },
      {
        question: "Столица какой страны изображена?",
        imageUrl: "/quiz-images/geography/revo.png",
        options: ["США", "Канада", "Австралия", "Великобритания"],
        correct: 0,
        fact: "Вашингтон - столица США, а Нью-Йорк - крупнейший финансовый и культурный центр страны!"
      },
      {
        question: "Угадай столицу по архитектуре",
        imageUrl: "/quiz-images/geography/revo.png",
        options: ["Афины", "Рим", "Стамбул", "Каир"],
        correct: 1,
        fact: "Рим называют 'Вечным городом' - его история насчитывает более 2800 лет!"
      },
      {
        question: "Какая столица известна этим видом?",
        imageUrl: "/quiz-images/geography/revo.png",
        options: ["Копенгаген", "Амстердам", "Стокгольм", "Осло"],
        correct: 1,
        fact: "Амстердам построен на 165 каналах и имеет 1281 мост - больше чем в Венеции!"
      }
    ]
  },
  {
    title: "Природные чудеса мира",
    description: "Угадай географические объекты по фотографиям",
    questions: [
      {
        question: "Что это за природное чудо?",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", // Гранд-Каньон
        options: ["Гранд-Каньон", "Долина смерти", "Брайс-Каньон", "Карловы Вары"],
        correct: 0,
        fact: "Гранд-Каньон в США имеет длину 446 км и глубину до 1800 метров - это больше чем высота небоскреба Бурдж-Халифа!"
      },
      {
        question: "Угадай водопад по фото",
        imageUrl: "https://images.unsplash.com/photo-1588392382834-a8914b5baffc?w=400&h=300&fit=crop", // Ниагара
        options: ["Ниагарский", "Виктория", "Анхель", "Игуасу"],
        correct: 0,
        fact: "Ниагарский водопад расположен на границе США и Канады и ежесекундно низвергает 2800 кубометров воды!"
      },
      {
        question: "Какая пустыня изображена?",
        imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop", // Сахара
        options: ["Сахара", "Гоби", "Каракумы", "Атакама"],
        correct: 0,
        fact: "Сахара - самая большая жаркая пустыня в мире, ее площадь сравнима с территорией США!"
      },
      {
        question: "Что это за знаменитая гора?",
        imageUrl: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&h=300&fit=crop", // Эверест
        options: ["Эверест", "Килиманджаро", "Монблан", "Маттерхорн"],
        correct: 0,
        fact: "Эверест продолжает расти примерно на 4 мм каждый год из-за тектонического движения плит!"
      },
      {
        question: "Угадай вулкан по фото",
        imageUrl: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop", // Фудзияма
        options: ["Везувий", "Фудзияма", "Этна", "Попокатепетль"],
        correct: 1,
        fact: "Фудзияма - действующий вулкан, последнее извержение было в 1707 году. Это священная гора для японцев!"
      },
      {
        question: "Какое озеро изображено?",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", // Байкал
        options: ["Байкал", "Верхнее", "Виктория", "Танганьика"],
        correct: 0,
        fact: "Байкал содержит 20% всей незамерзшей пресной воды на планете - это крупнейший резервуар пресной воды в мире!"
      }
    ]
  }
];

async function seedGeographyQuizzes() {
  console.log('Начинаем добавление квизов по географии с изображениями...');
  
  for (const quizData of geographyQuizzes) {
    try {
      await prisma.quiz.create({
        data: {
          ...quizData,
          categoryId: 3 // География
        }
      });
      console.log(`✓ Добавлен квиз: "${quizData.title}"`);
    } catch (error) {
      console.log(`✗ Ошибка с квизом "${quizData.title}":`, error);
    }
  }
  
  console.log('Готово! Добавлены квизы по географии с изображениями');
}

seedGeographyQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());