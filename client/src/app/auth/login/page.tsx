'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        login();
        router.push('/profile');
      } else {
        setMessage('Ошибка: ' + (data.error || 'Попробуй снова'));
      }
    } catch (err) {
      setMessage('Нет связи с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <div className="authLogo">
        </div>

        <h1 className="authTitle">С возвращением!</h1>
        <p className="authSubtitle">Войди в свой аккаунт чтобы продолжить</p>

        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="formInput"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="formLabel">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="Введите ваш пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="formInput"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submitButton"
          >
            {loading ? 'Вход...' : 'Войти в аккаунт'}
          </button>
        </form>

        {message && (
          <div className={`authMessage ${message.includes('Ошибка') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="authLink">
          Еще нет аккаунта? <Link href="/auth/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}