import { delay } from '@/constants/mock-api';
import Rating from '@/features/overview/components/rating';

export default async function Sales() {
  await delay(3000);
  return <Rating />;
}
