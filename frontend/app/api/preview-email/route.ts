import { NextResponse } from 'next/server';
import { NikeOrderEmail } from '@/emails/NikeOrderEmail';
import { NikeShippedEmail } from '@/emails/NikeShippedEmail';
import { NikeDeliveredEmail } from '@/emails/NikeDeliveredEmail';
import { NikeCancelledEmail } from '@/emails/NikeCancelledEmail';
import { render } from '@react-email/render';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerName = 'Test User',
            orderId = 'NX-TEST123',
            orderDate,
            paymentMethod = 'Card',
            subtotal = 150,
            tax = 15,
            shipping = 0,
            discount = 10,
            totalAmount = 155,
            items = [
                { name: 'Nike Air Max', price: 150, quantity: 1, size: 'US 10', color: 'Black/White', currency: '$' }
            ],
            status = 'Processing',
            trackingNumber = 'TRK123456789',
            carrier = 'DHL',
            estimatedDelivery,
            cancelReason,
            refundAmount,
            refundMethod,
        } = body;

        const baseEmailProps = {
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
            subject = `Your order has shipped - ${orderId}`;
        } else if (normalizedStatus === 'delivered') {
            emailComponent = NikeDeliveredEmail({
                ...baseEmailProps,
                deliveryDate: orderDate || estimatedDelivery,
            });
            subject = `Your order has been delivered - ${orderId}`;
        } else if (normalizedStatus === 'cancelled' || normalizedStatus === 'canceled') {
            emailComponent = NikeCancelledEmail({
                ...baseEmailProps,
                cancelReason,
                refundAmount,
                refundMethod,
            });
            subject = `Your order has been cancelled - ${orderId}`;
        } else {
            emailComponent = NikeOrderEmail(baseEmailProps);
            subject = `Order Confirmation - ${orderId}`;
        }

        const emailHtml = await render(emailComponent);

        return NextResponse.json({ success: true, html: emailHtml, subject, status: normalizedStatus });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Preview Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
