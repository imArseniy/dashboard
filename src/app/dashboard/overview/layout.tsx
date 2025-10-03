import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';
import { Button } from "@/components/ui/button"
import Orders from './@orders/page';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const logistic = [
  {
    id: "1",
    status: "Ожидает сборки",
    amount: 6,
  },
  {
    id: "2",
    status: "Ожидает отгрузки",
    amount: 2,
  },
  {
    id: "3",
    status: "Доставляются",
    amount: 17,
  },
];

export default function OverViewLayout({
  sales,
  sales_stats,
  pie_stats,
  bar_stats,
  area_stats,
  orders,
  logistic,
  reviews
}: {
  sales: React.ReactNode;
  sales_stats: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  orders: React.ReactNode;
  logistic: React.ReactNode;
  reviews: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Добро пожаловать 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card flex justify-between'>
            <CardHeader>
              <CardDescription>Баланс</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                13 525 ₽
              </CardTitle>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className="flex flex-wrap gap-1.5 md:content-around">
                <div className="flex flex-wrap items-center gap-2 md:flex-row ">
                  <Button>Вывести</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:flex-row">
                  <Button variant={'outline'}>Финансовые отчёты</Button>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Заказано товаров</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                367 146 ₽
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  +14%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Рост за 30 дней <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Сумма заказов за 30 дней
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Доставлено товаров</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                146 625 ₽
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingDown />
                  -20%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Падение за 30 дней <IconTrendingDown className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Доставленные заказы за 30 дней
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Проблемные товары</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                2%
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  +20%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Рост за неделю{' '}
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Товары с дефектами и проблемами
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className="col-span-8">{sales_stats}</div>
          <Card className='@container/card col-span-8 md:col-span-8'>
            <CardHeader>
              <CardTitle>Необработанные заказы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='col-span-6 md:col-span-6'>
                {orders}
              </div>
            </CardContent>
            <CardFooter>
              <Button>Все заказы</Button>
            </CardFooter>
          </Card>
          <div className='col-span-8'>{logistic}</div>
          <div className='col-span-4'>{reviews}</div>
        </div>
      </div>
    </PageContainer>
  );
}
