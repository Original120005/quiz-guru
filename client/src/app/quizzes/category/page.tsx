'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: any[];
  category: {
    name: string;
    slug: string;
  };
  createdAt: string;
}

interface QuizProgress {
  id: number;
  score: number;
  total: number;
  attempts: number;
  completed: boolean;
  quiz: Quiz;
}

export default function CategoryQuizzesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('category');
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userProgress, setUserProgress] = useState<QuizProgress[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchQuizzes();
      fetchUserProgress();
    }
  }, [slug]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${slug}/quizzes`);
      const data = await res.json();
      setQuizzes(data.quizzes || []);
      if (data.quizzes?.[0]?.category?.name) {
        setCategoryName(data.quizzes[0].category.name);
      } else {
        const catRes = await fetch('http://localhost:5000/api/categories');
        const catData = await catRes.json();
        const category = catData.categories.find((c: any) => c.slug === slug);
        if (category) setCategoryName(category.name);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/progress/my-progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUserProgress(data.progress || []);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizProgress = (quizId: number) => {
    return userProgress.find(progress => progress.quizId === quizId);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div>Загрузка квизов...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 30 }}>
        <Link 
          href="/quizzes"
          style={{ color: '#0070f3', textDecoration: 'none' }}
        >
          ← Назад к категориям
        </Link>
        <h1 style={{ margin: '10px 0 5px 0' }}>
          {categoryName || 'Квизы'}
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          {quizzes.length} квиз{quizzes.length === 1 ? '' : quizzes.length > 1 && quizzes.length < 5 ? 'а' : 'ов'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {quizzes.map((quiz) => {
          const progress = getQuizProgress(quiz.id);
          const hasProgress = !!progress;
          const isPerfect = hasProgress && progress.score === progress.total;
          const isCompleted = hasProgress && progress.completed;
          const scoreText = progress ? `${progress.score}/${progress.total}` : null;
          const attemptsText = progress ? progress.attempts : 0;

          let cardStyle = {
            background: 'white',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #eee',
            position: 'relative' as const
          };

          let badgeStyle = {
            position: 'absolute' as const,
            top: -10,
            right: -10,
            color: 'white',
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 'bold' as const,
            display: 'none' as const
          };

          let buttonStyle = {
            background: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          };

          let resultTextStyle = {
            color: '#0070f3',
            fontWeight: 'bold' as const
          };

          if (isPerfect) {
            cardStyle.background = '#f0fff4';
            cardStyle.border = '2px solid #28a745';
            badgeStyle.background = '#28a745';
            badgeStyle.display = 'block';
            buttonStyle.background = '#28a745';
            resultTextStyle.color = '#28a745';
          }
          else if (hasProgress && !isPerfect) {
            cardStyle.background = '#fff5f5';
            cardStyle.border = '2px solid #dc3545';
            badgeStyle.background = '#dc3545';
            badgeStyle.display = 'block';
            buttonStyle.background = '#dc3545';
            resultTextStyle.color = '#dc3545';
          }

          return (
            <div
              key={quiz.id}
              style={cardStyle}
            >
              <div style={badgeStyle}>
                {isPerfect ? '✓ Пройден' : 'Пройти снова'}
              </div>
              
              <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                {quiz.title}
              </h3>
              <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                {quiz.description}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: 14,
                color: '#888'
              }}>
                <div>
                  <span>{quiz.questions.length} вопросов</span>
                  {scoreText && (
                    <>
                      <span style={{ margin: '0 12px' }}>•</span>
                      <span style={resultTextStyle}>
                        Результат: {scoreText}
                      </span>
                      <span style={{ margin: '0 12px' }}>•</span>
                      <span style={{ color: '#6c757d', fontWeight: 'bold' }}>
                        Попыток: {attemptsText}
                      </span>
                    </>
                  )}
                </div>
                
                <button
                  style={buttonStyle}
                  onClick={() => router.push(`/quiz/${quiz.id}`)}
                >
                  {hasProgress ? 'Пройти снова' : 'Начать квиз'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 60, 
          color: '#666',
          background: 'white',
          borderRadius: 12,
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Квизов пока нет</h3>
          <p>Будь первым, кто создаст квиз в этой категории!</p>
        </div>
      )}
    </div>
  );
}