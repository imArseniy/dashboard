import PageContainer from '@/components/layout/page-container';
import { ChartLineConversion } from '@/features/ad-revenue/componets/ChartLineConversion';
import { AdPerformanceChart } from '@/features/ad-revenue/componets/StackedBarChart';
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

        <div className='w-full flex-row gap-3'>
          <AdPerformanceChart></AdPerformanceChart>
          <ChartLineConversion></ChartLineConversion>
        </div>
      </div>
    </PageContainer>
  );
}
