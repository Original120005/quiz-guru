export interface QuizData {
  title: string;
  description: string;
  categorySlug: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}