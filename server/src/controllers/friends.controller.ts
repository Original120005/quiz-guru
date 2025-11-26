import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Отправка запроса в друзья
export const sendFriendRequest = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { receiverId } = req.body;

  console.log('🔵 SEND FRIEND REQUEST - userId:', userId, 'receiverId:', receiverId);

  if (!receiverId) {
    return res.status(400).json({ error: 'ID получателя обязателен' });
  }

  if (userId === receiverId) {
    return res.status(400).json({ error: 'Нельзя отправить запрос самому себе' });
  }

  try {
    // Проверяем существование пользователя
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверяем существующую дружбу
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      }
    });

    console.log('🔵 EXISTING FRIENDSHIP:', existingFriendship);

    if (existingFriendship) {
      switch (existingFriendship.status) {
        case 'PENDING':
          return res.status(400).json({ error: 'Запрос уже отправлен' });
        case 'ACCEPTED':
          return res.status(400).json({ error: 'Вы уже друзья' });
        case 'DECLINED':
          // Разрешаем повторную отправку после отказа
          await prisma.friendship.update({
            where: { id: existingFriendship.id },
            data: { status: 'PENDING', createdAt: new Date() }
          });
          return res.json({ message: 'Запрос в друзья отправлен' });
      }
    }

    // Создаем новый запрос
    const newFriendship = await prisma.friendship.create({
      data: {
        senderId: userId,
        receiverId,
        status: 'PENDING'
      }
    });

    console.log('🟢 NEW FRIENDSHIP CREATED:', newFriendship);

    res.json({ message: 'Запрос в друзья отправлен' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить список друзей (только ACCEPTED)
export const getFriends = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Преобразуем в удобный формат
    const friends = friendships.map(friendship => {
      const isSender = friendship.senderId === userId;
      return isSender ? friendship.receiver : friendship.sender;
    });

    res.json({ friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Ошибка получения списка друзей' });
  }
};

// Получить входящие запросы (PENDING)
export const getFriendRequests = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const requests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            avatar: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Ошибка получения запросов в друзья' });
  }
};

// Принять запрос в друзья
export const acceptFriendRequest = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: parseInt(id),
        receiverId: userId,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Запрос не найден' });
    }

    await prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'ACCEPTED' }
    });

    res.json({ message: 'Запрос в друзья принят' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Ошибка принятия запроса' });
  }
};

// Отклонить запрос в друзья
export const declineFriendRequest = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: parseInt(id),
        receiverId: userId,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Запрос не найден' });
    }

    await prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'DECLINED' }
    });

    res.json({ message: 'Запрос в друзья отклонен' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ error: 'Ошибка отклонения запроса' });
  }
};

export const getFriendshipStatus = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { targetUserId } = req.params;

  console.log('🔵 CHECKING FRIENDSHIP STATUS - userId:', userId, 'targetUserId:', targetUserId, 'type:', typeof targetUserId);

  try {
    // Преобразуем targetUserId в число
    const targetId = parseInt(targetUserId);
    
    if (isNaN(targetId)) {
      console.log('🔴 ERROR: targetUserId is not a number:', targetUserId);
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId }
        ]
      }
    });

    console.log('🔵 FOUND FRIENDSHIP:', friendship);

    let status: string = 'NONE';
    if (friendship) {
      status = friendship.status;
    }

    console.log('🟢 RETURNING STATUS:', status);
    res.json({ status });
  } catch (error) {
    console.error('Error checking friendship status:', error);
    res.status(500).json({ error: 'Ошибка проверки статуса дружбы' });
  }
};

// Добавляем новую функцию удаления друга
export const removeFriend = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  try {
    // Находим дружбу (в любом направлении)
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: parseInt(id), status: 'ACCEPTED' },
          { senderId: parseInt(id), receiverId: userId, status: 'ACCEPTED' }
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Друг не найден' });
    }

    // Удаляем запись о дружбе
    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Друг удален' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Ошибка удаления друга' });
  }
};