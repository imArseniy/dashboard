import PageContainer from '@/components/layout/page-container';
import { AdRevenueChart } from '@/features/ad-revenue/componets/AdRevenueChart';
import { AdSpendChart } from '@/features/ad-revenue/componets/AdSpendChart';
import { ChartLineConversion } from '@/features/ad-revenue/componets/ChartLineConversion';
import { AdPerformanceChart } from '@/features/ad-revenue/componets/StackedBarChart';
import { DevicePieChart } from '@/features/ad-revenue/componets/TrafficDevicePieChart';
import { TrafficPieChart } from '@/features/ad-revenue/componets/TrafficPieChart';
import { ChartRevenue } from '@/features/sales/componets/mainchart';

export const metadata = {
  title: 'Dashboard : Kanban view'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='mb-2 scroll-m-20 text-2xl font-semibold tracking-tight'>
            Аналитика рекламы
          </h1>
        </div>

        <AdPerformanceChart></AdPerformanceChart>
        <div className='flex w-full gap-3'>
          <TrafficPieChart></TrafficPieChart>
          <DevicePieChart></DevicePieChart>
        </div>
        <ChartLineConversion></ChartLineConversion>
        <AdSpendChart></AdSpendChart>
        <AdRevenueChart></AdRevenueChart>
      </div>
    </PageContainer>
  );
}
