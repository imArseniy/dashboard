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
import { TrendingUp, TrendingDown } from 'lucide-react';

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
  label: string;
  revenue: number;
  dateKey: number;
};

const chartConfig = {
  revenue: { label: 'Выручка', color: 'var(--chart-1)' }
} satisfies ChartConfig;

export function ChartRevenue() {
  const [chartData, setChartData] = React.useState<ChartPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<
    '14d' | '28d' | '3m' | 'all'
  >('all');

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, productsRes] = await Promise.all([
          fetch('/api/sales'),
          fetch('/api/products')
        ]);
        const sales: Sale[] = await salesRes.json();
        const products: Product[] = await productsRes.json();

        const productMap = new Map(
          products.map((p) => [p.id, Number(p.price)])
        );

        const counts: Record<string, number> = {};
        sales.forEach((sale) => {
          const date = new Date(sale.transaction_date);
          if (isNaN(date.getTime())) return;

          const price = productMap.get(sale.product_id);
          if (!price) return;

          const revenue = price * Number(sale.quantity);
          const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          counts[key] = (counts[key] || 0) + revenue;
        });

        const dataPoints: ChartPoint[] = Object.entries(counts).map(
          ([key, revenue]) => {
            const date = new Date(key);
            const label = date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short'
            });
            return { label, revenue, dateKey: date.getTime() };
          }
        );

        dataPoints.sort((a, b) => a.dateKey - b.dateKey);
        setChartData(dataPoints);
      } catch (err) {
        console.error('Ошибка при загрузке данных графика:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Загрузка графика...</div>;

  const now = new Date();
  let filteredData = chartData;
  let prevPeriodData: ChartPoint[] = [];

  const getFilterDays = (range: typeof timeRange) =>
    range === '14d' ? 14 : range === '28d' ? 28 : range === '3m' ? 90 : 0;

  if (timeRange !== 'all') {
    const filterDays = getFilterDays(timeRange);
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - filterDays + 85);

    filteredData = chartData.filter((dp) => dp.dateKey >= fromDate.getTime());

    // Предыдущий аналогичный период
    const prevFrom = new Date(fromDate);
    const prevTo = new Date(fromDate);
    prevFrom.setDate(prevFrom.getDate() - filterDays);
    prevPeriodData = chartData.filter(
      (dp) =>
        dp.dateKey >= prevFrom.getTime() && dp.dateKey < fromDate.getTime()
    );
  }

  // Агрегируем по месяцам, если выбран "3 месяца" или "всё время"
  if (timeRange === '3m' || timeRange === 'all') {
    const monthly: Record<string, number> = {};
    filteredData.forEach((dp) => {
      const d = new Date(dp.dateKey);
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthly[monthKey] = (monthly[monthKey] || 0) + dp.revenue;
    });

    filteredData = Object.entries(monthly).map(([key, revenue]) => {
      const [year, month] = key.split('-').map(Number);
      const label = new Date(year, month - 1).toLocaleDateString('ru-RU', {
        month: 'short'
      });
      return { label, revenue, dateKey: new Date(year, month - 1).getTime() };
    });
  }

  // Текущая и предыдущая выручка
  const totalRevenue = filteredData.reduce((sum, dp) => sum + dp.revenue, 0);
  const prevRevenue = prevPeriodData.reduce((sum, dp) => sum + dp.revenue, 0);

  const formattedRevenue = totalRevenue.toLocaleString('ru-RU', {
    maximumFractionDigits: 0
  });

  // Рассчитываем изменение в процентах
  let changePercent = 0;
  if (prevRevenue > 0) {
    changePercent = ((totalRevenue - prevRevenue) / prevRevenue) * 100;
  }

  const trendUp = changePercent >= 0;
  const formattedChange = `${trendUp ? '+' : ''}${changePercent.toFixed(1)}%`;

  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Выручка</CardTitle>
          <CardDescription>
            Динамика выручки за выбранный период
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Период' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='14d'>За 14 дней</SelectItem>
            <SelectItem value='28d'>За 28 дней</SelectItem>
            <SelectItem value='3m'>За 3 месяца</SelectItem>
            <SelectItem value='all'>За всё время</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className='h-64 w-full'>
          <AreaChart data={filteredData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='label'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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

      <CardFooter className='text-muted-foreground flex flex-col items-start gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {trendUp ? (
            <TrendingUp className='h-4 w-4 text-green-500' />
          ) : (
            <TrendingDown className='h-4 w-4 text-red-500' />
          )}
          <span
            className={
              trendUp
                ? 'font-medium text-green-600'
                : 'font-medium text-red-600'
            }
          >
            {formattedChange}
          </span>
          <span>по сравнению с предыдущим периодом</span>
        </div>
        <div className='text-foreground flex w-full items-center justify-between text-base'>
          <span>Суммарная выручка за период:</span>
          <span className='font-semibold'>{formattedRevenue} ₽</span>
        </div>
      </CardFooter>
    </Card>
  );
}
