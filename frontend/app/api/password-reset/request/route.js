import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 });
        }

        const res = await fetch(`${apiUrl}/password-reset/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json({
            success: false,
            message: "Unable to connect to server. Please make sure the backend server is running on port 5000."
        }, { status: 500 });
    }
}