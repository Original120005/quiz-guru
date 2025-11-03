'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Регистрация успешна! Токен: ' + data.token);
      } else {
        setMessage('Ошибка: ' + (data.error || 'Попробуй снова'));
      }
    } catch (err) {
      setMessage('Нет связи с сервером');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h1>Регистрация</h1>
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
        <input
          type="text"
          placeholder="Имя"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ width: '100%', padding: 10, margin: '10px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#0070f3', color: 'white', border: 'none' }}>
          Зарегистрироваться
        </button>
      </form>
      {message && <p style={{ marginTop: 20, color: message.includes('успешна') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}