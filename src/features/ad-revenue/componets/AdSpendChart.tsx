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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type AdRevenue = {
  id: string;
  campaign_name: string;
  product_id: string;
  spend: string;
  revenue: string;
  impressions: string;
  clicks: string;
  date: string;
};

type ChartData = {
  label: string;
  spend: number;
  rawDate: Date;
};

const chartConfig = {
  spend: {
    label: 'Затраты',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function AdSpendChart() {
  const [data, setData] = useState<AdRevenue[]>([]);
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch('/api/ad-revenue')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Ошибка загрузки данных:', err));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const now = new Date();
    let filtered: AdRevenue[] = [];

    if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() + 2);
      filtered = data.filter((item) => new Date(item.date) >= monthAgo);
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filtered = data.filter((item) => new Date(item.date) >= yearAgo);
    } else {
      filtered = data;
    }

    const grouped: Record<string, { total: number; date: Date }> = {};

    for (const item of filtered) {
      const d = new Date(item.date);
      const key =
        period === 'month'
          ? d.toISOString().split('T')[0]
          : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      grouped[key] = {
        total: (grouped[key]?.total || 0) + parseFloat(item.spend || '0'),
        date: d
      };
    }

    const formatted: ChartData[] = Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([label, { total, date }]) => ({
        label: formatDate(date, period),
        spend: total,
        rawDate: date
      }));

    setChartData(formatted);
  }, [data, period]);

  function formatDate(date: Date, period: string) {
    const options: Intl.DateTimeFormatOptions =
      period === 'month'
        ? { day: 'numeric', month: 'long', year: 'numeric' }
        : { month: 'long', year: 'numeric' };

    return date.toLocaleDateString('ru-RU', options);
  }

  function getXTicks(): string[] {
    if (period === 'month') {
      // Раз в 3 дня
      const ticks: string[] = [];
      for (let i = 0; i < chartData.length; i += 3) {
        ticks.push(chartData[i].label);
      }
      return ticks;
    } else {
      // Раз в месяц
      return chartData.map((d) => d.label);
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Затраты на рекламу</CardTitle>
          <CardDescription>
            {period === 'month'
              ? 'Последний месяц (по дням)'
              : period === 'year'
                ? 'Последний год (по месяцам)'
                : 'Всё время (по месяцам)'}
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
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='label'
              ticks={getXTicks()}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(v) => {
                const d = chartData.find((x) => x.label === v)?.rawDate;
                if (!d) return v;
                if (period === 'month') {
                  return d.getDate().toString();
                } else {
                  return d.toLocaleDateString('ru-RU', { month: 'short' });
                }
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='line'
                  labelFormatter={(label) => label}
                />
              }
            />
            <Area
              dataKey='spend'
              type='monotone'
              fill='var(--color-spend)'
              fillOpacity={0.4}
              stroke='var(--color-spend)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Динамика затрат за выбранный период
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
