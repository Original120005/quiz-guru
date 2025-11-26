'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FriendsList from '@/components/friends/FriendsList';
import FriendRequests from '@/components/friends/FriendRequests';
import UserSearch from '@/components/friends/UserSearch';

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

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!user) return null;

  return (
    <div className="profileContainer">
      <h1 className="profileTitle">Профиль</h1>
      
      {/* Основная информация пользователя */}
      <div className="userCard">
        <div className="userHeader">
          <div className="userAvatar">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="userInfo">
            <h2>{user.name || 'Без имени'}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="pointsCard">
          <div className="pointsDisplay">
            <div className="pointsInfo">
              <div className="pointsLabel">Рейтинг очки</div>
              <div className="pointsDescription">
                Зарабатывай очки за прохождение квизов!
              </div>
            </div>
            <div className="pointsValue">
              {user.points || 0}
            </div>
          </div>

          <div className="userStats">
            <span>На платформе с:</span>
            <span>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        {/* Сноска с объяснением системы очков */}
        <div className="pointsExplanation">
          <strong>🎯 Как зарабатывать очки:</strong>
          <ul>
            <li>
              <div className="pointsItem">
                <span>Идеальный результат (легкий):</span>
                <span className="pointsValueInline" style={{color: '#28a745'}}>+10 очков</span>
              </div>
            </li>
            <li>
              <div className="pointsItem">
                <span>Идеальный результат (средний):</span>
                <span className="pointsValueInline" style={{color: '#28a745'}}>+20 очков</span>
              </div>
            </li>
            <li>
              <div className="pointsItem">
                <span>Идеальный результат (сложный):</span>
                <span className="pointsValueInline" style={{color: '#28a745'}}>+30 очков</span>
              </div>
            </li>
            <li>
              <div className="pointsItem">
                <span>Повторная попытка:</span>
                <span className="pointsValueInline" style={{color: '#dc3545'}}>-15 очков</span>
              </div>
            </li>
            <li>
              <div className="pointsItem">
                <span>Все квизы категории:</span>
                <span className="pointsValueInline" style={{color: '#28a745'}}>+100 очков</span>
              </div>
            </li>
            <li>Очки не могут быть отрицательными</li>
          </ul>
        </div>
      </div>

      {/* Поиск пользователей */}
      <UserSearch />

      {/* Входящие запросы в друзья */}
      <FriendRequests />

      {/* Список друзей */}
      <FriendsList />

      {/* Раздел бейджей */}
      <div className="badgesSection">
        <h2 className="sectionTitle">🏆 Достижения</h2>
        
        <div className="badgesGrid">
          {allBadges.map((badge) => {
            const userHasBadge = hasBadge(badge.id);
            
            return (
              <div
                key={badge.id}
                className={`badgeCard ${userHasBadge ? 'earned' : 'locked'}`}
                style={{ borderColor: userHasBadge ? badge.color : undefined }}
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
                <div className="badgeIcon">
                  {badge.icon}
                </div>
                <div className="badgeName">
                  {badge.name}
                </div>
                
                {/* Индикатор полученного бейджа */}
                {userHasBadge && (
                  <div 
                    className="earnedIndicator"
                    style={{ background: badge.color }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Статистика бейджей */}
        <div className="badgesStats">
          <div className="statsText">
            Получено: <strong>{badges.length}</strong> из <strong>{allBadges.length}</strong> бейджей
          </div>
          <div className="progressBar">
            <div 
              className="progressFill"
              style={{ width: `${(badges.length / allBadges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="playButton">
        <button onClick={() => router.push('/quizzes')}>
          Играть в квиз
        </button>
      </div>
    </div>
  );
}