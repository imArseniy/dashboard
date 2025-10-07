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
import { Button } from '@/components/ui/button';
import Orders from './@orders/page';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ChartRevenue } from '@/features/sales/componets/mainchart';
import { ReturnsSumAreaChart } from '@/features/returns/componets/ChartAreaRevenue';
import { ReturnsReasonPieChart } from '@/features/returns/componets/PieChartReturns';
import { ChartPieRevenueByCategory } from '@/features/sales/componets/CategoriesRevenue';

export default function OverViewLayout({
  sales,
  sales_stats,
  pie_stats,
  bar_stats,
  area_stats,
  orders,
  logistic,
  reviews,
  rating
}: {
  sales: React.ReactNode;
  sales_stats: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  orders: React.ReactNode;
  logistic: React.ReactNode;
  reviews: React.ReactNode;
  rating: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Добро пожаловать 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'></div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-8'>
            <ChartRevenue></ChartRevenue>
          </div>
          <div className='col-span-8'>
            <ReturnsSumAreaChart></ReturnsSumAreaChart>
          </div>
          <div className='col-span-4'>
            <ReturnsReasonPieChart></ReturnsReasonPieChart>
          </div>
          <div className='col-span-4'>
            <ChartPieRevenueByCategory></ChartPieRevenueByCategory>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
