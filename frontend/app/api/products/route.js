import { NextResponse } from "next/server"

export async function GET() {
  try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?includeOutOfStock=true&limit=100`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : data.products || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
