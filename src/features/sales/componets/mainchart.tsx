'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  supplier_id: string;
};

type ChartPoint = {
  month: string;
  revenue: number;
  sortKey: number;
};

const chartConfig = {
  revenue: { label: 'Выручка', color: 'var(--chart-1)' }
} satisfies ChartConfig;

export function ChartRevenue() {
  const [chartData, setChartData] = React.useState<ChartPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<'all' | 'year' | '3m'>(
    'all'
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, productsRes] = await Promise.all([
          fetch('/api/sales'),
          fetch('/api/products')
        ]);
        const sales: Sale[] = await salesRes.json();
        const products: Product[] = await productsRes.json();

        // Создаём карту product_id → цена
        const productMap = new Map(
          products.map((p) => [p.id, Number(p.price)])
        );

        // Группируем выручку по месяцу
        const counts: Record<number, number> = {};

        sales.forEach((sale) => {
          const date = new Date(sale.transaction_date);
          if (isNaN(date.getTime())) return;

          const price = productMap.get(sale.product_id);
          if (!price) return;

          const revenue = price * Number(sale.quantity);
          const monthKey = date.getMonth() + 1 + date.getFullYear() * 100; // уникальный месяц-год

          counts[monthKey] = (counts[monthKey] || 0) + revenue;
        });

        // Преобразуем в массив для графика
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
        let dataPoints: ChartPoint[] = Object.entries(counts).map(
          ([key, revenue]) => {
            const numKey = Number(key);
            const year = Math.floor(numKey / 100);
            const month = numKey % 100;
            return { month: monthNames[month - 1], revenue, sortKey: numKey };
          }
        );

        // Сортируем по времени
        dataPoints.sort((a, b) => a.sortKey - b.sortKey);
        setChartData(dataPoints);
      } catch (err) {
        console.error('Ошибка при загрузке графика выручки:', err);
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
    threeMonthsAgo.setMonth(now.getMonth() - 1); // включаем текущий месяц
    filteredData = chartData.filter((dp) => {
      const year = Math.floor(dp.sortKey / 100);
      const month = dp.sortKey % 100;
      const dpDate = new Date(year, month - 1);
      return dpDate >= threeMonthsAgo;
    });
  }

  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Выручка</CardTitle>
          <CardDescription>Динамика выручки по месяцам</CardDescription>
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
        <ChartContainer config={chartConfig} className='h-64 w-full'>
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
              dataKey='revenue'
              stroke='var(--color-revenue)'
              fill='var(--color-revenue)'
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
