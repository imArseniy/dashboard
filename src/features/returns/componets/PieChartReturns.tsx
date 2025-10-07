'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

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
  reason: string;
  count: number;
  fill: string;
};

// Цвета для графика
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)'
];

// Словарь переводов причин возвратов
const REASON_TRANSLATIONS: Record<string, string> = {
  defect: 'Брак',
  wrong_size: 'Неправильный размер',
  damaged: 'Сломано',
  other: 'Другое'
};

export function ReturnsReasonPieChart() {
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
    let filteredReturns: ReturnItem[] = [];

    if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() + 2);
      filteredReturns = returns.filter((r) => {
        const sale = sales.find((s) => s.id === r.transaction_id);
        if (!sale) return false;
        return new Date(sale.transaction_date) >= monthAgo;
      });
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filteredReturns = returns.filter((r) => {
        const sale = sales.find((s) => s.id === r.transaction_id);
        if (!sale) return false;
        return new Date(sale.transaction_date) >= yearAgo;
      });
    } else {
      filteredReturns = returns;
    }

    // группировка по причине возврата
    const grouped: Record<string, number> = {};
    for (const r of filteredReturns) {
      const reason = r.reason || 'other';
      const translated = REASON_TRANSLATIONS[reason] || reason;
      grouped[translated] = (grouped[translated] || 0) + 1;
    }

    const formatted: ChartData[] = Object.entries(grouped).map(
      ([reason, count], index) => ({
        reason,
        count,
        fill: COLORS[index % COLORS.length]
      })
    );

    setChartData(formatted);
  }, [returns, sales, period]);

  const chartConfig = {
    reason: {
      label: 'Причины возвратов',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;

  return (
    <Card className='flex w-full flex-col'>
      <CardHeader className='flex w-full items-center justify-between pb-0'>
        <div>
          <CardTitle>Причины возвратов</CardTitle>
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

      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          className='mx-auto aspect-square max-h-[250px]'
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    name,
                    ': ',
                    `${value} возвратов`
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='reason'
              labelLine={false}
              outerRadius='100%'
              innerRadius='40%'
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Всего возвратов: {chartData.reduce((acc, cur) => acc + cur.count, 0)}{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
