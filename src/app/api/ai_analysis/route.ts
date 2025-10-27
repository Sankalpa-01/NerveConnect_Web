import { getPrescription } from "@/app/libs/getAIAnalysis"
import { NextResponse } from "next/server"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function POST(req: Request) {
  try {
    const appointment = await req.json()

    const result = await getPrescription(appointment)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("AI Prescription Error:", error)
    return NextResponse.json({ error: "AI prescription failed" }, { status: 500 })
  }
}
