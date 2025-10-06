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
export type Sale = {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: string;
  payment_method: string;
  transaction_date: string;
};

// GET /api/sales
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT transaction_id, customer_id, product_id, quantity, payment_method, transaction_date FROM sales`
    );
    client.release();

    const formatted: Sale[] = result.rows.map((row) => ({
      id: row.transaction_id.toString(),
      customer_id: row.customer_id !== null ? row.customer_id.toString() : '',
      product_id: row.product_id !== null ? row.product_id.toString() : '',
      quantity: row.quantity !== null ? row.quantity.toString() : '',
      payment_method: row.payment_method ?? '',
      transaction_date: row.transaction_date
        ? new Date(row.transaction_date).toISOString().split('T')[0]
        : ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении продаж:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
