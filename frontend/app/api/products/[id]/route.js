import { NextResponse } from "next/server"

export async function GET(_request, { params }) {
  try {
    const { id } = await params

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Product not found" },
        { status: res.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch product" },
      { status: 500 },
    )
  }
}
