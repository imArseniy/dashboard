import { delay } from '@/constants/mock-api';
import Reviews from '@/features/overview/components/reviews';

export default async function Sales() {
  await delay(3000);
  return <Reviews />;
}
