// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//  GET: Получить всех пользователей
export async function GET() {
    try {
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

//  POST: Создать нового пользователя
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { email, name, password } = body;
      
     
      
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password,
          // Добавим дополнительные поля, которые могут быть обязательными
          // в зависимости от схемы Prisma
          createdAt: new Date(),
        },
      });
      
      return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Проверка на уникальность email
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
      }
      
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

//  PUT: Обновить пользователя по ID
export async function PUT(req: NextRequest) {
  const { id, name, email } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID обязателен для обновления' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
  }
}

//  DELETE: Удалить пользователя по ID
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID обязателен для удаления' }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Пользователь удалён', user: deletedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при удалении' }, { status: 500 });
  }
}
