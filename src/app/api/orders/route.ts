import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const data = await prisma.orderStats.findMany({
      orderBy: { date: "asc" },
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Ошибка получения данных" }, { status: 500 })
  }
}
