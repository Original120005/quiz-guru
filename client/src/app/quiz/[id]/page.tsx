'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  question: string;
  options: string[];
  correct: number;
  fact?: string;
  imageUrl?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  category: {
    name: string;
  };
}

interface PointsChange {
  change: number;
  total: number;
  message: string;
}

interface QuizProgress {
  answers: {
    [key: number]: {
      selectedAnswer: number;
      isCorrect: boolean;
      answeredAt: string;
    }
  };
  completed: boolean;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentFact, setCurrentFact] = useState('');
  const [pointsChange, setPointsChange] = useState<PointsChange | null>(null);
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);

  useEffect(() => {
    fetchQuiz();
    fetchQuizProgress();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/quiz/${quizId}`);
      const data = await res.json();
      
      if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        console.error('Quiz not found');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция получения прогресса
  const fetchQuizProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/progress/quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setQuizProgress(data.progress);
        
        // Если квиз уже завершен, показываем результаты
        if (data.progress?.completed) {
          setShowResult(true);
        } else if (data.progress?.answers) {
          // Восстанавливаем прогресс из сохраненных ответов
          restoreProgress(data.progress.answers);
        }
      }
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
    }
  };

  // Восстанавливаем прогресс из сохраненных ответов
  const restoreProgress = (answers: any) => {
    let restoredScore = 0;
    const answeredQuestions = Object.keys(answers).map(Number);
    
    // Считаем правильные ответы
    answeredQuestions.forEach(questionIndex => {
      if (answers[questionIndex].isCorrect) {
        restoredScore++;
      }
    });
    
    setScore(restoredScore);
    
    // Если есть ответ на текущий вопрос, блокируем его
    if (answers[currentQuestion]) {
      setSelectedAnswer(answers[currentQuestion].selectedAnswer);
      setAnswered(true);
      setCurrentFact(quiz?.questions[currentQuestion]?.fact || '');
    }
  };

  // Сохраняем ответ на вопрос
  const saveQuestionAnswer = async (questionIndex: number, answerIndex: number, isCorrect: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/progress/save-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: parseInt(quizId),
          questionIndex,
          selectedAnswer: answerIndex,
          isCorrect
        })
      });
    } catch (error) {
      console.error('Error saving question answer:', error);
    }
  };

  const saveFinalProgress = async (quizId: number, score: number, total: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId,
          score,
          total,
          completed: true
        })
      });
      
      const data = await res.json();
      if (data.points) {
        setPointsChange(data.points);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!answered && !quizProgress?.completed) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || quizProgress?.completed) return;

    const isCorrect = selectedAnswer === quiz!.questions[currentQuestion].correct;
    
    // Сохраняем ответ сразу
    await saveQuestionAnswer(currentQuestion, selectedAnswer, isCorrect);

    setAnswered(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setCurrentFact(quiz!.questions[currentQuestion].fact || '');
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setCurrentFact('');
    } else {
      setShowResult(true);
      saveFinalProgress(quiz!.id, score, quiz!.questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setCurrentFact('');
    setPointsChange(null);
    setQuizProgress(null);
  };

  // Получаем класс для кнопки варианта ответа
  const getOptionClass = (index: number) => {
    if (!answered) {
      return selectedAnswer === index ? 'optionButton selected' : 'optionButton';
    }
    
    if (index === question.correct) {
      return 'optionButton correct';
    } else if (index === selectedAnswer && index !== question.correct) {
      return 'optionButton incorrect';
    }
    
    return 'optionButton';
  };

  // Если квиз уже завершен, показываем сообщение
  if (quizProgress?.completed && !showResult) {
    return (
      <div className="completedQuiz">
        <div className="resultCard">
          <h1>Квиз уже пройден!</h1>
          <p className="resultMessage">
            Ты уже завершил этот квиз. Хочешь пройти его заново?
          </p>
          <div className="resultActions">
            <button onClick={handleRestart}>
              Пройти заново
            </button>
            <button onClick={() => router.push('/quizzes')}>
              Другие квизы
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Загрузка квиза...</div>;
  }

  if (!quiz) {
    return (
      <div className="notFound">
        <div>Квиз не найден</div>
        <button onClick={() => router.push('/quizzes')}>
          Вернуться к квизам
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="completedQuiz">
        <div className="resultCard">
          <h1>Результаты квиза!</h1>
          <div className="scoreDisplay">
            {score} / {quiz.questions.length}
          </div>
          <p className="resultMessage">
            {score === quiz.questions.length ? '🎉 Идеально! Ты настоящий эксперт!' :
             score >= quiz.questions.length / 2 ? '👍 Хороший результат!' :
             '💪 Попробуй еще раз, у тебя получится!'}
          </p>

          {pointsChange && (
            <div className={`pointsChange ${pointsChange.change >= 0 ? 'positive' : 'negative'}`}>
              <strong>🎯 Изменение очков: {pointsChange.change >= 0 ? '+' : ''}{pointsChange.change}</strong>
              <div>{pointsChange.message}</div>
              <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
                Всего очков: {pointsChange.total}
              </div>
            </div>
          )}
          
          <div className="resultActions">
            <button onClick={handleRestart}>
              Пройти еще раз
            </button>
            <button onClick={() => router.push('/quizzes')}>
              Другие квизы
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quizContainer">
      <div className="quizHeader">
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>
        
        <div className="quizProgress">
          <span>Вопрос {currentQuestion + 1} из {quiz.questions.length}</span>
          <span>Счет: {score}</span>
        </div>
      </div>

      <div className="quizCard">
        <h2 className="questionText">{question.question}</h2>
        
        {question.imageUrl && (
          <div className="questionImage">
            <img 
              src={question.imageUrl} 
              alt="Иллюстрация к вопросу"
            />
          </div>
        )}
        
        <div className="optionsContainer">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={getOptionClass(index)}
              disabled={answered || quizProgress?.completed}
            >
              {option}
            </button>
          ))}
        </div>

        {!answered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || quizProgress?.completed}
            className="submitButton"
          >
            Ответить
          </button>
        ) : (
          <>
            {currentFact && (
              <div className="factBox">
                <strong>📚 Интересный факт:</strong> {currentFact}
              </div>
            )}
            
            <button
              onClick={handleNextQuestion}
              className="nextButton"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Завершить квиз' : 'Следующий вопрос'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}