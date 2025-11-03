import { gamesQuizzes } from './categories/games.quizzes';
import { sportQuizzes } from './categories/sport.quizzes';
import { geographyQuizzes } from './categories/geography.quizzes';
import { animalsQuizzes } from './categories/animals.quizzes';
import { QuizData } from './types';

export const allQuizzes: QuizData[] = [
  ...gamesQuizzes,
  ...sportQuizzes, 
  ...geographyQuizzes,
  ...animalsQuizzes
];