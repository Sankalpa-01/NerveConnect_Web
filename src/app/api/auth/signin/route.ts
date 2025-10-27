import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { createPrismaClient } from "@/lib/prisma";

const prisma = createPrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username }, // Check if the input matches an email
          { username: username }, // Check if the input matches a username
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ _id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    console.log(token);

    return NextResponse.json(
      {
        message: "Login successful",
        user: { id: user.id, username: user.username },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[SIGNIN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
