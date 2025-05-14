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

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { name, price, stock } = body;
      
      // Базовая валидация
      if (!name || !price || stock === undefined) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      const newProduct = await prisma.product.create({
        data: {
          name,
          price: Number(price),
          stock: Number(stock),
          createdAt: new Date(),
        },
      });
  
      return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
      console.error('Error creating product:', error);
  
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'Product with this name already exists' }, { status: 409 });
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
