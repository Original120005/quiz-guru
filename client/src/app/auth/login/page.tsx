'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Вход успешен! Переход...');
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setMessage('Ошибка: ' + (data.error || 'Попробуй снова'));
      }
    } catch (err) {
      setMessage('Нет связи с сервером');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ width: '100%', padding: 10, margin: '10px 0' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{ width: '100%', padding: 10, margin: '10px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#0070f3', color: 'white', border: 'none' }}>
          Войти
        </button>
      </form>
      {message && <p style={{ marginTop: 20, color: message.includes('успешен') ? 'green' : 'red' }}>{message}</p>}
      <p style={{ textAlign: 'center', marginTop: 15 }}>
        Нет аккаунта? <Link href="/auth/register" style={{ color: '#0070f3' }}>Регистрация</Link>
      </p>
    </div>
  );
}