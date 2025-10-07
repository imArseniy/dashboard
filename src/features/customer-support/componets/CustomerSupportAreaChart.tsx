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

type CustomerSupportItem = {
  ticket_id: string;
  customer_id: string;
  issue_type: string;
  resolution_time_minutes: number | null;
  resolved: boolean | null;
  support_date: string;
};

type ChartData = {
  date: string;
  count: number;
};

export function CustomerSupportAreaChart() {
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

    // группировка по дням для месяца и по месяцам для года/всё
    const grouped: Record<string, number> = {};
    filteredTickets.forEach((t) => {
      const d = new Date(t.support_date);
      let key: string;
      if (period === 'month') {
        key = d.toISOString().split('T')[0]; // YYYY-MM-DD
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      }
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const formatted: ChartData[] = Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(formatted);
  }, [tickets, period]);

  const chartConfig = {
    desktop: {
      label: 'Обращения в поддержку',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;

  return (
    <Card className='w-full'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Обращения в поддержку</CardTitle>
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
              tickFormatter={(dateStr) => {
                const d = new Date(dateStr);
                if (period === 'month') {
                  return `${d.getDate()} ${d.toLocaleString('ru-RU', { month: 'short' })}`;
                } else {
                  return `${d.toLocaleString('ru-RU', { month: 'short' })} ${d.getFullYear()}`;
                }
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
              Всего обращений:{' '}
              {chartData.reduce((acc, cur) => acc + cur.count, 0)}{' '}
              <TrendingUp className='h-4 w-4' />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
