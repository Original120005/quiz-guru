'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useState } from 'react';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href} 
      className="navLink"
      style={{ 
        background: isHovered ? 'rgba(255,255,255,0.15)' : 'transparent',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      className="logoutButton"
      style={{
        background: isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      Выйти
    </button>
  );
}

function RegisterButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href="/auth/register" 
      className="registerButton"
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 6px 20px rgba(255,255,255,0.3)' : '0 4px 12px rgba(255,255,255,0.2)'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      Регистрация
    </Link>
  );
}

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="header">
      <nav>
        {/* Логотип - с текстом rgquiz */}
        <Link href="/" className="logo">
          <Image 
            src="/Logo3.png" 
            alt="Quiz Guru" 
            width={115}
            height={75}
            priority
          />
        </Link>

        <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
          <NavLink href="/quizzes">Квизы</NavLink>
          <NavLink href="/leaderboard">Рейтинг</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink href="/profile">Профиль</NavLink>
              <LogoutButton onClick={handleLogout} />
            </>
          ) : (
            <>
              <NavLink href="/auth/login">Вход</NavLink>
              <RegisterButton />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}