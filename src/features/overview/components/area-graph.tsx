'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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

const chartData = [
  { day: '1', order: 1434, delivery: 625 },
  { day: '2', order: 2552, delivery: 6257 },
  { day: '3', order: 1353, delivery: 355 },
  { day: '4', order: 3156, delivery: 423 },
  { day: '5', order: 5623, delivery: 4335 },
  { day: '6', order: 5241, delivery: 6224 },
  { day: '7', order: 10244, delivery: 1462 },
  { day: '8', order: 1356, delivery: 2444 },
  { day: '9', order: 3135, delivery: 3033 },
  { day: '10', order: 1434, delivery: 625 },
  { day: '11', order: 1434, delivery: 625 },
  { day: '12', order: 1434, delivery: 625 },
  { day: '13', order: 1434, delivery: 625 },
  { day: '14', order: 1434, delivery: 625 },
  { day: '15', order: 1434, delivery: 625 },
  { day: '16', order: 1434, delivery: 625 },
  { day: '17', order: 1434, delivery: 625 },
  { day: '18', order: 1434, delivery: 625 },
  { day: '19', order: 1434, delivery: 625 },
  { day: '20', order: 1434, delivery: 625 },
  { day: '21', order: 1434, delivery: 625 },
  { day: '22', order: 1434, delivery: 625 },
  { day: '23', order: 1434, delivery: 625 },
  { day: '24', order: 1434, delivery: 625 },
  { day: '25', order: 1434, delivery: 625 },
  { day: '26', order: 1434, delivery: 625 },
  { day: '27', order: 1434, delivery: 625 },
  { day: '28', order: 1434, delivery: 625 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  order: {
    label: 'Заказано',
    color: 'var(--primary)'
  },
  delivery: {
    label: 'Доставлено',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-desktop)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-desktop)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-mobile)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-mobile)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='day'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='delivery'
              type='natural'
              fill='url(#fillDelivery)'
              stroke='var(--color-delivery)'
              stackId='a'
            />
            <Area
              dataKey='order'
              type='natural'
              fill='url(#fillOrder)'
              stroke='var(--color-order)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Trending up by 5.2% this month{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
