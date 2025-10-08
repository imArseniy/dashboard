import PageContainer from '@/components/layout/page-container';
import TableDataInventory from '@/features/inventory/componets/TableDataInventory';
import { WarehouseInventory } from '@/features/inventory/componets/warehouseinventory';

export const metadata = {
  title: 'Дашборд : Складские остатки'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='mb-2 scroll-m-20 text-2xl font-semibold tracking-tight'>
            Складские остатки
          </h1>
        </div>

        <div className='w-full'>
          <div className='flex w-full gap-3'>
            <WarehouseInventory></WarehouseInventory>
          </div>
          <TableDataInventory></TableDataInventory>
        </div>
      </div>
    </PageContainer>
  );
}
