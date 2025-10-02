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

// Конфиг для легенды и цветов
const chartConfig = {
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
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  // Загружаем данные из API
  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        setChartData(data)
      } catch (err) {
        console.error("Ошибка загрузки данных:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Определяем последнюю дату из базы
  const maxDate = React.useMemo(() => {
    if (chartData.length === 0) return null
    return new Date(chartData[chartData.length - 1].date)
  }, [chartData])

  // Фильтрация по диапазону
  const filteredData = React.useMemo(() => {
    if (!maxDate) return []
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(maxDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [chartData, timeRange, maxDate])

  if (loading) {
    return (
      <Card className="pt-0">
        <CardContent className="flex justify-center items-center h-[275px]">
          <span className="text-muted-foreground">Загрузка данных...</span>
        </CardContent>
      </Card>
    )
  }

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
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("ru", {
                      month: "short",
                      day: "numeric",
                    })
                  }
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
