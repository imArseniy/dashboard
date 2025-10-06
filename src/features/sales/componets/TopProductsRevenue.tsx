'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

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

export const description = 'Top 10 товаров по выручке';

const chartConfig = {
  revenue: {
    label: 'Выручка',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function TopProductsRevenueChart() {
  const [chartData, setChartData] = React.useState<
    { product: string; revenue: number }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<'all' | 'year' | 'month'>(
    'all'
  );

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const salesRes = await fetch('/api/sales');
        const salesData: {
          product_id: string;
          quantity: string;
          transaction_date: string;
        }[] = await salesRes.json();

        const productsRes = await fetch('/api/products');
        const productsData: { id: string; name: string; price: string }[] =
          await productsRes.json();

        const productMap = new Map(
          productsData.map((p) => [
            p.id,
            { name: p.name, price: Number(p.price) || 0 }
          ])
        );

        const now = new Date();
        let startDate: Date | null = null;
        if (timeRange === 'year') {
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 1);
        } else if (timeRange === 'month') {
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() + 2);
        }

        const revenueMap = new Map<string, number>();
        salesData.forEach((sale) => {
          const saleDate = new Date(sale.transaction_date);
          if (startDate && saleDate < startDate) return;

          const product = productMap.get(sale.product_id);
          if (!product) return;
          const quantity = Number(sale.quantity) || 0;
          const revenue = product.price * quantity;
          revenueMap.set(
            product.name,
            (revenueMap.get(product.name) || 0) + revenue
          );
        });

        const sorted = Array.from(revenueMap.entries())
          .map(([product, revenue]) => ({ product, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);

        setChartData(sorted);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
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
          <CardTitle>Топ 10 товаров по выручке</CardTitle>
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
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{ left: 30 }}
          >
            <XAxis type='number' dataKey='revenue' hide />
            <YAxis
              type='category'
              dataKey='product'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='revenue' fill='var(--chart-1)' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='text-muted-foreground leading-none'>
          Топ 10 товаров по выручке
        </div>
      </CardFooter>
    </Card>
  );
}
