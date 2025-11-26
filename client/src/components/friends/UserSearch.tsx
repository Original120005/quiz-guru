'use client';

import { useState, useEffect, useRef } from 'react';
import FriendRequestButton from './FriendRequestButton';
import Toast from '@/components/common/Toast';

interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  avatar?: string;
  createdAt: string;
}

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchUsers();
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.users || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      showToast('Ошибка поиска пользователей', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // Кастомная кнопка для поиска с Toast
  const CustomFriendRequestButton = ({ targetUserId }: { targetUserId: number }) => {
    const [status, setStatus] = useState<'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED'>('NONE');
    const [loading, setLoading] = useState(false);

    const sendFriendRequest = async () => {
      if (loading) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/friends/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ receiverId: targetUserId })
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('PENDING');
          showToast('Запрос в друзья отправлен!', 'success');
        } else {
          showToast(data.error || 'Ошибка отправки запроса', 'error');
        }
      } catch (error) {
        console.error('Error sending friend request:', error);
        showToast('Ошибка отправки запроса', 'error');
      } finally {
        setLoading(false);
      }
    };

    const getButtonText = () => {
      switch (status) {
        case 'PENDING': return '📩 Запрос отправлен';
        case 'ACCEPTED': return '✅ Друзья';
        case 'DECLINED': return '🔄 Отправить запрос';
        default: return '👥 Добавить в друзья';
      }
    };

    const isDisabled = status === 'PENDING' || status === 'ACCEPTED' || loading;

    return (
      <button
        onClick={sendFriendRequest}
        disabled={isDisabled}
        className={`friendRequestButton ${status.toLowerCase()} ${loading ? 'loading' : ''}`}
        style={{ 
          padding: '6px 12px', 
          fontSize: '12px',
          minWidth: '140px'
        }}
      >
        {loading ? '⏳ Отправка...' : getButtonText()}
      </button>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="userSearch" ref={searchRef}>
      <div className="searchHeader">
        <h3 className="searchTitle">🔍 Найти друзей</h3>
        <div className="searchInputContainer">
          <input
            type="text"
            placeholder="Введите имя или email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="searchInput"
            onFocus={() => results.length > 0 && setShowResults(true)}
          />
          {loading && <div className="searchSpinner">⏳</div>}
        </div>
      </div>

      {showResults && (
        <div className="searchResults">
          {results.length > 0 ? (
            <div className="resultsList">
              {results.map(user => (
                <div key={user.id} className="userResult">
                  <div className="userInfo">
                    <div className="userAvatarSmall">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div className="userDetails">
                      <div className="userName">{user.name || 'Без имени'}</div>
                      <div className="userMeta">
                        <span className="userEmail">{user.email}</span>
                        <span className="userPoints">{user.points} очков</span>
                        <span className="userJoinDate">с {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CustomFriendRequestButton targetUserId={user.id} />
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="noResults">
              <p>😔 Пользователи не найдены</p>
              <span>Попробуйте изменить запрос</span>
            </div>
          ) : null}
        </div>
      )}

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