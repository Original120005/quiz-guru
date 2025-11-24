'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: any[];
  difficulty: string;
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
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const difficulties = [
    { key: 'all', label: 'Все', color: '#0070f3' },
    { key: 'easy', label: 'Легкий', color: '#22c55e' },
    { key: 'medium', label: 'Средний', color: '#eab308' },
    { key: 'hard', label: 'Сложный', color: '#ef4444' }
  ];

  useEffect(() => {
    if (slug) {
      fetchQuizzes();
      fetchUserProgress();
    }
  }, [slug, selectedDifficulty]);

  const fetchQuizzes = async () => {
    try {
      let url = `http://localhost:5000/api/categories/${slug}/quizzes`;
      if (selectedDifficulty !== 'all') {
        url += `?difficulty=${selectedDifficulty}`;
      }

      const res = await fetch(url);
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

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { color: '#22c55e', label: 'Легкий', icon: '🟢' };
      case 'medium':
        return { color: '#eab308', label: 'Средний', icon: '🟡' };
      case 'hard':
        return { color: '#ef4444', label: 'Сложный', icon: '🔴' };
      default:
        return { color: '#6b7280', label: 'Не указано', icon: '⚪' };
    }
  };

  if (loading) {
    return <div className="loading">Загрузка квизов...</div>;
  }

  return (
    <div className="categoryContainer">
      <div className="categoryHeader">
        <Link href="/quizzes" className="backLink">
          ← Назад к категориям
        </Link>
        <h1 className="categoryTitle">
          {categoryName || 'Квизы'}
        </h1>
        <p className="categoryStats">
          {quizzes.length} квиз{quizzes.length === 1 ? '' : quizzes.length > 1 && quizzes.length < 5 ? 'а' : 'ов'}
        </p>
      </div>

      {/* Фильтр по сложности */}
      <div className="difficultyFilter">
        {difficulties.map(diff => (
          <button 
            key={diff.key}
            onClick={() => setSelectedDifficulty(diff.key)}
            className={`difficultyButton ${selectedDifficulty === diff.key ? 'active' : ''}`}
            style={{
              borderColor: diff.color,
              background: selectedDifficulty === diff.key ? diff.color : 'white',
              color: selectedDifficulty === diff.key ? 'white' : diff.color
            }}
          >
            {diff.label}
          </button>
        ))}
      </div>

      <div className="quizzesList">
        {quizzes.map((quiz) => {
          const progress = getQuizProgress(quiz.id);
          const hasProgress = !!progress;
          const isPerfect = hasProgress && progress.score === progress.total;
          const isCompleted = hasProgress && progress.completed;
          const scoreText = progress ? `${progress.score}/${progress.total}` : null;
          const attemptsText = progress ? progress.attempts : 0;
          const difficultyInfo = getDifficultyInfo(quiz.difficulty);

          const cardClass = `quizCard ${isPerfect ? 'perfect' : isCompleted ? 'completed' : ''}`;

          return (
            <div key={quiz.id} className={cardClass}>
              <div className="completionBadge">
                {isPerfect ? '✓ Пройден' : 'Пройти снова'}
              </div>
              
              <div 
                className="difficultyBadge"
                style={{ background: difficultyInfo.color }}
              >
                <span>{difficultyInfo.icon}</span>
                <span>{difficultyInfo.label}</span>
              </div>
              
              <h3 className="quizTitle">{quiz.title}</h3>
              <p className="quizDescription">{quiz.description}</p>
              
              <div className="quizFooter">
                <div className="quizInfo">
                  <span>{quiz.questions.length} вопросов</span>
                  {scoreText && (
                    <>
                      <span>•</span>
                      <span className="resultText">
                        Результат: {scoreText}
                      </span>
                      <span>•</span>
                      <span className="attemptsText">
                        Попыток: {attemptsText}
                      </span>
                    </>
                  )}
                </div>
                
                <button
                  className="startButton"
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
        <div className="emptyState">
          <h3>Квизов пока нет</h3>
          <p>Попробуй выбрать другую сложность или создай квиз первым!</p>
        </div>
      )}
    </div>
  );
}