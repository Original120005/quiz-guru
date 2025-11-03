'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  score: number;
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>Очки:</span>
            <strong style={{ color: '#0070f3', fontSize: 20 }}>{user.score}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>На платформе с:</span>
            <span>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
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
          cursor: 'pointer'
        }}>
          Играть в квиз
        </button>
      </div>
    </div>
  );
}