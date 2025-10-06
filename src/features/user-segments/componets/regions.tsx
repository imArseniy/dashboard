'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

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

// Тип данных пользователя
type UserSegment = {
  region: string | null;
};

// Перевод регионов на русский
const REGION_TRANSLATIONS: Record<string, string> = {
  Moscow: 'Москва',
  Kazan: 'Казань',
  SPB: 'Санкт-Петербург',
  Ekaterinburg: 'Екатеринбург'
};

// Конфигурация цветов графика
const chartConfig = {
  users: {
    label: 'Пользователи',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function ChartRadarRegions() {
  const [chartData, setChartData] = useState<
    { region: string; users: number }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/user-segments');
        const data: UserSegment[] = await response.json();

        // Группировка пользователей по регионам
        const counts: Record<string, number> = {};
        data.forEach((item) => {
          const region = item.region || 'Unknown';
          counts[region] = (counts[region] || 0) + 1;
        });

        // Формируем данные для графика с переводом
        const formatted = Object.entries(counts).map(([region, users]) => ({
          region: REGION_TRANSLATIONS[region] || region,
          users
        }));

        setChartData(formatted);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }

    loadData();
  }, []);

  return (
    <Card className='w-full'>
      <CardHeader className='items-center'>
        <CardTitle>Распределение пользователей по регионам</CardTitle>
        <CardDescription>Распределение по регионам</CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto max-h-[300px]'>
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='region' />
            <PolarGrid />
            <Radar
              dataKey='users'
              fill='var(--chart-2)'
              fillOpacity={0.6}
              stroke='var(--chart-2)'
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='text-muted-foreground leading-none'>
          Отображается распределение пользователей по регионам
        </div>
      </CardFooter>
    </Card>
  );
}
