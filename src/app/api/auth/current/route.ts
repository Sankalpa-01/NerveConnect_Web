import { NextRequest, NextResponse } from "next/server"
import { jwtVerify, JWTPayload } from "jose"
import { cookies } from "next/headers"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const id = (payload as JWTPayload & { _id: string })._id

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error: any) {
    console.error("[CURRENT_USER_ERROR]", error)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    )
  }
}
