'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
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

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  supplier_id: string;
};

type CustomerRevenue = {
  customer: string;
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: 'Выручка',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function TopCustomersBar() {
  const [chartData, setChartData] = React.useState<CustomerRevenue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<'all' | 'year' | 'month'>(
    'all'
  );

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
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

        const now = new Date();
        let startDate: Date | null = null;
        if (timeRange === 'year') {
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 1);
        } else if (timeRange === 'month') {
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
        }

        const revenueMap = new Map<string, number>();
        sales.forEach((sale) => {
          const saleDate = new Date(sale.transaction_date);
          if (startDate && saleDate < startDate) return;

          const price = productMap.get(sale.product_id);
          if (!price) return;
          const revenue = price * Number(sale.quantity);
          revenueMap.set(
            sale.customer_id,
            (revenueMap.get(sale.customer_id) || 0) + revenue
          );
        });

        const topCustomers: CustomerRevenue[] = Array.from(revenueMap.entries())
          .map(([customer, revenue]) => ({ customer, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);

        setChartData(topCustomers);
      } catch (err) {
        console.error('Ошибка при загрузке топ-10 покупателей:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <Card className='w-1/2'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle>Топ 10 покупателей по выручке</CardTitle>
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
            data={chartData}
            layout='vertical'
            margin={{ left: 10 }}
            height={300}
          >
            <XAxis type='number' dataKey='revenue' hide />
            <YAxis
              dataKey='customer'
              type='category'
              tickLine={false}
              tickMargin={4}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='revenue' fill='var(--chart-1)' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='text-muted-foreground leading-none'>
          Топ-10 покупателей по суммарной выручке
        </div>
      </CardFooter>
    </Card>
  );
}
