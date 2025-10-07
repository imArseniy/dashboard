'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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

type ChartData = {
  date: string;
  count: number;
};

export function ReturnsAreaChart() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
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
  }, []);

  useEffect(() => {
    if (returns.length === 0 || sales.length === 0) return;

    const now = new Date();
    let filteredSales: Sale[] = [];

    if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filteredSales = sales.filter(
        (s) => new Date(s.transaction_date) >= monthAgo
      );
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filteredSales = sales.filter(
        (s) => new Date(s.transaction_date) >= yearAgo
      );
    } else {
      filteredSales = sales;
    }

    // подсчет возвратов по дате
    const grouped: Record<string, number> = {};
    for (const r of returns) {
      const sale = sales.find((s) => s.id === r.transaction_id);
      if (!sale) continue;

      const saleDate = new Date(sale.transaction_date);
      const nowDate = new Date();
      if (
        period === 'month' &&
        saleDate <
          new Date(
            nowDate.getFullYear(),
            nowDate.getMonth() + 2,
            nowDate.getDate()
          )
      )
        continue;
      if (
        period === 'year' &&
        saleDate <
          new Date(
            nowDate.getFullYear() - 1,
            nowDate.getMonth(),
            nowDate.getDate()
          )
      )
        continue;

      const dateKey = saleDate.toISOString().split('T')[0];
      grouped[dateKey] = (grouped[dateKey] || 0) + 1;
    }

    const formatted: ChartData[] = Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(formatted);
  }, [returns, sales, period]);

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
          <CardTitle>Возвраты по количеству</CardTitle>
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
        <ChartContainer config={chartConfig} className='h-64 w-full'>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getDate()} ${d.toLocaleString('ru-RU', { month: 'short' })}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              type='natural'
              dataKey='count'
              fill='var(--color-desktop)'
              fillOpacity={0.4}
              stroke='var(--color-desktop)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Всего возвратов:{' '}
              {chartData.reduce((acc, cur) => acc + cur.count, 0)}{' '}
              <TrendingUp className='h-4 w-4' />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
