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
export type UserSegment = {
  id: string;
  segment: string;
  region: string;
  registration_date: string;
};

// GET /api/user-segments
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT customer_id, segment, region, registration_date FROM user_segments`
    );
    client.release();

    const formatted: UserSegment[] = result.rows.map((row) => ({
      id: row.customer_id.toString(),
      segment: row.segment ?? '',
      region: row.region ?? '',
      registration_date: row.registration_date
        ? new Date(row.registration_date).toISOString().split('T')[0]
        : ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении UserSegments:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
