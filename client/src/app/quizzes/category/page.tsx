'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: any[];
  author: {
    name: string;
  };
  category: {
    name: string;
    slug: string;
  };
  createdAt: string;
}

export default function CategoryQuizzesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('category');
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchQuizzes();
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
        // Если квизов нет, получаем название категории отдельно
        const catRes = await fetch('http://localhost:5000/api/categories');
        const catData = await catRes.json();
        const category = catData.categories.find((c: any) => c.slug === slug);
        if (category) setCategoryName(category.name);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
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
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              background: 'white',
              padding: 24,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #eee'
            }}
          >
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
                <span>Автор: {quiz.author.name}</span>
                <span style={{ margin: '0 12px' }}>•</span>
                <span>{quiz.questions.length} вопросов</span>
              </div>
              
              <button
                style={{
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14
                }}
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                Начать квиз
              </button>
            </div>
          </div>
        ))}
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