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

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: string;
  type: string;
}

interface UserBadge {
  id: number;
  earnedAt: string;
  badge: Badge;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUserData(token);
    fetchUserBadges(token);
    fetchAllBadges(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserBadges = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/badges/my-badges', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchAllBadges = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/badges/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setAllBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching all badges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Проверяем, есть ли бейдж у пользователя
  const hasBadge = (badgeId: number) => {
    return badges.some(userBadge => userBadge.badgeId === badgeId);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Загрузка...</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1>Профиль</h1>
      
      {/* Основная информация пользователя */}
      <div style={{
        background: '#fff',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: 30
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
// В разделе сноски (примерно строка 150+)
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
    <li>Идеальный результат (легкий): <strong style={{color: '#28a745'}}>+10 очков</strong></li>
    <li>Идеальный результат (средний): <strong style={{color: '#28a745'}}>+20 очков</strong></li>
    <li>Идеальный результат (сложный): <strong style={{color: '#28a745'}}>+30 очков</strong></li>
    <li>Повторная попытка: <strong style={{color: '#dc3545'}}>-15 очков</strong></li>
    <li>Все квизы категории: <strong style={{color: '#28a745'}}>+100 очков</strong></li>
    <li>Очки не могут быть отрицательными</li>
  </ul>
</div>
      </div>

      {/* Раздел бейджей */}
      <div style={{
        background: '#fff',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: 20 }}>🏆 Достижения</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 20
        }}>
          {allBadges.map((badge) => {
            const userHasBadge = hasBadge(badge.id);
            
            return (
              <div
                key={badge.id}
                style={{
                  textAlign: 'center',
                  padding: '15px 10px',
                  background: userHasBadge ? '#f8f9fa' : 'transparent',
                  borderRadius: 12,
                  border: userHasBadge ? `2px solid ${badge.color}` : '2px solid #e0e0e0',
                  transition: 'all 0.2s',
                  opacity: userHasBadge ? 1 : 0.6,
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title={userHasBadge ? badge.description : `Чтобы получить: ${badge.description}`}
              >
                <div style={{
                  fontSize: 32,
                  marginBottom: 8,
                  filter: userHasBadge ? 'none' : 'grayscale(100%)'
                }}>
                  {badge.icon}
                </div>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  marginBottom: 4,
                  color: userHasBadge ? '#333' : '#999'
                }}>
                  {badge.name}
                </div>
                
                {/* Индикатор полученного бейджа */}
                {userHasBadge && (
                  <div style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    background: badge.color,
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Статистика бейджей */}
        <div style={{
          marginTop: 25,
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, color: '#666' }}>
            Получено: <strong>{badges.length}</strong> из <strong>{allBadges.length}</strong> бейджей
          </div>
          <div style={{
            marginTop: 10,
            height: 8,
            background: '#e9ecef',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div 
              style={{
                height: '100%',
                background: '#0070f3',
                borderRadius: 4,
                width: `${(badges.length / allBadges.length) * 100}%`,
                transition: 'width 0.3s ease'
              }}
            />
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
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,112,243,0.3)'
        }}>
          Играть в квиз
        </button>
      </div>
    </div>
  );
}