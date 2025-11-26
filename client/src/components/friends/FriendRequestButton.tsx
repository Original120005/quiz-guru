'use client';

import { useState, useEffect } from 'react';

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
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Убираем принятый запрос из списка
        setRequests(prev => prev.filter(req => req.id !== requestId));
        // Можно показать уведомление
        alert('Запрос в друзья принят!');
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка принятия запроса');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Ошибка принятия запроса');
    }
  };

  const declineRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/decline/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Убираем отклоненный запрос из списка
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка отклонения запроса');
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
      alert('Ошибка отклонения запроса');
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
    return null; // Не показываем секцию если нет запросов
  }

  return (
    <div className="friendRequestsSection">
      <h3 className="requestsTitle">📥 Запросы в друзья</h3>
      
      <div className="requestsList">
        {requests.map(request => (
          <div key={request.id} className="requestCard">
            <div className="requestUser">
              <div className="userAvatar">
                {request.sender.avatar ? (
                  <img src={request.sender.avatar} alt={request.sender.name} />
                ) : (
                  <span>{request.sender.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="userInfo">
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
                onClick={() => acceptRequest(request.id)}
                className="acceptButton"
              >
                ✅ Принять
              </button>
              <button 
                onClick={() => declineRequest(request.id)}
                className="declineButton"
              >
                ❌ Отклонить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}