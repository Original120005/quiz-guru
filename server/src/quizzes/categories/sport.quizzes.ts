import { QuizData } from '../types';

export const sportQuizzes: QuizData[] = [
  {
    title: "Футбол для начинающих", 
    description: "Основные правила и факты о футболе",
    categorySlug: "sport",
    questions: [
      {
        question: "Сколько игроков в футбольной команде на поле?",
        options: ["9", "10", "11", "12"],
        correct: 2
      }
    ]
  }
];