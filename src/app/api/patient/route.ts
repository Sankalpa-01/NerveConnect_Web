import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function POST(req: Request) {
  try {
    // Get token from cookies
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
    const { name, age, phone, email, address, diseases = [] } = body

    const patient = await prisma.patient.create({
      data: {
        name,
        age,
        phone,
        email,
        address,
        userId,
        diseases: {
          create: diseases.map((d: any) => ({
            name: d.name,
          })),
        },
      },
    })

    return NextResponse.json(
      { message: "Patient added", patient },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[PATIENT_CREATE_ERROR]", error)
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

    const patients = await prisma.patient.findMany({
      where: {
        userId,
      },
      include: {
        diseases: true,
        appointments: true,
      },
    })

    console.log("[GET_PATIENTS]", patients)

    return NextResponse.json(patients, { status: 200 })
  } catch (error: any) {
    console.error("[GET_PATIENTS_ERROR]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
