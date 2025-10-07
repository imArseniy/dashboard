'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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

export const description = 'Конверсия рекламы (клики / показы)';

type AdRevenue = {
  date: string;
  impressions: string;
  clicks: string;
};

const chartConfig = {
  conversion: { label: 'Конверсия (%)', color: 'var(--chart-1)' }
} satisfies ChartConfig;

export function ChartLineConversion() {
  const [chartData, setChartData] = React.useState<
    { date: string; conversion: number }[]
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

        // Группировка по дате
        const map = new Map<string, { impressions: number; clicks: number }>();
        data.forEach((item) => {
          const itemDate = new Date(item.date);
          if (startDate && itemDate < startDate) return;

          const impressions = Number(item.impressions) || 0;
          const clicks = Number(item.clicks) || 0;

          if (!map.has(item.date)) {
            map.set(item.date, { impressions, clicks });
          } else {
            const prev = map.get(item.date)!;
            map.set(item.date, {
              impressions: prev.impressions + impressions,
              clicks: prev.clicks + clicks
            });
          }
        });

        const chartArray = Array.from(map.entries())
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([date, { impressions, clicks }]) => ({
            date,
            conversion:
              impressions > 0 ? +((clicks / impressions) * 100).toFixed(2) : 0
          }));

        setChartData(chartArray);
      } catch (err) {
        console.error('Ошибка при загрузке данных конверсии:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) return <div>Загрузка графика...</div>;

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle>Конверсия рекламы</CardTitle>
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
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short'
                })
              }
            />
            <YAxis unit='%' />
            <ChartTooltip
              cursor={false}
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
            <Line
              dataKey='conversion'
              type='natural'
              stroke='var(--color-conversion)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='text-muted-foreground text-sm'>
        Конверсия (%) = клики / показы * 100
      </CardFooter>
    </Card>
  );
}
