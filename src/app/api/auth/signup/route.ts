import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, username, email, password } = body

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    })

    const token = await new SignJWT({ _id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    })

    console.log(token)

    return NextResponse.json(
      {
        message: "Signup successful",
        user: { id: user.id, username: user.username },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
