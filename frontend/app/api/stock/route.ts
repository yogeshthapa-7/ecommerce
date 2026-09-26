import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams, pathname } = new URL(request.url);
    const queryString = searchParams.toString();
    const path = pathname.replace('/api/stock', '') || '';
    const url = `${process.env.NEXT_PUBLIC_API_URL}/stock${path}${queryString ? `?${queryString}` : ''}`;

    const authHeader = request.headers.get('authorization') || 
                       request.headers.get('Authorization') || '';

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch stock data' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const path = pathname.replace('/api/stock', '') || '';
    const url = `${process.env.NEXT_PUBLIC_API_URL}/stock${path}`;

    const authHeader = request.headers.get('authorization') || 
                       request.headers.get('Authorization') || '';

    const body = await request.json();

    const res = await fetch(url, {
      method: 'PATCH',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to adjust stock' }, { status: 500 });
  }
}
