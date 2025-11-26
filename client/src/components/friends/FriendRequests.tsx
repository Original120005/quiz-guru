'use client';

import { useState, useEffect } from 'react';
import Toast from '@/components/common/Toast';

interface FriendRequest {
  id: number;
  sender: {
    id: number;
    name: string;
    email: string;
    points: number;
    avatar?: string;
    createdAt: string;
  };
  createdAt: string;
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/friends/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      showToast('Ошибка загрузки запросов', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const acceptRequest = async (requestId: number, userName: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
        showToast(`Запрос от ${userName} принят! 🎉`, 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Ошибка принятия запроса', 'error');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      showToast('Ошибка принятия запроса', 'error');
    }
  };

  const declineRequest = async (requestId: number, userName: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/decline/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
        showToast(`Запрос от ${userName} отклонен`, 'info');
      } else {
        const data = await res.json();
        showToast(data.error || 'Ошибка отклонения запроса', 'error');
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
      showToast('Ошибка отклонения запроса', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loadingRequests">Загрузка запросов...</div>;
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="friendRequestsSection">
      <h3 className="requestsTitle">📥 Запросы в друзья ({requests.length})</h3>
      
      <div className="requestsList">
        {requests.map(request => (
          <div key={request.id} className="requestCard">
            <div className="requestUser">
              <div className="userAvatarSmall">
                {request.sender.avatar ? (
                  <img src={request.sender.avatar} alt={request.sender.name} />
                ) : (
                  <span>{request.sender.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="userInfoSmall">
                <div className="userName">{request.sender.name || 'Без имени'}</div>
                <div className="userDetails">
                  <span>{request.sender.points} очков</span>
                  <span>•</span>
                  <span>На платформе с {formatDate(request.sender.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="requestActions">
              <button 
                onClick={() => acceptRequest(request.id, request.sender.name || 'пользователя')}
                className="acceptButton"
              >
                ✅ Принять
              </button>
              <button 
                onClick={() => declineRequest(request.id, request.sender.name || 'пользователя')}
                className="declineButton"
              >
                ❌ Отклонить
              </button>
            </div>
          </div>
        ))}
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