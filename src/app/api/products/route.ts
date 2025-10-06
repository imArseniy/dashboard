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
export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  supplier_id: string;
};

// GET /api/products
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT product_id, product_name, category, price, supplier_id FROM products`
    );
    client.release();

    const formatted: Product[] = result.rows.map((row) => ({
      id: row.product_id.toString(),
      name: row.product_name ?? '',
      category: row.category ?? '',
      price: row.price !== null ? row.price.toString() : '',
      supplier_id: row.supplier_id !== null ? row.supplier_id.toString() : ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
