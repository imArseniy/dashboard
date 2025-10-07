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
  name: string;
  value: number;
};

const COLORS = ['var(--chart-1)', 'var(--chart-2)'];

const chartConfig = {
  visitors: { label: 'Обращения' },
  resolved: { label: 'Решено', color: 'var(--chart-1)' },
  notResolved: { label: 'Не решено', color: 'var(--chart-2)' }
} satisfies ChartConfig;

export function CustomerSupportResolvedPie() {
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

    const resolvedCount = filteredTickets.filter((t) => t.resolved).length;
    const notResolvedCount = filteredTickets.filter((t) => !t.resolved).length;

    setChartData([
      { name: 'Да', value: resolvedCount },
      { name: 'Нет', value: notResolvedCount }
    ]);
  }, [tickets, period]);

  return (
    <Card className='flex w-full flex-col'>
      <CardHeader className='flex items-center justify-between pb-0'>
        <div>
          <CardTitle>Обращения решены</CardTitle>
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
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
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
          Всего обращений: {chartData.reduce((acc, cur) => acc + cur.value, 0)}{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
