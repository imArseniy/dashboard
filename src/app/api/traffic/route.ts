import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

// Подключение к PostgreSQL
const pool = new Pool({
  host: '45.130.214.139',
  port: 5432,
  database: 'hahaton',
  user: 'user',
  password: 'password'
});

export type TrafficItem = {
  id: string;
  customer_id: string;
  channel: string;
  session_start: string;
  device: string;
};

// GET /api/traffic
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT traffic_id, customer_id, channel, session_start, device FROM traffic`
    );
    client.release();

    const formatted: TrafficItem[] = result.rows.map((row) => ({
      id: row.traffic_id.toString(),
      customer_id: row.customer_id?.toString() ?? '',
      channel: row.channel ?? '',
      session_start: row.session_start?.toISOString() ?? '',
      device: row.device ?? ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении Traffic:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
