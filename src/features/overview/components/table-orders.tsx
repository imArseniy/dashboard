import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const products = [
  {
    id: "15223372-1385-1",
    status: "Ожидает сборки",
    date: "25 сентября",
    name: "Футболка мужская ZARA",
    article: "5324546, 1 шт.",
    price: "2 420 ₽",
    warehouse: "ЕКБ-Главный",
  },
  {
    id: "3135614-4422-2",
    status: "Ожидает сборки",
    date: "25 сентября",
    name: "Футболка мужская ZARA",
    article: "3468235, 1 шт.",
    price: "2 420 ₽",
    warehouse: "ЕКБ-Академ",
  },
  {
    id: "4267214-4462-1",
    status: "Ожидает сборки",
    date: "24 сентября",
    name: "Футболка мужская ZARA",
    article: "42457724, 2 шт.",
    price: "2 420 ₽",
    warehouse: "ЕКБ-Главный",
  },
  {
    id: "246884242-8424-1",
    status: "Ожидает сборки",
    date: "24 сентября",
    name: "Платье Mango",
    article: "6832446, 1 шт.",
    price: "5 780 ₽",
    warehouse: "ЕКБ-Академ",
  },
  {
    id: "13644782-4223-8",
    status: "Ожидает сборки",
    date: "24 сентября",
    name: "Футболка мужская ZARA",
    article: "3216783, 3 шт.",
    price: "2 420 ₽",
    warehouse: "ЕКБ-Академ",
  },
  {
    id: "42674514-4462-1",
    status: "Ожидает сборки",
    date: "24 сентября",
    name: "Футболка мужская ZARA",
    article: "42457724, 2 шт.",
    price: "2 420 ₽",
    warehouse: "ЕКБ-Главный",
  },
];
export default function Orders() {
  return (
    <div className="w-full rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Номер отправления</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата отгрузки</TableHead>
            <TableHead>Наименование</TableHead>
            <TableHead>Артикул, количество</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Склад</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="odd:bg-muted/50">
              <TableCell className="pl-4">{product.id}</TableCell>
              <TableCell><Badge variant="outline">{product.status}</Badge></TableCell>
              <TableCell>{product.date}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.article}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.warehouse}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
