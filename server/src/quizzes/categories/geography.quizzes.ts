import { QuizData } from '../types';

export const geographyQuizzes: QuizData[] = [
  {
    title: "Столицы мира",
    description: "Угадай столицы известных стран", 
    categorySlug: "geography",
    questions: [
      {
        question: "Какая столица у Японии?",
        options: ["Пекин", "Сеул", "Токио", "Бангкок"],
        correct: 2
      }
    ]
  }
];