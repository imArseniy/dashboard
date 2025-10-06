import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

// Настройки подключения к PostgreSQL
const pool = new Pool({
  host: '45.130.214.139',
  port: 5432,
  database: 'hahaton',
  user: 'user',
  password: 'password'
});

// Тип данных для фронтенда
export type Payment = {
  id: string;
  name: string;
  region: string;
  rating: string;
};

// GET /api/suppliers
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT supplier_id, supplier_name, region, rating FROM suppliers`
    );
    client.release();

    // Форматируем под фронтенд
    const formatted: Payment[] = result.rows.map((row) => ({
      id: row.supplier_id.toString(),
      name: row.supplier_name ?? '',
      region: row.region ?? '',
      rating: row.rating !== null ? row.rating.toString() : ''
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

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO suppliers (supplier_name, region, rating)
       VALUES ($1, $2, $3)
       RETURNING supplier_id, supplier_name, region, rating`,
      [name, region, rating ? parseFloat(rating) : null]
    );
    client.release();

    const newSupplier: Payment = {
      id: result.rows[0].supplier_id.toString(),
      name: result.rows[0].supplier_name ?? '',
      region: result.rows[0].region ?? '',
      rating:
        result.rows[0].rating !== null ? result.rows[0].rating.toString() : ''
    };

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error('Ошибка при добавлении поставщика:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
