import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/suppliers
export async function GET() {
  try {
    const suppliers = await prisma.suppliers.findMany();
    // Преобразуем поля под фронтенд
    const formatted = suppliers.map((s) => ({
      id: s.supplier_id.toString(),
      name: s.supplier_name || '',
      region: s.region || '',
      rating: s.rating ? s.rating.toString() : ''
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении поставщиков:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST /api/suppliers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, region, rating } = body;

    if (!name || !region) {
      return NextResponse.json(
        { error: 'Имя и регион обязательны' },
        { status: 400 }
      );
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        supplier_name: name,
        region,
        rating: rating ? parseFloat(rating) : null
      }
    });

    return NextResponse.json(
      {
        id: newSupplier.supplier_id.toString(),
        name: newSupplier.supplier_name || '',
        region: newSupplier.region || '',
        rating: newSupplier.rating ? newSupplier.rating.toString() : ''
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при добавлении поставщика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
