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

export type ReturnItem = {
  id: string;
  transaction_id: string;
  customer_id: string;
  product_id: string;
  reason: string;
};

// GET /api/returns
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT return_id, transaction_id, customer_id, product_id, reason FROM returns`
    );
    client.release();

    const formatted: ReturnItem[] = result.rows.map((row) => ({
      id: row.return_id.toString(),
      transaction_id: row.transaction_id?.toString() ?? '',
      customer_id: row.customer_id?.toString() ?? '',
      product_id: row.product_id?.toString() ?? '',
      reason: row.reason ?? ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении Returns:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
