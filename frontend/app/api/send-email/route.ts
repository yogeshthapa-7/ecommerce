import nodemailer from 'nodemailer';
import { NikeOrderEmail } from '@/emails/NikeOrderEmail';
import { NikeShippedEmail } from '@/emails/NikeShippedEmail';
import { NikeDeliveredEmail } from '@/emails/NikeDeliveredEmail';
import { NikeCancelledEmail } from '@/emails/NikeCancelledEmail';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { getProductCutoutImage } from '@/app/nike/products/[id]/productImageCutouts';
import fs from 'fs';
import path from 'path';

type OrderEmailItem = {
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    image?: string;
    currency?: string;
};

const getPublicBaseUrl = (request: Request) => {
    const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.split('||')[0]?.trim();
    const requestOrigin = request.headers.get('origin');
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    return configuredUrl || requestOrigin || (host ? `${protocol}://${host}` : '');
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const resolveEmailImage = async (image: string | undefined, baseUrl: string) => {
    if (!image) return '';

    const normalizedImage = getProductCutoutImage(image);

    if (!normalizedImage) return '';

    if (/^(https?:|cid:)/i.test(normalizedImage)) return normalizedImage;

    if (/^data:/i.test(normalizedImage)) {
        const base64Data = normalizedImage.split(',')[1];
        if (base64Data && base64Data.length > 10000) {
            return '';
        }
        return normalizedImage;
    }

    if (baseUrl) {
        try {
            return new URL(normalizedImage, baseUrl).toString();
        } catch {
            return normalizedImage;
        }
    }

    return normalizedImage;
};

export async function POST(request: Request) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.error('GMAIL credentials missing in environment variables');
        return NextResponse.json({ error: 'Gmail credentials missing' }, { status: 500 });
    }

    try {
        const {
            email,
            customerName,
            orderId,
            orderDate,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            discount,
            totalAmount,
            items,
            cartItems,
            status = 'Processing',
            trackingNumber,
            carrier,
            estimatedDelivery,
            cancelReason,
            refundAmount,
            refundMethod,
        } = await request.json();
        console.log(`Attempting to send email via Gmail to: ${email} for status: ${status}`);

        const resolvedItems: OrderEmailItem[] = Array.isArray(items)
            ? items
            : Array.isArray(cartItems)
              ? cartItems
              : [];

        if (resolvedItems.length === 0) {
            console.error('No order items provided for email');
            return NextResponse.json({ error: 'No order items provided' }, { status: 400 });
        }

        console.log(`Sending email for ${resolvedItems.length} order items`);
        const publicBaseUrl = getPublicBaseUrl(request);
        const emailItems = await Promise.all(
            resolvedItems.map(async (item) => {
                const resolvedImage = await resolveEmailImage(item.image, publicBaseUrl);
                return {
                    ...item,
                    image: resolvedImage,
                };
            })
        );

        console.log('Email items prepared:', emailItems.map(i => ({ name: i.name, hasImage: !!i.image })));

        const baseEmailProps = {
            customerName,
            orderId: orderId || `NX-${Math.floor(100000 + Math.random() * 900000)}`,
            orderDate,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            discount,
            totalAmount,
            items: emailItems,
        };

        const normalizedStatus = String(status || 'Processing').toLowerCase();
        let emailComponent;
        let subject: string;

        if (normalizedStatus === 'shipped') {
            emailComponent = NikeShippedEmail({
                ...baseEmailProps,
                trackingNumber,
                carrier,
                estimatedDelivery,
            });
            subject = `Your order has shipped - ${baseEmailProps.orderId}`;
        } else if (normalizedStatus === 'delivered') {
            emailComponent = NikeDeliveredEmail({
                ...baseEmailProps,
                deliveryDate: orderDate || estimatedDelivery,
            });
            subject = `Your order has been delivered - ${baseEmailProps.orderId}`;
        } else if (normalizedStatus === 'cancelled' || normalizedStatus === 'canceled') {
            emailComponent = NikeCancelledEmail({
                ...baseEmailProps,
                cancelReason,
                refundAmount,
                refundMethod,
            });
            subject = `Your order has been cancelled - ${baseEmailProps.orderId}`;
        } else {
            emailComponent = NikeOrderEmail(baseEmailProps);
            subject = `Order Confirmation - ${baseEmailProps.orderId}`;
        }

        const emailHtml = await render(emailComponent);

        console.log(`Rendered ${normalizedStatus} email HTML length:`, emailHtml.length, 'chars for', emailItems.length, 'items');

        const mailOptions = {
            from: `"Nike Store" <${process.env.GMAIL_USER}>`,
            to: email,
            subject,
            html: emailHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId, status: normalizedStatus });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown email error';
        console.error('Nodemailer Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
