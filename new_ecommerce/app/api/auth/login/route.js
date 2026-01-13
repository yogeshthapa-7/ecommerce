import { NextResponse } from "next/server";
import { users } from "../fakeUserStore";

export async function POST(req) {
  const { email, password } = await req.json();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    token: "fake-jwt-token",
    user: {
      email: user.email,
      firstName: user.firstName,
    },
  });
}
