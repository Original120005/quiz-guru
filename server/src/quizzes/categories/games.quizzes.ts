import { QuizData } from '../types';

export const gamesQuizzes: QuizData[] = [
  {
    title: "Видеоигры: основы",
    description: "Проверь свои знания в мире видеоигр",
    categorySlug: "games",
    questions: [
      {
        question: "Какая компания создала Mario?",
        options: ["Sega", "Nintendo", "Microsoft", "Sony"],
        correct: 1
      },
      {
        question: "В какой игре появился персонаж Мастер Чиф?",
        options: ["Call of Duty", "Halo", "Battlefield", "Doom"],
        correct: 1
      }
    ]
  }
];