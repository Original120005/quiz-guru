import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gamesQuizzes = [
  {
    title: "Стандартный квиз (легкий)",
    description: "Проверь знания в играх",
    difficulty: "easy", 
    questions: [
  {
    question: "В какой игре нужно крикнуть 'Уно!', когда у тебя осталась одна карта?",
    options: ["Монополия", "Уно", "Скраббл", "Дженга"],
    correct: 1,
    fact: "Уно — популярная карточная игра, где последняя карта объявляется криком 'Уно!'."
  },
  {
    question: "Сколько фигурок (фишек) игроков обычно в коробке Monopoly?",
    options: ["4", "6", "8", "2"],
    correct: 1,
    fact: "В классической Монополии — 6 фишек: собака, шляпа, машина, ботинок, корабль и утюг."
  },
  {
    question: "Кто главный герой игры Super Mario?",
    options: ["Луиджи", "Марио", "Принцесса Пич", "Боузер"],
    correct: 1,
    fact: "Марио — знаменитый сантехник, спасающий принцессу Пич от Боузера."
  },
  {
    question: "В каком настольном словесном слове складывают слова из букв?",
    options: ["Шахматы", "Дама", "Скраббл", "Каркассон"],
    correct: 2,
    fact: "Скраббл — игра на составление слов из букв на доске с очками."
  },
  {
    question: "Что падает и нужно его поворачивать в Tetris?",
    options: ["Квадраты", "Треугольники", "Фигуры", "Круги"],
    correct: 2,
    fact: "В Тетрисе разноцветные фигуры (тетромино) нужно укладывать без зазоров."
  }
]
  },

  {
    title: "Стандартный квиз (средниий)",
    description: "Проверь знания в играх",
    difficulty: "medium",
    questions: [
  {
    question: "Сколько всего свойств (улиц, ж/д, коммуналок) можно купить в классической Монополии?",
    options: ["22", "28", "32", "40"],
    correct: 1,
    fact: "В Монополии 28 свойств: 22 улицы, 4 железные дороги и 2 коммунальные услуги."
  },
  {
    question: "Кто создал Tetris и в каком году вышла первая версия?",
    options: ["Шигеру Миямото, 1985", "Алексей Пажитнов, 1984", "Маркус Перссон, 2009", "Гэри Гайгэкс, 1974"],
    correct: 1,
    fact: "Алексей Пажитнов создал Tetris в 1984 году на базе ЭВМ 'Электроника-60'."
  },
  {
    question: "В каком году вышла первая публичная версия Minecraft?",
    options: ["2009", "2011", "2014", "2007"],
    correct: 0,
    fact: "Minecraft впервые стал доступен публике 17 мая 2009 года как 'Cave Game'."
  },
  {
    question: "В каком году вышла первая редакция Dungeons & Dragons?",
    options: ["1974", "1977", "1989", "2000"],
    correct: 0,
    fact: "Оригинальная Dungeons & Dragons вышла в 1974 году от TSR."
  },
  {
    question: "В каком году вышла Super Mario Bros. для NES/Famicom?",
    options: ["1983", "1985", "1988", "1990"],
    correct: 1,
    fact: "Super Mario Bros. вышла 13 сентября 1985 года в Японии."
  }
]
  },

    {
    title: "Стандартный квиз (сложный)",
    description: "Проверь знания в играх",
    difficulty: "hard",
    questions: [
  {
    question: "Сколько копий Minecraft продано по всему миру на ноябрь 2025 года (рекорд всех времён)?",
    options: ["250 млн", "300 млн", "350 млн", "400 млн"],
    correct: 2,
    fact: "Minecraft — самая продаваемая игра всех времён с 350+ млн копий."
  },
  {
    question: "Как называется настольная игра, известная как самая сложная и длинная в истории (1500 часов на партию)?",
    options: ["Risk", "Advanced Squad Leader", "The Campaign for North Africa", "Monopoly"],
    correct: 2,
    fact: "The Campaign for North Africa — варгейм с 10 игроками, 9.5-футовой картой и правилами на тысячи страниц."
  },
  {
    question: "Кто самый молодой гроссмейстер в истории шахмат (12 лет 4 месяца 25 дней)?",
    options: ["Gukesh D.", "Sergey Karjakin", "Abhimanyu Mishra", "Praggnanandhaa"],
    correct: 2,
    fact: "Abhimanyu Mishra стал гроссмейстером в 2021 году в 12 лет 4 месяца 25 дней — рекорд на 2025 год."
  },
  {
    question: "В каком году вышла Super Mario Bros. для NES в Японии?",
    options: ["1983", "1985", "1986", "1988"],
    correct: 1,
    fact: "Super Mario Bros. вышла 13 сентября 1985 года — начало эры платформеров."
  },
  {
    question: "Какой киберспортивный турнир считается первым в истории (1972 год)?",
    options: ["Space Invaders Championship", "Quake Red Annihilation", "Intergalactic Spacewar Olympics", "Nintendo World Championships"],
    correct: 2,
    fact: "Intergalactic Spacewar Olympics — первый esports-турнир по игре Spacewar! в Стэнфорде."
  }
]
  },

  {
    title: "Rust by Original",
    description: "Проверь знания о расте",
    difficulty: "hard",
    questions: [
  {
    question: "Из чего крафтиться водяной пистолет?",
    options: ["50 металла", "75 металла и труба", "50 металла и 150 дерева", "75 металла"],
    correct: 3,
    fact: "Водяной пистолет крафтиться из 75 фрагментов металла.",
    imageUrl: "/quiz-images/game/quiz1_pistol.png"
  },
  {
    question: "Из чего крафтиться глушитель из жестяной банки?",
    options: ["40 металла", "150 металла", "2 мвк", "100 металла"],
    correct: 0,
    fact: "Глушитель из жестянной банки был добавлен в раст совсем недавно и крафт стоит его 40 металла.",
    imageUrl: "/quiz-images/game/quiz1_silence.png"
  },
  {
    question: "Какие карты и сколько фьюзов нужно для лутания train yard?",
    options: ["Синяя,зеленая,1 фьюз", "Синяя,зеленая,2 фьюза", "Синяя,1 фьюз", "Зеленая,2 фьюза"],
    correct: 0,
    fact: "Для лутания train yard нужно 1 фьюз синяя и зеленая карта что бы добраться до красной карточки",
    imageUrl: "/quiz-images/game/quiz1_trainyard.jpg"
  },
  {
    question: "Где можно взять m92(беретта)?",
    options: ["Аир,Танк,Вертолет", "Аир,Танк,Вертолет,Элитка", "Аир,Танк,Вертолет,Элитка,Ученый,Город", "Аир,Танк,Вертолет,Город"],
    correct: 2,
    fact: "Беретту можно взять множеством способов а именно 6(Аир,Танк,Вертолет,Элитка,Ученый,Город)",
    imageUrl: "/quiz-images/game/quiz1_m92.png"
  },
  {
    question: "Сколько бобовых гранат нужно потратить что бы зарейдить треугольный люк?",
    options: ["8", "12", "18", "22"],
    correct: 2,
    fact: "Для взрыва треугольного люка понадобиться 2,160 серы или 18 бобовых гранат",
    imageUrl: "/quiz-images/game/quiz1_hatch.png"
  },
  {
    question: "Сколько дерева выйдет с переработки деревяного забора?",
    options: ["500 дерева", "800 дерева", "1000 дерева", "650 дерева"],
    correct: 1,
    fact: "С переработки в не сейв зоне даст 800 дерева с переработки деревяного забора",
    imageUrl: "/quiz-images/game/quiz1_wall.png"
  },
  {
    question: "В каком году вышел раст?",
    options: ["2019", "2020", "2018", "2017"],
    correct: 2,
    fact: "Раст вышел в 2018 году ",
    imageUrl: "/quiz-images/game/quiz1_rust.jpg"
  }
]
  },

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