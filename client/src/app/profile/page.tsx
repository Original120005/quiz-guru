'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  points: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetch('http://localhost:5000/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          throw new Error('No user');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/auth/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Загрузка...</div>;

  if (!user) return null;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>Профиль</h1>
      <div style={{
        background: '#fff',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#0070f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 32,
            fontWeight: 'bold'
          }}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user.name || 'Без имени'}</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 15,
            padding: '15px',
            background: 'linear-gradient(135deg, #0070f3, #0051a8)',
            borderRadius: 12,
            color: 'white'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>Рейтинг очки</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
                Зарабатывай очки за прохождение квизов!
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)',
              padding: '12px 20px',
              borderRadius: 20,
              fontSize: 24,
              fontWeight: 'bold',
              minWidth: 80,
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              {user.points || 0}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
            <span>На платформе с:</span>
            <span style={{ fontWeight: '500' }}>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        {/* Сноска с объяснением системы очков */}
<div style={{
  marginTop: 25,
  padding: '15px',
  background: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: 8,
  fontSize: 14,
  color: '#495057'
}}>
  <strong>🎯 Как зарабатывать очки:</strong>
  <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
    <li>Идеальный результат: <strong style={{color: '#28a745'}}>+10 очков</strong></li>
    <li>Повторная попытка: <strong style={{color: '#dc3545'}}>-10 очков</strong></li>
    <li>Все квизы категории: <strong style={{color: '#28a745'}}>+50 очков</strong></li>
    <li>Очки не могут быть отрицательными</li>
  </ul>
</div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <button onClick={() => router.push('/quizzes')} style={{
          background: '#0070f3',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,112,243,0.3)'
        }}>
          Играть в квиз
        </button>
      </div>
    </div>
  );
}