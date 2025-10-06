'use client';

import * as React from 'react';
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

export const description = 'Топ категорий по выручке';

// Цвета категорий
const categoryColors: Record<string, string> = {
  Электроника: 'var(--chart-1)',
  Одежда: 'var(--chart-2)',
  Еда: 'var(--chart-3)',
  Красота: 'var(--chart-4)',
  'Товары для дома': 'var(--chart-5)',
  Другие: 'var(--chart-6)'
};

// Словарь перевода категорий
const categoryNames: Record<string, string> = {
  Electronics: 'Электроника',
  Clothes: 'Одежда',
  Food: 'Еда',
  Beauty: 'Красота',
  Home: 'Товары для дома'
};

const chartConfig = {
  visitors: { label: 'Выручка' }
} satisfies ChartConfig;

export function ChartPieRevenueByCategory() {
  const [chartData, setChartData] = React.useState<
    { category: string; revenue: number }[]
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
        const productsData: { id: string; category: string; price: string }[] =
          await productsRes.json();

        const productMap = new Map(
          productsData.map((p) => [
            p.id,
            { category: p.category || 'Другие', price: Number(p.price) || 0 }
          ])
        );

        const now = new Date();
        let startDate: Date | null = null;
        if (timeRange === 'year') {
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 1);
        } else if (timeRange === 'month') {
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
        }

        const categoryMap = new Map<string, number>();
        salesData.forEach((sale) => {
          const saleDate = new Date(sale.transaction_date);
          if (startDate && saleDate < startDate) return;

          const product = productMap.get(sale.product_id);
          const rawCategory = product?.category || 'Другие';
          const category =
            categoryNames[rawCategory] || rawCategory || 'Другие';
          const quantity = Number(sale.quantity) || 0;
          const revenue = quantity * (product?.price || 0);
          categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
        });

        let data = Array.from(categoryMap.entries())
          .map(([category, revenue]) => ({ category, revenue }))
          .sort((a, b) => b.revenue - a.revenue);

        const topData = data.slice(0, 5);
        const otherRevenue = data
          .slice(5)
          .reduce((sum, d) => sum + d.revenue, 0);
        if (otherRevenue > 0)
          topData.push({ category: 'Другие', revenue: otherRevenue });

        setChartData(topData);
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
    <Card className='flex w-full flex-col'>
      <CardHeader className='flex items-center justify-between pb-0'>
        <div>
          <CardTitle>Категории по выручке</CardTitle>
          <CardDescription>Все категории по выручке</CardDescription>
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
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto max-h-[250px]'>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={false} />}
            />
            <Pie
              data={chartData}
              dataKey='revenue'
              nameKey='category'
              label={(entry) => entry.category}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={categoryColors[entry.category] || '#94a3b8'}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='text-muted-foreground leading-none'>
          Категории по выручке
        </div>
      </CardFooter>
    </Card>
  );
}
