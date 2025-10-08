import PageContainer from '@/components/layout/page-container';
import { ChartUserRegistrations } from '@/features/user-segments/componets/date';
import { ChartRadarRegions } from '@/features/user-segments/componets/regions';
import { ChartPieUserSegments } from '@/features/user-segments/componets/segments';

export const metadata = {
  title: 'Дашборд : Сегменты пользователей'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='mb-2 scroll-m-20 text-2xl font-semibold tracking-tight'>
            Сегменты пользователей
          </h1>
        </div>

        <div className='w-full'>
          <ChartUserRegistrations></ChartUserRegistrations>
        </div>
        <div className='w-ful flex flex-row gap-3'>
          <ChartPieUserSegments></ChartPieUserSegments>
          <ChartRadarRegions></ChartRadarRegions>
        </div>
      </div>
    </PageContainer>
  );
}
