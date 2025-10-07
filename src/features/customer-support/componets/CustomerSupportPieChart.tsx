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

type CustomerSupportItem = {
  ticket_id: string;
  customer_id: string;
  issue_type: string;
  resolution_time_minutes: number | null;
  resolved: boolean | null;
  support_date: string;
};

type ChartData = {
  reason: string;
  count: number;
};

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

// Здесь можно расширять карту перевода для всех возможных issue_type
const reasonMap: Record<string, string> = {
  account: 'Проблема с аккаунтом',
  delivery_delay: 'Задержка доставки',
  product_question: 'Вопросы по товару',
  refund: 'Возврат',
  other: 'Другое',
  '': 'Неизвестно'
};

export function CustomerSupportPieChart() {
  const [tickets, setTickets] = useState<CustomerSupportItem[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month');

  useEffect(() => {
    fetch('/api/customer-support')
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (tickets.length === 0) return;

    const now = new Date();
    let filteredTickets: CustomerSupportItem[] = [];

    if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() + 2);
      filteredTickets = tickets.filter(
        (t) => new Date(t.support_date) >= monthAgo
      );
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filteredTickets = tickets.filter(
        (t) => new Date(t.support_date) >= yearAgo
      );
    } else {
      filteredTickets = tickets;
    }

    // подсчет частоты issue_type
    const grouped: Record<string, number> = {};
    filteredTickets.forEach((t) => {
      const reason = t.issue_type || 'other';
      grouped[reason] = (grouped[reason] || 0) + 1;
    });

    // топ-5
    const formatted: ChartData[] = Object.entries(grouped)
      .map(([reason, count]) => ({
        reason: reasonMap[reason] || reason,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setChartData(formatted);
  }, [tickets, period]);

  const chartConfig = {
    visitors: { label: 'Обращения' },
    chart1: { label: 'Частые обращения', color: 'var(--chart-1)' }
  } satisfies ChartConfig;

  return (
    <Card className='flex w-full flex-col'>
      <CardHeader className='flex items-center justify-between pb-0'>
        <div>
          <CardTitle>Частые обращения в поддержку</CardTitle>
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
          config={chartConfig}
          className='mx-auto aspect-square max-h-[300px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='reason'
              outerRadius={80}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Всего обращений: {chartData.reduce((acc, cur) => acc + cur.count, 0)}{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
