import { delay } from '@/constants/mock-api';
import Logistic from '@/features/overview/components/logistic';

export default async function Sales() {
  await delay(3000);
  return <Logistic />;
}
