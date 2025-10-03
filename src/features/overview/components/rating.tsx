import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrendingUp } from "@tabler/icons-react";

export default function Rating() {
  return (
    <Card className='@container/card col-span-4 md:col-span-4'>
            <CardHeader>
              <CardTitle>Оценка товаров</CardTitle>
              <CardDescription>На сегодня</CardDescription>
            </CardHeader>
            <CardContent className='@container/card col-span-4 md:col-span-4 md:grid-cols-2 lg:grid-cols-2*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2'>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Средняя оценка
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    4,94
                  </CardTitle>
                </CardContent>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Выкуплено
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    87%
                  </CardTitle>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter>
              <div className='text-muted-foreground'>
                Оставлено 5 новых отзывов
              </div>
            </CardFooter>
    </Card>
  );
}
