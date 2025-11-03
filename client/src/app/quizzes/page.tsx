'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: {
    quizzes: number;
  };
}

export default function QuizzesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div>Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 40 }}>Выбери категорию</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20
      }}>
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/quizzes/category?category=${category.slug}`}
            style={{
              display: 'block',
              background: 'white',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>
              {category.name}
            </h2>
            <p style={{ margin: 0, color: '#666' }}>
              {category._count.quizzes} квиз{category._count.quizzes === 1 ? '' : category._count.quizzes > 1 && category._count.quizzes < 5 ? 'а' : 'ов'}
            </p>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          Категории не найдены
        </div>
      )}
    </div>
  );
}