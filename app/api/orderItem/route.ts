import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order, productId, price, quantity } = body;

    const newOrderItem = await prisma.orderItem.create({
      data: {
        order,
        price,
        productId,
        quantity,
      },
    });

    return NextResponse.json(newOrderItem, { status: 201 });
  } catch (error) {
    console.error('Error creating order item:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
