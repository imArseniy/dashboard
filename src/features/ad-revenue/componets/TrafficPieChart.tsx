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

type TrafficItem = {
  id: string;
  customer_id: string;
  channel: string;
  session_start: string;
  device: string;
};

type ChartData = {
  channel: string;
  count: number;
  fill: string;
};

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)'
];

// словарь переводов каналов
const CHANNEL_TRANSLATIONS: Record<string, string> = {
  organic: 'Органический трафик',
  vk: 'ВК',
  yandex: 'Яндекс',
  'mail.ru_search': 'Поиск Mail.ru',
  malinka_ads: 'Реклама Малинки',
  unknown: 'Неизвестно'
};

export function TrafficPieChart() {
  const [data, setData] = useState<TrafficItem[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month');

  useEffect(() => {
    fetch('/api/traffic')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Ошибка загрузки данных:', err));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const now = new Date();
    let filtered: TrafficItem[] = [];

    if (period === 'month') {
      const daysAgo30 = new Date(now);
      daysAgo30.setDate(now.getDate() - 240); // последние 30 дней
      filtered = data.filter(
        (item) => new Date(item.session_start) >= daysAgo30
      );
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filtered = data.filter((item) => new Date(item.session_start) >= yearAgo);
    } else {
      filtered = data;
    }

    // группировка по каналу
    const grouped: Record<string, number> = {};
    for (const item of filtered) {
      const rawChannel = item.channel?.toLowerCase() || 'unknown';
      const translated = CHANNEL_TRANSLATIONS[rawChannel] || rawChannel; // если нет перевода — оставить как есть
      grouped[translated] = (grouped[translated] || 0) + 1;
    }

    const formatted: ChartData[] = Object.entries(grouped).map(
      ([channel, count], index) => ({
        channel,
        count,
        fill: COLORS[index % COLORS.length]
      })
    );

    setChartData(formatted);
  }, [data, period]);

  const totalVisitors = chartData.reduce((acc, cur) => acc + cur.count, 0);

  return (
    <Card className='flex w-full flex-col'>
      <CardHeader className='flex w-full items-center justify-between pb-0'>
        <div className=''>
          <CardTitle>Источники трафика</CardTitle>
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
          config={{}}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} посещений`, ' ', name]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='channel'
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
          Всего посещений: {totalVisitors} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Распределение по каналам трафика
        </div>
      </CardFooter>
    </Card>
  );
}
