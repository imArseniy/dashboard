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


const review = [
  {
    id: "1",
    status: "Отзывы",
    amount: "2 147",
  },
  {
    id: "2",
    status: "Вопросы",
    amount: "13",
  },
  {
    id: "3",
    status: "Заявки на скидки",
    amount: "34",
  },
];

const message = [
  {
    id: "1",
    status: "Непрочитанные",
    amount: "3",
  },
  {
    id: "2",
    status: "Новые за сегодня",
    amount: "4",
  },
];

export default function Reviews() {
  return (
    <Card className='@container/card col-span-4 md:col-span-4'>
            <CardHeader>
              <CardTitle>Коммуникации</CardTitle>
            </CardHeader>
            <CardContent className='@container/card col-span-4 md:col-span-4 md:grid-cols-2 lg:grid-cols-2*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2'>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Новые взаимодействия
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <Table>
                    <TableBody>
                      {review.map((review) => (
                        <TableRow key={review.id} className="">
                          <TableCell>{review.status}</TableCell>
                          <TableCell className="text-right">{review.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardTitle className=''>
                    Сообщения от покупателей
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-col items-start gap-1.5 text-sm'>
                  <Table>
                    <TableBody>
                      {message.map((message) => (
                        <TableRow key={message.id} className="">
                          <TableCell>{message.status}</TableCell>
                          <TableCell className="text-right">{message.amount}</TableCell>
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
