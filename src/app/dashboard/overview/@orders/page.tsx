import { delay } from '@/constants/mock-api';
import Orders from '@/features/overview/components/table-orders';

export default async function Sales() {
  await delay(3000);
  return <Orders />;
}
