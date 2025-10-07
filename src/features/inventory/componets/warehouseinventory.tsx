'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  supplier_id: string;
};

type InventoryItem = {
  product_id: string;
  warehouse_id: string;
  stock_quantity: number;
  last_updated: string;
};

export function WarehouseInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error('Ошибка загрузки продуктов:', err));

    fetch('/api/inventory')
      .then((res) => res.json())
      .then(setInventory)
      .catch((err) => console.error('Ошибка загрузки инвентаря:', err));
  }, []);

  // Собираем уникальные склады
  const warehouses = Array.from(new Set(inventory.map((i) => i.warehouse_id)));

  // Фильтруем по выбранному складу
  const filteredInventory =
    selectedWarehouse === 'all'
      ? inventory
      : inventory.filter((i) => i.warehouse_id === selectedWarehouse);

  // Соединяем с продуктами и считаем стоимость
  const inventoryWithPrice = filteredInventory.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    const price = product ? parseFloat(product.price || '0') : 0;
    const totalValue = price * item.stock_quantity;
    return {
      ...item,
      product_name: product?.name || 'Неизвестно',
      price,
      totalValue
    };
  });

  // Общая стоимость выбранного склада
  const totalWarehouseValue = inventoryWithPrice.reduce(
    (acc, item) => acc + item.totalValue,
    0
  );

  return (
    <Card className='w-full'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Анализ запасов на складах</CardTitle>
          <CardDescription>Стоимость запасов в рублях</CardDescription>
        </div>

        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Выберите склад' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Все склады</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w} value={w}>
                Склад {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardFooter>
        <div className='font-medium'>
          Общая стоимость: {totalWarehouseValue.toLocaleString('ru-RU')} ₽
        </div>
      </CardFooter>
    </Card>
  );
}
