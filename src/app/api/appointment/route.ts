import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function POST(req: Request) {
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

    const body = await req.json()
    const {
      date,
      diagnosis,
      symptoms,
      temperature,
      bloodPressure,
      heartRate,
      oxygenSaturation,
      instructions,
      followUpInDays,
      patientId,
    } = body

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        diagnosis,
        symptoms,
        temperature,
        bloodPressure,
        heartRate,
        oxygenSaturation,
        instructions,
        followUpInDays,
        patientId,
      },
    })

    return NextResponse.json(
      { message: "Appointment created", appointment },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[APPOINTMENT_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

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

    const appointment = await prisma.appointment.findMany({
      where: {
        patient: {
          userId: userId,
        },
      },
      include: {
        patient: {
          select: {
            name: true,
            age: true,
            phone: true,
            email: true,
            address: true,
          },
        },
      },
    })

    return NextResponse.json(appointment, { status: 200 })
  } catch (error: any) {
    console.error("[GET_APPOINTMENTS_ERROR]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
