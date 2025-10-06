'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

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

export const description = 'Pie chart по сегментам пользователей';

type UserSegmentItem = {
  customer_id: string;
  segment: string | null;
};

const SEGMENT_TRANSLATIONS: Record<string, string> = {
  discount_hunter: 'Охотних за скидками',
  loyal: 'Лояльный',
  new: 'Новый',
  churn_risk: 'Риск оттока',
  high_spender: 'Много тратит',
  returning: 'Возвращающийся'
};

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)'
];

export function ChartPieUserSegments() {
  const [chartData, setChartData] = useState<
    { browser: string; visitors: number; fill: string }[]
  >([]);

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    visitors: { label: 'Пользователи' }
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/user-segments');
        const data: UserSegmentItem[] = await res.json();

        const counts: Record<string, number> = {};
        data.forEach((item) => {
          const seg = item.segment ?? 'Other';
          counts[seg] = (counts[seg] || 0) + 1;
        });

        const newChartData = Object.entries(counts).map(
          ([segment, count], idx) => ({
            browser: SEGMENT_TRANSLATIONS[segment] ?? segment,
            visitors: count,
            fill: COLORS[idx % COLORS.length]
          })
        );

        setChartData(newChartData);

        // Формируем конфиг для отображения легенды и цветов
        const newConfig: ChartConfig = {
          visitors: { label: 'Пользователи' }
        };
        newChartData.forEach((d) => {
          newConfig[d.browser] = { label: d.browser, color: d.fill };
        });
        setChartConfig(newConfig);
      } catch (err) {
        console.error('Ошибка при загрузке сегментов:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className='flex w-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Распределение пользователей по сегментам</CardTitle>
        <CardDescription>
          На основе данных текущих пользователей
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey='visitors' nameKey='browser' />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Актуальные данные сегментов пользователей{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Показывается распределение по сегментам на основе текущих
          пользователей
        </div>
      </CardFooter>
    </Card>
  );
}
