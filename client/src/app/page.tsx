import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      maxWidth: 800,
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: 48, marginBottom: 20 }}>Добро пожаловать в Quiz Guru!</h1>
      <p style={{ fontSize: 20, color: '#555', marginBottom: 40 }}>
        Играй в квизы, соревнуйся с друзьями и генерируй вопросы с помощью ИИ (Grok)
      </p>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/auth/register" style={{
          background: '#0070f3',
          color: 'white',
          padding: '15px 30px',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 18
        }}>
          Начать играть
        </Link>
        <Link href="/quizzes" style={{
          background: '#fff',
          color: '#0070f3',
          padding: '15px 30px',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 18,
          border: '2px solid #0070f3'
        }}>
          Все квизы
        </Link>
      </div>

      <div style={{ marginTop: 80, color: '#888', fontSize: 14 }}>
        <p>Скоро: Дуэли 1 на 1 • Достижения • Квиз от Grok</p>
      </div>
    </div>
  );
}