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
export type AdRevenue = {
  id: string;
  campaign_name: string;
  product_id: string;
  spend: string;
  revenue: string;
  impressions: string;
  clicks: string;
  date: string;
};

// GET /api/ad-revenue
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT ad_id, campaign_name, product_id, spend, revenue, impressions, clicks, date FROM ad_revenue`
    );
    client.release();

    const formatted: AdRevenue[] = result.rows.map((row) => ({
      id: row.ad_id.toString(),
      campaign_name: row.campaign_name ?? '',
      product_id: row.product_id !== null ? row.product_id.toString() : '',
      spend: row.spend !== null ? row.spend.toString() : '',
      revenue: row.revenue !== null ? row.revenue.toString() : '',
      impressions: row.impressions !== null ? row.impressions.toString() : '',
      clicks: row.clicks !== null ? row.clicks.toString() : '',
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении AdRevenue:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
