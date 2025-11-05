'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header style={{
      background: '#fff',
      padding: '15px 20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ fontSize: 24, fontWeight: 'bold', color: '#0070f3', textDecoration: 'none' }}>
          Quiz Guru
        </Link>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/quizzes" style={{ color: '#333', textDecoration: 'none' }}>Квизы</Link>
          <Link href="/leaderboard" style={{ color: '#333', textDecoration: 'none' }}>Рейтинг</Link>

          {isLoggedIn ? (
            <>
              <Link href="/profile" style={{ color: '#333', textDecoration: 'none' }}>Профиль</Link>
              <button onClick={handleLogout} style={{
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer'
              }}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Вход</Link>
              <Link href="/auth/register" style={{
                background: '#0070f3',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 6,
                textDecoration: 'none'
              }}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}