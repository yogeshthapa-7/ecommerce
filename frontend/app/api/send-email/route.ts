import nodemailer from 'nodemailer';
import { NikeOrderEmail } from '@/emails/NikeOrderEmail';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';

export async function POST(request: Request) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.error('GMAIL credentials missing in environment variables');
        return NextResponse.json({ error: 'Gmail credentials missing' }, { status: 500 });
    }

    try {
        const { email, customerName, totalAmount, cartItems } = await request.json();
        console.log('Attempting to send email via Gmail to:', email);

        const emailHtml = await render(
            NikeOrderEmail({
                customerName,
                orderId: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
                totalAmount,
                items: cartItems,
            })
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Nike Store" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Order Confirmation - Nike Store',
            html: emailHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (err: any) {
        console.error('Nodemailer Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
