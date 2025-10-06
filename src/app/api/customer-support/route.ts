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

export type CustomerSupportItem = {
  ticket_id: string;
  customer_id: string;
  issue_type: string;
  resolution_time_minutes: number | null;
  resolved: boolean | null;
  support_date: string;
};

// GET /api/customer-support
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT ticket_id, customer_id, issue_type, resolution_time_minutes, resolved, support_date 
       FROM customer_support`
    );
    client.release();

    const formatted: CustomerSupportItem[] = result.rows.map((row) => ({
      ticket_id: row.ticket_id.toString(),
      customer_id: row.customer_id?.toString() ?? '',
      issue_type: row.issue_type ?? '',
      resolution_time_minutes: row.resolution_time_minutes ?? null,
      resolved: row.resolved ?? null,
      support_date: row.support_date?.toISOString() ?? ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении Customer Support:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
