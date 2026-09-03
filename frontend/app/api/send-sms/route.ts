import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Debug: log all environment variable names that start with TWILIO
const twilioEnvKeys = Object.keys(process.env).filter(key => key.startsWith('TWILIO'));
console.log('DEBUG - All TWILIO env keys:', twilioEnvKeys);
console.log('DEBUG - TWILIO_ACCOUNT_SID value:', process.env.TWILIO_ACCOUNT_SID);
console.log('DEBUG - TWILIO_AUTH_TOKEN value:', process.env.TWILIO_AUTH_TOKEN);

const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_API_KEY_SID;
const authToken = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN;

console.log('DEBUG - accountSid resolved:', accountSid ? `Found (starts with ${accountSid.substring(0, 5)})` : 'NOT FOUND');
console.log('DEBUG - authToken resolved:', authToken ? 'Found' : 'NOT FOUND');

if (!accountSid || !authToken || !process.env.TWILIO_PHONE_NUMBER) {
  console.error('Twilio credentials missing - see debug logs above');
  throw new Error('Twilio credentials incomplete - see logs');
}

const twilioClient = twilio(
  accountSid!,
  authToken!
);

type OrderSmsItem = {
  name: string;
  price: number;
  quantity: number;
  currency?: string;
};

export async function POST(request: Request) {
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
  const formattedTotal = `${currency}${Number(totalAmount).toFixed(2)}`;

  const messageBody =
    `Hi ${customerName.split(' ')[0] || 'there'}! ` +
    `Your payment of ${formattedTotal} for "${productName}" was successful. ` +
    `Order #${orderId}. Thank you for shopping with us!`;

  try {
    const message = await twilioClient.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
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
