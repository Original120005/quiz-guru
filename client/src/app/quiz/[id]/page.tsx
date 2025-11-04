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

  useEffect(() => {
    fetchQuiz();
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

  const saveProgress = async (quizId: number, score: number, total: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId,
          score,
          total
        })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!answered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setAnswered(true);
    
    const isCorrect = selectedAnswer === quiz!.questions[currentQuestion].correct;
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
      saveProgress(quiz!.id, score, quiz!.questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setCurrentFact('');
  };

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
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {!answered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
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