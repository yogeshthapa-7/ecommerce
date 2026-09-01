import nodemailer from 'nodemailer';
import { NikeOrderEmail } from '@/emails/NikeOrderEmail';
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

async function fetchImageAsDataUri(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'image/png';
        const base64 = buffer.toString('base64');
        return `data:${contentType};base64,${base64}`;
    } catch (error) {
        console.error('Failed to convert image to data URI:', error);
        return '';
    }
}

const resolveEmailImage = async (image: string | undefined, baseUrl: string) => {
    if (!image) return '';

    const normalizedImage = getProductCutoutImage(image);

    if (!normalizedImage) return '';

    if (/^(https?:|cid:|data:)/i.test(normalizedImage)) return normalizedImage;

    if (normalizedImage.startsWith('/')) {
        try {
            const cleanPath = normalizedImage.split('?')[0];
            const fullPath = path.join(process.cwd(), 'public', cleanPath);
            const buffer = await fs.promises.readFile(fullPath);
            
            let contentType = 'image/png';
            if (cleanPath.endsWith('.jpg') || cleanPath.endsWith('.jpeg')) contentType = 'image/jpeg';
            else if (cleanPath.endsWith('.webp')) contentType = 'image/webp';
            else if (cleanPath.endsWith('.svg')) contentType = 'image/svg+xml';
            else if (cleanPath.endsWith('.gif')) contentType = 'image/gif';

            const base64 = buffer.toString('base64');
            return `data:${contentType};base64,${base64}`;
        } catch (error) {
            console.error('Failed to read local image for email:', error);
        }
    }

    if (baseUrl) {
        try {
            const resolved = new URL(normalizedImage, baseUrl).toString();
            if (resolved.includes('localhost') || resolved.includes('127.0.0.1')) {
                return await fetchImageAsDataUri(resolved);
            }
            return resolved;
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
        } = await request.json();
        console.log('Attempting to send email via Gmail to:', email);

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
            resolvedItems.map(async (item, index) => {
                const resolvedImage = await resolveEmailImage(item.image, publicBaseUrl);
                return {
                    ...item,
                    image: resolvedImage,
                };
            })
        );

        console.log('Email items prepared:', emailItems.map(i => ({ name: i.name, hasImage: !!i.image })));

        const emailHtml = await render(
            NikeOrderEmail({
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
            })
        );

        console.log('Rendered email HTML length:', emailHtml.length, 'chars for', emailItems.length, 'items');
        const productRowCount = (emailHtml.match(/borderTop/g) || []).length;
        console.log('Product rows in HTML:', productRowCount);

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
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown email error';
        console.error('Nodemailer Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
