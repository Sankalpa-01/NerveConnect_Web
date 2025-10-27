import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function GET() {
  try {
    const cookieHeader = await cookies()
    const token = cookieHeader.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const userId = payload._id as string
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const count = await prisma.appointment.count({
      where: {
        patient: {
          userId: userId,
        },
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    return NextResponse.json({ count }, { status: 200 })
  } catch (error: any) {
    console.error("[TODAY_APPOINTMENT_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch today's appointment count" },
      { status: 500 }
    )
  }
}
