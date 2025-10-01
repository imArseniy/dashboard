"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "Заказано товаров"

const chartData = [
  { date: "2025-06-01", order: 2141, delivery: 1355 },
  { date: "2025-06-02", order: 9943, delivery: 1467 },
  { date: "2025-06-03", order: 4244, delivery: 4652 },
  { date: "2025-06-04", order: 1523, delivery: 425 },
  { date: "2025-06-05", order: 8449, delivery: 5324 },
  { date: "2025-06-06", order: 2268, delivery: 2367 },
  { date: "2025-06-07", order: 2643, delivery: 3743 },
  { date: "2025-06-08", order: 7932, delivery: 5236 },
  { date: "2025-06-09", order: 5902, delivery: 1789 },
  { date: "2025-06-10", order: 2141, delivery: 1355 },
  { date: "2025-06-11", order: 3478, delivery: 1467 },
  { date: "2025-06-12", order: 4244, delivery: 4652 },
  { date: "2025-06-13", order: 1523, delivery: 425 },
  { date: "2025-06-14", order: 4567, delivery: 5324 },
  { date: "2025-06-15", order: 3994, delivery: 2367 },
  { date: "2025-06-16", order: 2643, delivery: 3743 },
  { date: "2025-06-17", order: 7932, delivery: 5236 },
  { date: "2025-06-18", order: 5902, delivery: 1789 },
  { date: "2025-06-19", order: 7932, delivery: 5236 },
  { date: "2025-06-20", order: 5902, delivery: 1789 },
  { date: "2025-06-21", order: 2141, delivery: 1355 },
  { date: "2025-06-22", order: 8043, delivery: 1467 },
  { date: "2025-06-23", order: 4244, delivery: 4652 },
  { date: "2025-06-24", order: 1523, delivery: 425 },
  { date: "2025-06-25", order: 3588, delivery: 5324 },
  { date: "2025-06-26", order: 7932, delivery: 5236 },
  { date: "2025-06-27", order: 5902, delivery: 1789 },
  { date: "2025-06-28", order: 2141, delivery: 1355 },
  { date: "2025-06-30", order: 4244, delivery: 4652 },
  { date: "2025-07-01", order: 2141, delivery: 1355 },
  { date: "2025-07-02", order: 9974, delivery: 1467 },
  { date: "2025-07-03", order: 4244, delivery: 4652 },
  { date: "2025-07-04", order: 1523, delivery: 425 },
  { date: "2025-07-05", order: 6300, delivery: 5324 },
  { date: "2025-07-06", order: 7998, delivery: 2367 },
  { date: "2025-07-07", order: 2643, delivery: 3743 },
  { date: "2025-07-08", order: 7932, delivery: 5236 },
  { date: "2025-07-09", order: 5902, delivery: 1789 },
  { date: "2025-07-10", order: 2141, delivery: 1355 },
  { date: "2025-07-11", order: 4054, delivery: 1467 },
  { date: "2025-07-12", order: 4244, delivery: 4652 },
  { date: "2025-07-13", order: 1523, delivery: 425 },
  { date: "2025-07-14", order: 13456, delivery: 5324 },
  { date: "2025-07-15", order: 4633, delivery: 2367 },
  { date: "2025-07-16", order: 2643, delivery: 3743 },
  { date: "2025-07-17", order: 7932, delivery: 5236 },
  { date: "2025-07-18", order: 5902, delivery: 1789 },
  { date: "2025-07-19", order: 7932, delivery: 5236 },
  { date: "2025-07-20", order: 5902, delivery: 1789 },
  { date: "2025-07-21", order: 2141, delivery: 1355 },
  { date: "2025-07-22", order: 5245, delivery: 1467 },
  { date: "2025-07-23", order: 4244, delivery: 4652 },
  { date: "2025-07-24", order: 1523, delivery: 425 },
  { date: "2025-07-25", order: 2178, delivery: 5324 },
  { date: "2025-07-26", order: 7932, delivery: 5236 },
  { date: "2025-07-27", order: 5902, delivery: 1789 },
  { date: "2025-07-28", order: 2141, delivery: 1355 },
  { date: "2025-07-30", order: 4244, delivery: 4652 },
  { date: "2025-07-31", order: 1005, delivery: 424 },
  { date: "2025-08-01", order: 2141, delivery: 1355 },
  { date: "2025-08-02", order: 3535, delivery: 1467 },
  { date: "2025-08-03", order: 4244, delivery: 4652 },
  { date: "2025-08-04", order: 1523, delivery: 425 },
  { date: "2025-08-05", order: 1561, delivery: 5324 },
  { date: "2025-08-06", order: 3459, delivery: 2367 },
  { date: "2025-08-07", order: 2643, delivery: 3743 },
  { date: "2025-08-08", order: 7932, delivery: 5236 },
  { date: "2025-08-09", order: 5902, delivery: 1789 },
  { date: "2025-08-10", order: 2141, delivery: 1355 },
  { date: "2025-08-11", order: 14616, delivery: 1467 },
  { date: "2025-08-12", order: 4244, delivery: 4652 },
  { date: "2025-08-13", order: 1523, delivery: 425 },
  { date: "2025-08-14", order: 1346, delivery: 5324 },
  { date: "2025-08-15", order: 1389, delivery: 2367 },
  { date: "2025-08-16", order: 2643, delivery: 3743 },
  { date: "2025-08-17", order: 7932, delivery: 5236 },
  { date: "2025-08-18", order: 5902, delivery: 1789 },
  { date: "2025-08-19", order: 7932, delivery: 5236 },
  { date: "2025-08-20", order: 5902, delivery: 1789 },
  { date: "2025-08-21", order: 2141, delivery: 1355 },
  { date: "2025-08-22", order: 1466, delivery: 1467 },
  { date: "2025-08-23", order: 4244, delivery: 4652 },
  { date: "2025-08-24", order: 1523, delivery: 425 },
  { date: "2025-08-25", order: 13456, delivery: 5324 },
  { date: "2025-08-26", order: 7932, delivery: 5236 },
  { date: "2025-08-27", order: 5902, delivery: 1789 },
  { date: "2025-08-28", order: 2141, delivery: 1355 },
  { date: "2025-08-30", order: 4244, delivery: 4652 },
  { date: "2025-08-31", order: 1005, delivery: 424 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  order: {
    label: "Заказано",
    color: "var(--chart-2)",
  },
  delivery: {
    label: "Доставлено",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-08-31")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Заказано товаров</CardTitle>
          <CardDescription>
            Статистика по заказам и доставкам товаров
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Выберите значение"
          >
            <SelectValue placeholder="3 месяца" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 месяца
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 дней
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 дней
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[275px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDelivery" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-delivery)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-delivery)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOrder" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-order)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-order)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("ru", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ru", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="delivery"
              type="natural"
              fill="url(#fillDelivery)"
              stroke="var(--color-delivery)"
              stackId="a"
            />
            <Area
              dataKey="order"
              type="natural"
              fill="url(#fillOrder)"
              stroke="var(--color-order)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
