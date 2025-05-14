import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const {description, name, products  } = body;
      
      
      // Create user
      const category = await prisma.category.create({
        data: { 
          name,
          description,
          products
        },
        select: {
          id: true,
          
          name: true,
        }
      });
      
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }