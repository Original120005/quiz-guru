'use client';

import { useState, useEffect } from 'react';
import Toast from '@/components/common/Toast';

interface Friend {
  id: number;
  name: string;
  email: string;
  points: number;
  avatar?: string;
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/friends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      showToast('Ошибка загрузки списка друзей', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const removeFriend = async (friendId: number, friendName: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Удаляем друга из списка
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
        showToast(`${friendName} удален из друзей`, 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Ошибка удаления друга', 'error');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      showToast('Ошибка удаления друга', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка друзей...</div>;
  }

  return (
    <div className="friendsSection">
      <h3 className="friendsTitle">👥 Друзья ({friends.length})</h3>
      
      <div className="friendsList">
        {friends.map(friend => (
          <div key={friend.id} className="friendCard">
            <div className="friendMainInfo">
              <div className="friendAvatar">
                {friend.avatar ? (
                  <img src={friend.avatar} alt={friend.name} />
                ) : (
                  <span>{friend.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="friendInfo">
                <div className="friendName">{friend.name || 'Без имени'}</div>
                <div className="friendPoints">{friend.points} очков</div>
              </div>
            </div>
            
            {/* Кнопка удаления друга - сразу удаляет с Toast */}
            <button 
              onClick={() => removeFriend(friend.id, friend.name || 'пользователя')}
              className="removeFriendButton"
              title="Удалить из друзей"
            >
              🗑️ Удалить
            </button>
          </div>
        ))}
        
        {friends.length === 0 && (
          <div className="emptyFriends">
            <p>Пока нет друзей</p>
            <p className="friendsHint">Найдите друзей через поиск выше!</p>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}