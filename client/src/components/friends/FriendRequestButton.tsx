'use client';

import { useState, useEffect } from 'react';
import Toast from '@/components/common/Toast';

interface FriendRequestButtonProps {
  targetUserId: number;
}

type FriendshipStatus = 'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED';

export default function FriendRequestButton({ targetUserId }: FriendRequestButtonProps) {
  const [status, setStatus] = useState<FriendshipStatus>('NONE');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    console.log('🟡 FriendRequestButton MOUNTED - targetUserId:', targetUserId);
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      console.log('🟡 Current user ID loaded:', currentUserId);
      checkFriendshipStatus();
    }
  }, [currentUserId, targetUserId]);

  const fetchCurrentUserId = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔴 No token found');
        return;
      }

      const res = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('🟢 Current user data:', data.user);
        setCurrentUserId(data.user?.id);
      } else {
        console.log('🔴 Failed to fetch current user');
      }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };

  const checkFriendshipStatus = async () => {
    if (!currentUserId) {
      console.log('🔴 Cannot check status - no currentUserId');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/friends/status/${targetUserId}?t=${Date.now()}`;
      console.log('🟡 Checking status URL:', url);
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('🟢 Status API response:', data);
        setStatus(data.status);
      } else {
        console.error('🔴 Status check failed:', res.status);
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const sendFriendRequest = async () => {
    if (loading || !currentUserId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🟡 Sending friend request to:', targetUserId);
      
      const res = await fetch('http://localhost:5000/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: targetUserId })
      });

      const data = await res.json();
      console.log('🟡 Friend request response:', data);

      if (res.ok) {
        setStatus('PENDING');
        showToast('Запрос в друзья отправлен!', 'success');
        
        // Перепроверяем статус через секунду
        setTimeout(() => {
          console.log('🟡 Re-checking status after request');
          checkFriendshipStatus();
        }, 1000);
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

  // Не показываем кнопку если это текущий пользователь или ID не загружен
  if (!currentUserId || targetUserId === currentUserId) {
    console.log('🟡 Not rendering button - same user or no currentUserId');
    return null;
  }

  const getButtonText = () => {
    switch (status) {
      case 'PENDING':
        return '📩 Запрос отправлен';
      case 'ACCEPTED':
        return '✅ Друзья';
      case 'DECLINED':
        return '🔄 Отправить запрос';
      default:
        return '👥 Добавить в друзья';
    }
  };

  const getButtonTitle = () => {
    switch (status) {
      case 'PENDING':
        return 'Ожидание ответа от пользователя';
      case 'ACCEPTED':
        return 'Вы уже друзья с этим пользователем';
      case 'DECLINED':
        return 'Можно отправить запрос повторно';
      default:
        return 'Отправить запрос в друзья';
    }
  };

  const isDisabled = status === 'PENDING' || status === 'ACCEPTED' || loading;

  console.log('🟡 Rendering button - status:', status, 'loading:', loading, 'disabled:', isDisabled);

  return (
    <>
      <button
        onClick={sendFriendRequest}
        disabled={isDisabled}
        className={`friendRequestButton ${status.toLowerCase()} ${loading ? 'loading' : ''}`}
        title={getButtonTitle()}
      >
        {loading ? '⏳ Отправка...' : getButtonText()}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}