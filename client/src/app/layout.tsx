import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz Guru',
  description: 'Квизы с ИИ и рейтингами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}