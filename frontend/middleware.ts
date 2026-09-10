import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || null
  const user = request.cookies.get("user")?.value || null

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute) {
    if (!token || !user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const userData = JSON.parse(user)
      if (userData.role !== "admin") {
        return NextResponse.redirect(new URL("/nike/products", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
