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

  // Функция для правильного склонения слова "квиз"
  const getQuizWord = (count: number) => {
    if (count === 1) return 'квиз';
    if (count > 1 && count < 5) return 'квиза';
    return 'квизов';
  };

  if (loading) {
    return (
      <div className="loading">Загрузка категорий...</div>
    );
  }

  return (
    <div className="quizzesContainer">
      <h1 className="quizzesTitle">Выбери категорию</h1>
      
      <div className="categoriesGrid">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/quizzes/category?category=${category.slug}`}
            className="categoryCard"
          >
            <h2 className="categoryName">{category.name}</h2>
            <p className="categoryStats">
              {category._count.quizzes} {getQuizWord(category._count.quizzes)}
            </p>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="emptyState">
          <h3>Категории не найдены</h3>
          <p>Попробуйте обновить страницу или проверьте подключение к серверу.</p>
        </div>
      )}
    </div>
  );
}