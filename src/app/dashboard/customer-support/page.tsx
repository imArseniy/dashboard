import PageContainer from '@/components/layout/page-container';
import { CustomerSupportAreaChart } from '@/features/customer-support/componets/CustomerSupportAreaChart';
import { CustomerSupportPieChart } from '@/features/customer-support/componets/CustomerSupportPieChart';
import { CustomerSupportResolvedPie } from '@/features/customer-support/componets/CustomerSupportResolvedPieChart';
import { AvgResolutionAreaChart } from '@/features/customer-support/componets/ResolutionAreaChart';
import TableDataCustomerSupport from '@/features/customer-support/componets/TableDataCustomerSupport';

export const metadata = {
  title: 'Дашборд : Аналитика обращений'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='mb-2 scroll-m-20 text-2xl font-semibold tracking-tight'>
            Аналитика обращений
          </h1>
        </div>

        <CustomerSupportAreaChart></CustomerSupportAreaChart>
        <div className='flex w-full gap-3'>
          <CustomerSupportPieChart></CustomerSupportPieChart>
          <CustomerSupportResolvedPie></CustomerSupportResolvedPie>
        </div>
        <AvgResolutionAreaChart></AvgResolutionAreaChart>
      </div>
    </PageContainer>
  );
}
