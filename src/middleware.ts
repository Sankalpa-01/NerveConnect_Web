import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export const middleware = async (req: NextRequest) => {
  const publicRoutes = ["/", "/api/auth/signup", "/api/auth/signin"]
  const path = req.nextUrl.pathname

  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.get("auth_token")
  const token = cookie?.value

  if (!token) {
    console.log("No token")
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  const url = req.url
  if (url.includes("/signin") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )

    return NextResponse.next()
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL("/signin", req.url))
  }
}

export const config = {
  matcher: ["/dashboard", "/api/:path*"],
}
