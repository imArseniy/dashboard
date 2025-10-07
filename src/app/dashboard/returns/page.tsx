import PageContainer from '@/components/layout/page-container';
import { ReturnsAreaChart } from '@/features/returns/componets/ChartAreaDefault';
import { ReturnsSumAreaChart } from '@/features/returns/componets/ChartAreaRevenue';
import { ReturnsReasonPieChart } from '@/features/returns/componets/PieChartReturns';
import TableDataReturns from '@/features/returns/componets/TableDataReturns';
import { TopReturnedProductsChart } from '@/features/returns/componets/TopReturnedProductsChart';

export const metadata = {
  title: 'Dashboard : Kanban view'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='mb-2 scroll-m-20 text-2xl font-semibold tracking-tight'>
            Аналитика возвратов
          </h1>
        </div>

        <ReturnsAreaChart></ReturnsAreaChart>
        <ReturnsSumAreaChart></ReturnsSumAreaChart>
        <div className='flex w-full gap-3'>
          <ReturnsReasonPieChart></ReturnsReasonPieChart>
          <TopReturnedProductsChart></TopReturnedProductsChart>
        </div>
      </div>
    </PageContainer>
  );
}
