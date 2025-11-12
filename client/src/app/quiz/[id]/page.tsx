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

  // Если квиз уже завершен, показываем сообщение
  if (quizProgress?.completed && !showResult) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: 'white',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1>Квиз уже пройден!</h1>
          <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>
            Ты уже завершил этот квиз. Хочешь пройти его заново?
          </p>
          <button
            onClick={handleRestart}
            style={{
              background: '#0070f3',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16,
              marginRight: 15
            }}
          >
            Пройти заново
          </button>
          <button
            onClick={() => router.push('/quizzes')}
            style={{
              background: 'white',
              color: '#0070f3',
              border: '1px solid #0070f3',
              padding: '12px 24px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Другие квизы
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div>Загрузка квиза...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div>Квиз не найден</div>
        <button 
          onClick={() => router.push('/quizzes')}
          style={{
            background: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 6,
            cursor: 'pointer',
            marginTop: 20
          }}
        >
          Вернуться к квизам
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: 'white',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1>Результаты квиза!</h1>
          <h2 style={{ color: '#0070f3', fontSize: 48, margin: '20px 0' }}>
            {score} / {quiz.questions.length}
          </h2>
          <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>
            {score === quiz.questions.length ? '🎉 Идеально! Ты настоящий эксперт!' :
             score >= quiz.questions.length / 2 ? '👍 Хороший результат!' :
             '💪 Попробуй еще раз, у тебя получится!'}
          </p>

          {pointsChange && (
            <div style={{
              marginBottom: 30,
              padding: '15px 20px',
              background: pointsChange.change >= 0 ? '#d4edda' : '#f8d7da',
              border: `1px solid ${pointsChange.change >= 0 ? '#28a745' : '#dc3545'}`,
              borderRadius: 8,
              fontSize: 14,
              color: pointsChange.change >= 0 ? '#155724' : '#721c24'
            }}>
              <strong>🎯 Изменение очков: {pointsChange.change >= 0 ? '+' : ''}{pointsChange.change}</strong>
              <div style={{ marginTop: 5, fontSize: 12 }}>
                {pointsChange.message}
              </div>
              <div style={{ marginTop: 5, fontSize: 12, fontWeight: 'bold' }}>
                Всего очков: {pointsChange.total}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
            <button
              onClick={handleRestart}
              style={{
                background: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              Пройти еще раз
            </button>
            <button
              onClick={() => router.push('/quizzes')}
              style={{
                background: 'white',
                color: '#0070f3',
                border: '1px solid #0070f3',
                padding: '12px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              Другие квизы
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 30 }}>
        <h1>{quiz.title}</h1>
        <p style={{ color: '#666' }}>{quiz.description}</p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          padding: '15px 20px',
          background: '#f8f9fa',
          borderRadius: 8
        }}>
          <span>Вопрос {currentQuestion + 1} из {quiz.questions.length}</span>
          <span>Счет: {score}</span>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: 25 }}>{question.question}</h2>
        
        {question.imageUrl && (
          <div style={{
            marginBottom: 25,
            textAlign: 'center'
          }}>
            <img 
              src={question.imageUrl} 
              alt="Иллюстрация к вопросу"
              style={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {question.options.map((option, index) => {
            let buttonStyle = {
              padding: '15px 20px',
              border: '2px solid #e0e0e0',
              background: 'white',
              borderRadius: 8,
              cursor: answered ? 'default' : 'pointer',
              textAlign: 'left' as const,
              fontSize: 16,
              transition: 'all 0.2s'
            };

            if (answered) {
              if (index === question.correct) {
                buttonStyle.background = '#d4edda';
                buttonStyle.border = '2px solid #28a745';
                buttonStyle.color = '#155724';
              } else if (index === selectedAnswer && index !== question.correct) {
                buttonStyle.background = '#f8d7da';
                buttonStyle.border = '2px solid #dc3545';
                buttonStyle.color = '#721c24';
              }
            } else if (selectedAnswer === index) {
              buttonStyle.background = '#f0f7ff';
              buttonStyle.border = '2px solid #0070f3';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={buttonStyle}
                disabled={answered || quizProgress?.completed}
              >
                {option}
              </button>
            );
          })}
        </div>

        {!answered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || quizProgress?.completed}
            style={{
              width: '100%',
              background: selectedAnswer === null ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: 8,
              cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
              fontSize: 16,
              marginTop: 25
            }}
          >
            Ответить
          </button>
        ) : (
          <>
            {currentFact && (
              <div style={{
                marginTop: 25,
                padding: '15px 20px',
                background: '#e7f3ff',
                border: '1px solid #0070f3',
                borderRadius: 8,
                fontSize: 14,
                color: '#0056b3'
              }}>
                <strong>📚 Интересный факт:</strong> {currentFact}
              </div>
            )}
            
            <button
              onClick={handleNextQuestion}
              style={{
                width: '100%',
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                marginTop: 20
              }}
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Завершить квиз' : 'Следующий вопрос'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}