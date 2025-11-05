'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LeaderboardUser {
  id: number;
  name: string;
  email: string;
  points: number;
  position: number;
  createdAt: string;
}

interface UserPosition {
  position: number;
  points: number;
  name: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
        setUserPosition(data.userPosition);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}`;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div>Загрузка рейтинга...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>🏆 Рейтинг игроков</h1>

      {/* Топ 20 */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: 30
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0070f3, #0051a8)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Топ 20 игроков</h2>
        </div>

        <div style={{ padding: 0 }}>
          {leaderboard.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid #f0f0f0',
                background: user.position <= 3 ? '#f8f9ff' : 'white',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = user.position <= 3 ? '#f8f9ff' : 'white';
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: user.position === 1 ? '#ffd700' : 
                           user.position === 2 ? '#c0c0c0' : 
                           user.position === 3 ? '#cd7f32' : '#0070f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: user.position <= 3 ? 18 : 14,
                marginRight: 15
              }}>
                {getMedalEmoji(user.position)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {user.name || 'Без имени'}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {user.email}
                </div>
              </div>

              <div style={{
                background: '#0070f3',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 20,
                fontWeight: 'bold',
                fontSize: 14
              }}>
                {user.points} очков
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Позиция текущего пользователя */}
      {userPosition && userPosition.position > 20 && (
        <div style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '20px',
          border: '2px solid #0070f3'
        }}>
          <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Ваша позиция</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16
              }}>
                {userPosition.position}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{userPosition.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Ваше место в рейтинге</div>
              </div>
            </div>
            <div style={{
              background: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 20,
              fontWeight: 'bold'
            }}>
              {userPosition.points} очков
            </div>
          </div>
        </div>
      )}

      {leaderboard.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 60, 
          color: '#666',
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Рейтинг пуст</h3>
          <p>Будь первым в рейтинге - пройди квизы и заработай очки!</p>
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
            Начать играть
          </button>
        </div>
      )}
    </div>
  );
}