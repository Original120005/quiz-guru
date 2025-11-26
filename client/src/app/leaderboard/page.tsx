'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FriendRequestButton from '@/components/friends/FriendRequestButton';

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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
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
        
        // Получаем ID текущего пользователя
        const userRes = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUserId(userData.user.id);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalClass = (position: number) => {
    switch (position) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return 'other';
    }
  };

  if (loading) {
    return (
      <div className="loading">Загрузка рейтинга...</div>
    );
  }

  return (
    <div className="leaderboardContainer">
      <h1 className="leaderboardTitle">🏆 Рейтинг игроков</h1>

      {/* Топ 20 */}
      <div className="topPlayersSection">
        <div className="sectionHeader">
          <h2>Топ 20 игроков</h2>
        </div>

        <div className="playersList">
          {leaderboard.map((user) => (
            <div
              key={user.id}
              className="playerRow"
            >
              <div className={`medalPosition ${getMedalClass(user.position)}`}>
                {user.position}
              </div>

              <div className="playerInfo">
                <div className="playerName">
                  {user.name || 'Без имени'}
                </div>
                <div className="playerEmail">
                  {user.email}
                </div>
              </div>

              <div className="playerPoints">
                {user.points} очков
              </div>

              {/* Кнопка добавления в друзья */}
              {currentUserId && (
                <FriendRequestButton 
                  targetUserId={user.id}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Позиция текущего пользователя */}
      {userPosition && userPosition.position > 20 && (
        <div className="userPositionSection">
          <h3 className="userPositionTitle">Ваша позиция</h3>
          <div className="userPositionCard">
            <div className="userPositionInfo">
              <div className="userPositionBadge">
                {userPosition.position}
              </div>
              <div className="userDetails">
                <div className="userName">{userPosition.name}</div>
                <div className="userRank">Ваше место в рейтинге</div>
              </div>
            </div>
            <div className="userPositionPoints">
              {userPosition.points} очков
            </div>
          </div>
        </div>
      )}

      {leaderboard.length === 0 && (
        <div className="emptyState">
          <h3>Рейтинг пуст</h3>
          <p>Будь первым в рейтинге - пройди квизы и заработай очки!</p>
          <button 
            onClick={() => router.push('/quizzes')}
            className="playButton"
          >
            Начать играть
          </button>
        </div>
      )}
    </div>
  );
}