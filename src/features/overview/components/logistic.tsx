import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const logistic = [
  {
    id: "1",
    status: "Ожидает сборки",
    amount: 6,
  },
  {
    id: "2",
    status: "Ожидает отгрузки",
    amount: 2,
  },
  {
    id: "3",
    status: "Доставляются",
    amount: 17,
  },
];

const returns = [
  {
    id: "1",
    status: "Ожидают решения",
    amount: 2,
  },
  {
    id: "2",
    status: "Доставляются",
    amount: 3,
  },
  {
    id: "3",
    status: "В пункте выдачи",
    amount: 0,
  },
];

const mistake = [
  {
    id: "1",
    status: "Индекс ошибок",
    amount: "2%",
  },
  {
    id: "2",
    status: "Расходы",
    amount: "3 423 ₽",
  },
  {
    id: "3",
    status: "Отменённых заказов",
    amount: 5,
  },
];

const recycling = [
  {
    id: "1",
    status: "Коробки к вывозу",
    amount: "1 коробка",
  },
  {
    id: "2",
    status: "Возвраты со стока",
    amount: "2 штуки",
  },
  {
    id: "3",
    status: "Утилизация",
    amount: "2 коробки",
  },
];

export default function Logistic() {
  return (
    <Card className='@container/card'>
            <CardHeader>
              <CardTitle>Логистика</CardTitle>
            </CardHeader>
            <CardContent className='@container/card col-span-8 md:col-span-8 md:grid-cols-2 lg:grid-cols-4*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-4'>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Отправления FBS
                  </CardTitle>
                  <CardDescription>На сегодня</CardDescription>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <Table>
                    <TableBody>
                      {logistic.map((logistic) => (
                        <TableRow key={logistic.id} className="">
                          <TableCell>{logistic.status}</TableCell>
                          <TableCell className="text-right">{logistic.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Возвраты FBS
                  </CardTitle>
                  <CardDescription>На сегодня</CardDescription>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <Table>
                    <TableBody>
                      {returns.map((returns) => (
                        <TableRow key={returns.id} className="">
                          <TableCell>{returns.status}</TableCell>
                          <TableCell className="text-right">{returns.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Индекс ошибок FBS
                  </CardTitle>
                  <CardDescription>За 14 дней</CardDescription>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <Table>
                    <TableBody>
                      {mistake.map((mistake) => (
                        <TableRow key={mistake.id} className="">
                          <TableCell>{mistake.status}</TableCell>
                          <TableCell className="text-right">{mistake.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Вывоз и утилизация
                  </CardTitle>
                  <CardDescription>На сегодня</CardDescription>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <Table>
                    <TableBody>
                      {recycling.map((recycling) => (
                        <TableRow key={recycling.id} className="">
                          <TableCell>{recycling.status}</TableCell>
                          <TableCell className="text-right">{recycling.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CardContent>
    </Card>
  );
}
