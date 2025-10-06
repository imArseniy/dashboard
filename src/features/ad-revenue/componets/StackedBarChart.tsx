'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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

export const description = 'Стековая диаграмма показов и кликов';

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

const chartConfig = {
  impressions: { label: 'Показы', color: 'var(--chart-1)' },
  clicks: { label: 'Клики', color: 'var(--chart-2)' }
} satisfies ChartConfig;

export function AdPerformanceChart() {
  const [chartData, setChartData] = React.useState<
    { date: string; impressions: number; clicks: number }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<'all' | 'year' | 'month'>(
    'all'
  );

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/ad-revenue');
        const data: AdRevenue[] = await res.json();

        const now = new Date();
        let startDate: Date | null = null;
        if (timeRange === 'year') {
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 1);
        } else if (timeRange === 'month') {
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() + 2);
        }

        const map = new Map<string, { impressions: number; clicks: number }>();
        data.forEach((item) => {
          const itemDate = new Date(item.date);
          if (startDate && itemDate < startDate) return;

          const dateKey = item.date;
          const impressions = Number(item.impressions) || 0;
          const clicks = Number(item.clicks) || 0;

          if (!map.has(dateKey)) {
            map.set(dateKey, { impressions, clicks });
          } else {
            const prev = map.get(dateKey)!;
            map.set(dateKey, {
              impressions: prev.impressions + impressions,
              clicks: prev.clicks + clicks
            });
          }
        });

        const chartArray = Array.from(map.entries())
          .map(([date, values]) => ({
            date,
            impressions: values.impressions,
            clicks: values.clicks
          }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setChartData(chartArray);
      } catch (err) {
        console.error('Ошибка при загрузке данных ad-revenue:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) return <div>Загрузка графика...</div>;

  return (
    <Card className='w-full'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Основные показатели</CardTitle>
          <CardDescription>
            {timeRange === 'all'
              ? 'За всё время'
              : timeRange === 'year'
                ? 'За последний год'
                : 'За последний месяц'}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <SelectTrigger className='w-[160px] rounded-lg'>
            <SelectValue placeholder='Выберите период' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='all'>Всё время</SelectItem>
            <SelectItem value='year'>Последний год</SelectItem>
            <SelectItem value='month'>Последний месяц</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-96 w-full'>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            height={350}
          >
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short'
                })
              }
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  }
                />
              }
            />
            {/* Нижний слой - Показы */}
            <Bar
              dataKey='impressions'
              stackId='a'
              fill='var(--chart-1)'
              radius={[4, 4, 0, 0]}
            />
            {/* Верхний слой - Клики */}
            <Bar
              dataKey='clicks'
              stackId='a'
              fill='var(--chart-2)'
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='text-muted-foreground text-sm'>
        Показатели рекламы: показы и клики
      </CardFooter>
    </Card>
  );
}
