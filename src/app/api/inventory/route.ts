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

export type InventoryItem = {
  product_id: string;
  warehouse_id: string;
  stock_quantity: number;
  last_updated: string;
};

// GET /api/inventory
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT product_id, warehouse_id, stock_quantity, last_updated FROM inventory`
    );
    client.release();

    const formatted: InventoryItem[] = result.rows.map((row) => ({
      product_id: row.product_id?.toString() ?? '',
      warehouse_id: row.warehouse_id?.toString() ?? '',
      stock_quantity: row.stock_quantity ?? 0,
      last_updated: row.last_updated?.toISOString() ?? ''
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ошибка при получении Inventory:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
