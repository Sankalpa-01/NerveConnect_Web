import { NextResponse } from "next/server"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function POST(req: Request) {
  try {
    const { appointmentId, aiAnalysis } = await req.json()

    if (!appointmentId || !aiAnalysis) {
      return NextResponse.json(
        { error: "Missing appointmentId or aiAnalysis" },
        { status: 400 }
      )
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { aiAnalysis: aiAnalysis as any },
    })

    return NextResponse.json(
      { message: "AI analysis stored", appointment: updatedAppointment },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("[STORE_AI_ANALYSIS_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
