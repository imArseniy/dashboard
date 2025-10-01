import { delay } from '@/constants/mock-api';
import { ChartAreaInteractive } from '@/features/overview/components/area-chart';

export default async function Sales() {
  await delay(3000);
  return <ChartAreaInteractive />;
}
