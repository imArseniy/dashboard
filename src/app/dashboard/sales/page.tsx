import PageContainer from '@/components/layout/page-container';
import { ChartPieCategories } from '@/features/sales/componets/CategoriesQuantity';
import { ChartPieRevenueByCategory } from '@/features/sales/componets/CategoriesRevenue';
import { ChartRevenue } from '@/features/sales/componets/mainchart';
import { TopCustomersBar } from '@/features/sales/componets/topcustomer';
import { TopProductsChart } from '@/features/sales/componets/TopProductsQuantity';
import { TopProductsRevenueChart } from '@/features/sales/componets/TopProductsRevenue';

export const metadata = {
  title: 'Dashboard : Kanban view'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='mb-2 scroll-m-20 text-2xl font-semibold tracking-tight'>
            Аналитика продаж
          </h1>
        </div>

        <div className='w-full'>
          <ChartRevenue></ChartRevenue>
        </div>
        <div className='w-ful flex flex-row gap-3'>
          <TopProductsRevenueChart></TopProductsRevenueChart>
          <TopProductsChart></TopProductsChart>
        </div>
        <div className='w-ful flex flex-row gap-3'>
          <ChartPieRevenueByCategory></ChartPieRevenueByCategory>
          <ChartPieCategories></ChartPieCategories>
        </div>
        <div className='w-ful flex flex-row gap-3'>
          <TopCustomersBar></TopCustomersBar>
        </div>
      </div>
    </PageContainer>
  );
}
