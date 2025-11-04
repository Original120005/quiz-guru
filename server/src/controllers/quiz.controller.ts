import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Анти-спам: один запрос в 5 сек на IP
const lastRequest = new Map<string, number>();

const XAI_API_KEY = process.env.API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

export const generateQuiz = async (req: Request, res: Response) => {
  const { theme, count = 5 } = req.body;
  const ip = (req.ip || req.socket.remoteAddress || 'unknown').split(':').pop()!;

  // === АНТИ-СПАМ ===
  const now = Date.now();
  const last = lastRequest.get(ip) || 0;
  if (now - last < 5000) {
    return res.status(429).json({ 
      error: 'Слишком быстро! Подожди 5 сек 😅' 
    });
  }
  lastRequest.set(ip, now);
  // === КОНЕЦ АНТИ-СПАМА ===

  if (!theme?.trim()) {
    return res.status(400).json({ error: 'Введи тему!' });
  }

  try {
    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{
          role: 'system',
          content: `Создай ровно ${count} вопросов по теме "${theme}". 
          Формат: JSON массив [{question: "...", options: ["A","B","C","D"], correct: 0}]
          Только JSON, без текста!`
        }],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const err: any = await response.json().catch(() => ({}));
      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'Grok спит Подожди 30 сек и попробуй снова' 
        });
      }
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    const questions = JSON.parse(content.match(/\[[\s\S]*\]/)?.[0] || content);

    const quiz = {
      title: `Квиз: ${theme}`,
      description: `Сгенерировано Grok • ${count} вопросов`,
      questions: questions.map((q: any) => ({
        question: q.question || 'Вопрос',
        options: q.options?.slice(0,4) || ['A','B','C','D'],
        correct: Number(q.correct) || 0,
      })),
    };

    res.json({ quiz });
  } catch (err: any) {
    console.error('Grok error:', (err as any).message);
    res.status(500).json({ 
      error: 'Grok устал Попробуй через минуту: ' + (err as any).message
    });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: { name: true }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Квиз не найден' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};