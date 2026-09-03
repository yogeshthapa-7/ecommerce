import { NextResponse } from 'next/server';
import twilio from 'twilio';

export const runtime = 'nodejs';

type OrderSmsItem = {
  name: string;
  price: number;
  quantity: number;
  currency?: string;
};

export async function POST(request: Request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: 'Twilio credentials are missing. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.' },
        { status: 500 },
      );
    }

    const twilioClient = twilio(accountSid, authToken);
    const {
      phone,
      customerName,
      totalAmount,
      orderId,
      items,
    } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const resolvedItems: OrderSmsItem[] = Array.isArray(items) ? items : [];
    const productName = resolvedItems[0]?.name || 'your order';
    const currency = resolvedItems[0]?.currency || '$';
    const formattedTotal = `${currency}${Number(totalAmount || 0).toFixed(2)}`;
    const firstName = typeof customerName === 'string' && customerName.trim()
      ? customerName.trim().split(/\s+/)[0]
      : 'there';

    const messageBody =
      `Hi ${firstName}! ` +
      `Your payment of ${formattedTotal} for "${productName}" was successful. ` +
      `Order #${orderId}. Thank you for shopping with us!`;

    const message = await twilioClient.messages.create({
      body: messageBody,
      from: fromNumber,
      to: phone,
    });

    console.log('SMS sent successfully, SID:', message.sid);
    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown SMS error';
    console.error('Twilio SMS error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
