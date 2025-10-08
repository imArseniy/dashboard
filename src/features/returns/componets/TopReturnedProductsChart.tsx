'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type ReturnItem = {
  id: string;
  transaction_id: string;
  customer_id: string;
  product_id: string;
  reason: string;
};

type Sale = {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: string;
  payment_method: string;
  transaction_date: string;
};

type Product = {
  id: string;
  name: string;
};

type ChartData = {
  name: string;
  count: number;
};

export function TopReturnedProductsChart() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month');

  useEffect(() => {
    fetch('/api/returns')
      .then((res) => res.json())
      .then(setReturns)
      .catch(console.error);
    fetch('/api/sales')
      .then((res) => res.json())
      .then(setSales)
      .catch(console.error);
    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (returns.length === 0 || sales.length === 0 || products.length === 0)
      return;

    const now = new Date();
    let filteredReturns: ReturnItem[] = [];

    if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filteredReturns = returns.filter((r) => {
        const sale = sales.find((s) => s.id === r.transaction_id);
        return sale && new Date(sale.transaction_date) >= monthAgo;
      });
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filteredReturns = returns.filter((r) => {
        const sale = sales.find((s) => s.id === r.transaction_id);
        return sale && new Date(sale.transaction_date) >= yearAgo;
      });
    } else {
      filteredReturns = returns;
    }

    const grouped: Record<string, number> = {};
    for (const r of filteredReturns) {
      const product = products.find((p) => p.id === r.product_id);
      if (!product) continue;
      grouped[product.name] = (grouped[product.name] || 0) + 1;
    }

    const formatted: ChartData[] = Object.entries(grouped)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count) // сортировка по количеству
      .slice(0, 5); // топ-5

    setChartData(formatted);
  }, [returns, sales, products, period]);

  const chartConfig = {
    desktop: {
      label: 'Возвраты',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;

  return (
    <Card className='w-full'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Топ-5 возвращаемых товаров</CardTitle>
          <CardDescription>
            {period === 'month'
              ? 'Последний месяц'
              : period === 'year'
                ? 'Последний год'
                : 'За всё время'}
          </CardDescription>
        </div>

        <Select
          value={period}
          onValueChange={(v: 'month' | 'year' | 'all') => setPeriod(v)}
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Период' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='month'>Месяц</SelectItem>
            <SelectItem value='year'>Год</SelectItem>
            <SelectItem value='all'>Всё время</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='count' fill='var(--color-desktop)' radius={8}>
              <LabelList
                position='top'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
