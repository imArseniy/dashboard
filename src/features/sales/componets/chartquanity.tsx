'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
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

type Sale = {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: string;
  payment_method: string;
  transaction_date: string;
};

type ChartPoint = {
  month: string;
  quantity: number;
  sortKey: number;
};

const chartConfig = {
  quantity: { label: 'Продажи (шт)', color: 'var(--chart-2)' }
} satisfies ChartConfig;

export function ChartSales() {
  const [chartData, setChartData] = React.useState<ChartPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<'all' | 'year' | '3m'>(
    'all'
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sales');
        const sales: Sale[] = await res.json();

        // Группировка количества продаж по месяцам
        const counts: Record<number, number> = {};

        sales.forEach((sale) => {
          const date = new Date(sale.transaction_date);
          if (isNaN(date.getTime())) return;

          const monthKey = date.getMonth() + 1 + date.getFullYear() * 100; // уникальный месяц-год
          const qty = Number(sale.quantity) || 0;

          counts[monthKey] = (counts[monthKey] || 0) + qty;
        });

        // Преобразуем данные для графика
        const monthNames = [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь'
        ];

        const dataPoints: ChartPoint[] = Object.entries(counts).map(
          ([key, quantity]) => {
            const numKey = Number(key);
            const year = Math.floor(numKey / 100);
            const month = numKey % 100;
            return { month: monthNames[month - 1], quantity, sortKey: numKey };
          }
        );

        dataPoints.sort((a, b) => a.sortKey - b.sortKey);
        setChartData(dataPoints);
      } catch (err) {
        console.error('Ошибка при загрузке графика продаж:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Загрузка графика...</div>;

  // Фильтр по времени
  const now = new Date();
  let filteredData = chartData;

  if (timeRange === 'year') {
    const lastYear = now.getFullYear() - 1;
    filteredData = chartData.filter(
      (dp) => Math.floor(dp.sortKey / 100) >= lastYear
    );
  } else if (timeRange === '3m') {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 1);
    filteredData = chartData.filter((dp) => {
      const year = Math.floor(dp.sortKey / 100);
      const month = dp.sortKey % 100;
      const dpDate = new Date(year, month - 1);
      return dpDate >= threeMonthsAgo;
    });
  }

  return (
    <Card className='w-full'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Количество продаж</CardTitle>
          <CardDescription>
            {timeRange === 'all'
              ? 'За всё время'
              : timeRange === 'year'
                ? 'За последний год'
                : 'За последние 3 месяца'}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder='Период' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>За всё время</SelectItem>
            <SelectItem value='year'>За год</SelectItem>
            <SelectItem value='3m'>За 3 месяца</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className='w-full'>
          <AreaChart data={filteredData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator='line' />} />
            <Area
              type='monotone'
              dataKey='quantity'
              stroke='var(--color-quantity)'
              fill='var(--color-quantity)'
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
