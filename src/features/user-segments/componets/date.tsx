'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

type UserSegment = {
  id: string;
  segment: string;
  region: string;
  registration_date: string;
};

type ChartPoint = {
  month: string;
  registrations: number;
  sortKey: number;
};

const chartConfig = {
  registrations: {
    label: 'Регистрации',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function ChartUserRegistrations() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/user-segments');
        const data: UserSegment[] = await res.json();

        // === Группировка по месяцам ===
        const counts: Record<string, number> = {};

        data.forEach((user) => {
          const date = new Date(user.registration_date);
          if (!isNaN(date.getTime())) {
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // например 2023-3
            counts[monthKey] = (counts[monthKey] || 0) + 1;
          }
        });

        // === Форматирование ===
        const formattedData: ChartPoint[] = Object.entries(counts)
          .map(([key, count]) => {
            const [year, month] = key.split('-').map(Number);
            const date = new Date(year, month - 1);
            const formatted = date.toLocaleDateString('ru-RU', {
              month: 'long',
              year: 'numeric'
            });
            const capitalized =
              formatted.charAt(0).toUpperCase() + formatted.slice(1);
            return {
              month: capitalized,
              registrations: count,
              sortKey: year * 12 + month
            };
          })
          .sort((a, b) => a.sortKey - b.sortKey);

        setChartData(formattedData);
      } catch (err) {
        console.error('Ошибка при загрузке данных графика:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Загрузка графика...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Регистрации пользователей</CardTitle>
        <CardDescription>Количество регистраций по месяцам</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className='h-64 w-full'>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              dataKey='registrations'
              type='monotone'
              fill='var(--color-registrations)'
              fillOpacity={0.4}
              stroke='var(--color-registrations)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Тренд роста регистраций <TrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              По месяцам, с начала наблюдений
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
