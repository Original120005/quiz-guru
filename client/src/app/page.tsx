'use client';

import Link from 'next/link';
import { useState } from 'react';

function GameModeCard({ mode }: { 
  mode: {
    title: string;
    description: string;
    status: "active" | "soon";
    href: string;
    color: string;
  } 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (mode.status === 'active' && mode.href !== '#') {
      window.location.href = mode.href;
    }
  };

  return (
    <div
      className={`gameModeCard ${mode.status}`}
      style={{ 
        borderColor: `${mode.color}20`,
        transform: isHovered && mode.status === 'active' ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered && mode.status === 'active' 
          ? '0 20px 50px rgba(0,0,0,0.12)' 
          : '0 10px 40px rgba(0,0,0,0.08)'
      }}
      onMouseOver={() => mode.status === 'active' && setIsHovered(true)}
      onMouseOut={() => mode.status === 'active' && setIsHovered(false)}
      onClick={handleClick}
    >
      {mode.status === 'soon' && (
        <div className="soonBadge">
          Скоро
        </div>
      )}
      
      <div className="gameModeIcon">
        {mode.title.split(' ')[0]}
      </div>
      
      <h3 className="gameModeTitle" style={{ color: mode.color }}>
        {mode.title}
      </h3>
      
      <p className="gameModeDescription">
        {mode.description}
      </p>
      
      {mode.status === 'active' ? (
        <ActiveButton color={mode.color} />
      ) : (
        <InactiveButton />
      )}
    </div>
  );
}

function ActiveButton({ color }: { color: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="actionButton active"
      style={{ 
        background: color,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      Играть
    </div>
  );
}

function InactiveButton() {
  return (
    <div className="actionButton inactive">
      В разработке
    </div>
  );
}

function MainButton({ href, children, variant = 'primary' }: { 
  href: string; 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href}
      className={`mainButton ${variant}`}
      style={{
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  const gameModes = [
    {
      title: "🎯 Квизы",
      description: "Проверь свои знания в разных категориях",
      status: "active" as const,
      href: "/quizzes",
      color: "#0070f3"
    },
    {
      title: "⚓ Морской бой",
      description: "Классическая игра в новом формате",
      status: "soon" as const,
      href: "#",
      color: "#6c757d"
    },
    {
      title: "💬 Алиас",
      description: "Объясняй слова без произношения",
      status: "soon" as const, 
      href: "#",
      color: "#6c757d"
    }
  ];

  return (
    <div className="homeContainer">
      {/* Герой секция */}
      <div className="heroSection">
        <h1 className="heroTitle">
          Добро пожаловать в Org Quiz!
        </h1>
        <p className="heroDescription">
          Играй в увлекательные игры, соревнуйся с друзьями и открывай новые достижения. 
          Выбирай режим и начинай играть прямо сейчас!
        </p>
        
        <div className="heroButtons">
          <MainButton href="/quizzes" variant="primary">
            Начать играть
          </MainButton>
          <MainButton href="/leaderboard" variant="secondary">
            Смотреть рейтинг
          </MainButton>
        </div>
      </div>

      {/* Игровые режимы */}
      <div>
        <h2 className="sectionTitle">
          Игровые режимы
        </h2>
        
        <div className="gameModesGrid">
          {gameModes.map((mode, index) => (
            <GameModeCard key={index} mode={mode} />
          ))}
        </div>
      </div>

      {/* Футер главной страницы */}
      <div className="footerSection">
        <p className="footerText">
          Скоро появятся новые режимы и функции!
        </p>
        <div className="featuresList">
          <span>🎯 Дуэли 1 на 1</span>
          <span>🏆 Турниры</span>
          <span>🤖 Квизы от Grok</span>
          <span>👥 Командные игры</span>
        </div>
      </div>
    </div>
  );
}