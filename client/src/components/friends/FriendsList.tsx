'use client';

import { useState, useEffect } from 'react';

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка друзей...</div>;
  }

  return (
    <div className="friendsSection">
      <h3 className="friendsTitle">👥 Друзья ({friends.length})</h3>
      
      <div className="friendsList">
        {friends.map(friend => (
          <div key={friend.id} className="friendCard">
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
        ))}
        
        {friends.length === 0 && (
          <div className="emptyFriends">
            <p>Пока нет друзей</p>
            <button className="addFriendsButton">
              Найти друзей
            </button>
          </div>
        )}
      </div>
    </div>
  );
}