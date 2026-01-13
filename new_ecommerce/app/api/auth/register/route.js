import { NextResponse } from "next/server";
import { users } from "../fakeUserStore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, dateOfBirth, gender } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    users.push({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
    });

    return NextResponse.json({
      success: true,
      message: "Registered successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
