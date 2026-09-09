import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sales${queryString ? `?${queryString}` : ''}`

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Authorization: request.headers.get('authorization') || '',
      },
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch sales data' }, { status: 500 })
  }
}
