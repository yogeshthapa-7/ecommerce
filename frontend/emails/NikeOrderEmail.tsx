import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface NikeOrderItem {
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    image?: string;
    currency?: string;
}

interface NikeOrderEmailProps {
    customerName: string;
    orderId: string;
    orderDate?: string;
    paymentMethod?: string;
    subtotal?: number;
    tax?: number;
    shipping?: number;
    discount?: number;
    totalAmount: number;
    items: NikeOrderItem[];
}

const formatMoney = (amount = 0, currency = '$') => {
    const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
    return `${currency}${safeAmount.toFixed(2)}`;
};

export const NikeOrderEmail = ({
    customerName = 'Athlete',
    orderId = 'NX-12345',
    orderDate,
    paymentMethod = 'Card',
    subtotal,
    tax = 0,
    shipping = 0,
    discount = 0,
    totalAmount = 0,
    items = [],
}: NikeOrderEmailProps) => {
    const currency = items[0]?.currency || '$';
    const calculatedSubtotal = items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
    );
    const resolvedSubtotal = subtotal ?? calculatedSubtotal;
    const resolvedTotal =
        totalAmount || Math.max(resolvedSubtotal - discount + tax + shipping, 0);
    const resolvedOrderDate = orderDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Html>
            <Head />
            <Preview>Your Nike order is confirmed - {orderId}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={topBar}>
                        <Text style={logo}>NIKE</Text>
                        <Text style={topMeta}>Order Confirmed</Text>
                    </Section>

                    <Section style={hero}>
                        <Text style={eyebrow}>Thanks for your order</Text>
                        <Heading style={h1}>JUST DONE IT.</Heading>
                        <Text style={heroText}>
                            Congratulations, {customerName}. Your order is confirmed and
                            our team is getting it ready.
                        </Text>
                    </Section>

                    <Section style={messageCard}>
                        <Text style={messageTitle}>Hi {customerName},</Text>
                        <Text style={text}>
                            Thank you for shopping with Nike. We received your order and
                            will send another update when it moves to shipping.
                        </Text>
                    </Section>

                    <Section style={summaryGrid}>
                        <Section style={summaryCell}>
                            <Text style={orderLabel}>Order ID</Text>
                            <Text style={orderValue}>{orderId}</Text>
                        </Section>
                        <Section style={summaryCell}>
                            <Text style={orderLabel}>Order Date</Text>
                            <Text style={orderValue}>{resolvedOrderDate}</Text>
                        </Section>
                        <Section style={summaryCell}>
                            <Text style={orderLabel}>Payment</Text>
                            <Text style={orderValue}>{paymentMethod}</Text>
                        </Section>
                        <Section style={summaryCell}>
                            <Text style={orderLabel}>Status</Text>
                            <Text style={orderValue}>Processing</Text>
                        </Section>
                    </Section>

                    <Section style={productsCard}>
                        <Text style={sectionTitle}>Your Gear</Text>

                        {items.length > 0 ? (
                            items.map((item, index) => {
                                const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

                                return (
                                    <Section key={`${item.name}-${index}`} style={productRow}>
                                        {item.image ? (
                                            <Img
                                                src={item.image}
                                                alt={item.name}
                                                width="84"
                                                height="84"
                                                style={productImage}
                                            />
                                        ) : (
                                            <Section style={productImageFallback}>
                                                <Text style={productImageFallbackText}>NIKE</Text>
                                            </Section>
                                        )}
                                        <Section style={productInfo}>
                                            <Text style={productName}>{item.name}</Text>
                                            <Text style={productMeta}>
                                                Qty {item.quantity || 1}
                                                {item.size ? ` / Size ${item.size}` : ''}
                                                {item.color ? ` / ${item.color}` : ''}
                                            </Text>
                                            <Text style={productPrice}>
                                                {formatMoney(Number(item.price || 0), item.currency || currency)} each
                                            </Text>
                                        </Section>
                                        <Section style={productTotalWrap}>
                                            <Text style={productTotal}>
                                                {formatMoney(lineTotal, item.currency || currency)}
                                            </Text>
                                        </Section>
                                    </Section>
                                );
                            })
                        ) : (
                            <Text style={mutedText}>Your ordered products will appear here.</Text>
                        )}
                    </Section>

                    <Section style={totalsCard}>
                        <Text style={sectionTitle}>Receipt</Text>
                        <Section style={totalLine}>
                            <Text style={totalLabel}>Subtotal</Text>
                            <Text style={totalAmountText}>{formatMoney(resolvedSubtotal, currency)}</Text>
                        </Section>
                        <Section style={totalLine}>
                            <Text style={totalLabel}>Discount</Text>
                            <Text style={discountText}>
                                {discount > 0 ? `-${formatMoney(discount, currency)}` : formatMoney(0, currency)}
                            </Text>
                        </Section>
                        <Section style={totalLine}>
                            <Text style={totalLabel}>Tax</Text>
                            <Text style={totalAmountText}>{formatMoney(tax, currency)}</Text>
                        </Section>
                        <Section style={totalLine}>
                            <Text style={totalLabel}>Shipping</Text>
                            <Text style={shippingText}>
                                {shipping > 0 ? formatMoney(shipping, currency) : 'FREE'}
                            </Text>
                        </Section>
                        <Hr style={hr} />
                        <Section style={totalLine}>
                            <Text style={grandTotalLabel}>Total Paid</Text>
                            <Text style={grandTotal}>{formatMoney(resolvedTotal, currency)}</Text>
                        </Section>
                    </Section>

                    <Section style={regardsCard}>
                        <Text style={regardsTitle}>Keep moving.</Text>
                        <Text style={text}>
                            We appreciate you choosing Nike. Enjoy your new gear, and thank
                            you for being part of the Nike community.
                        </Text>
                        <Text style={signature}>Regards,</Text>
                        <Text style={signatureName}>Nike Team</Text>
                    </Section>

                    <Section style={ctaWrap}>
                        <Link href="https://nike.com" style={cta}>
                            Visit Nike
                        </Link>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            This confirmation was sent for order {orderId}.
                        </Text>
                        <Text style={footerText}>
                            (c) 2026 Nike, Inc. All Rights Reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default NikeOrderEmail;

const main = {
    backgroundColor: '#050505',
    color: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    margin: '0',
};

const container = {
    margin: '0 auto',
    padding: '24px 0 48px',
    width: '620px',
};

const topBar = {
    padding: '24px 0 18px',
    borderBottom: '1px solid #1f1f1f',
};

const logo = {
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '30px',
    fontWeight: '900',
    letterSpacing: '-0.06em',
    margin: '0',
};

const topMeta = {
    color: '#a1a1aa',
    float: 'right' as const,
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.16em',
    margin: '11px 0 0',
    textTransform: 'uppercase' as const,
};

const hero = {
    padding: '52px 0 30px',
    textAlign: 'center' as const,
};

const eyebrow = {
    color: '#ef4444',
    fontSize: '12px',
    fontWeight: '900',
    letterSpacing: '0.28em',
    margin: '0 0 16px',
    textTransform: 'uppercase' as const,
};

const h1 = {
    color: '#ffffff',
    fontSize: '52px',
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: '-0.06em',
    lineHeight: '54px',
    margin: '0',
    textAlign: 'center' as const,
};

const heroText = {
    color: '#d4d4d8',
    fontSize: '17px',
    lineHeight: '28px',
    margin: '24px auto 0',
    maxWidth: '480px',
};

const messageCard = {
    backgroundColor: '#111111',
    border: '1px solid #242424',
    borderRadius: '24px',
    margin: '18px 0',
    padding: '26px',
};

const messageTitle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '900',
    margin: '0 0 10px',
};

const text = {
    color: '#c7c7d1',
    fontSize: '15px',
    lineHeight: '25px',
    margin: '0',
};

const summaryGrid = {
    backgroundColor: '#0b0b0b',
    border: '1px solid #242424',
    borderRadius: '24px',
    margin: '18px 0',
    padding: '10px 16px',
};

const summaryCell = {
    borderBottom: '1px solid #202020',
    padding: '15px 0',
};

const orderLabel = {
    color: '#71717a',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '0.16em',
    margin: '0 0 5px',
    textTransform: 'uppercase' as const,
};

const orderValue = {
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: '900',
    margin: '0',
};

const productsCard = {
    backgroundColor: '#ffffff',
    borderRadius: '26px',
    margin: '22px 0',
    padding: '26px',
};

const sectionTitle = {
    color: '#111111',
    fontSize: '20px',
    fontWeight: '900',
    letterSpacing: '-0.03em',
    margin: '0 0 18px',
    textTransform: 'uppercase' as const,
};

const productRow = {
    borderTop: '1px solid #e5e7eb',
    minHeight: '96px',
    padding: '16px 0',
};

const productImage = {
    backgroundColor: '#f4f4f5',
    borderRadius: '18px',
    display: 'inline-block',
    objectFit: 'cover' as const,
    verticalAlign: 'top',
};

const productImageFallback = {
    backgroundColor: '#111111',
    borderRadius: '18px',
    display: 'inline-block',
    height: '84px',
    textAlign: 'center' as const,
    verticalAlign: 'top',
    width: '84px',
};

const productImageFallbackText = {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '900',
    margin: '33px 0 0',
};

const productInfo = {
    display: 'inline-block',
    padding: '2px 12px 0 16px',
    verticalAlign: 'top',
    width: '340px',
};

const productName = {
    color: '#111111',
    fontSize: '16px',
    fontWeight: '900',
    lineHeight: '22px',
    margin: '0 0 6px',
};

const productMeta = {
    color: '#71717a',
    fontSize: '13px',
    fontWeight: '700',
    lineHeight: '19px',
    margin: '0 0 8px',
};

const productPrice = {
    color: '#a1a1aa',
    fontSize: '12px',
    fontWeight: '800',
    margin: '0',
    textTransform: 'uppercase' as const,
};

const productTotalWrap = {
    display: 'inline-block',
    textAlign: 'right' as const,
    verticalAlign: 'top',
    width: '100px',
};

const productTotal = {
    color: '#111111',
    fontSize: '16px',
    fontWeight: '900',
    margin: '4px 0 0',
};

const mutedText = {
    color: '#71717a',
    fontSize: '14px',
    margin: '0',
};

const totalsCard = {
    backgroundColor: '#111111',
    border: '1px solid #242424',
    borderRadius: '26px',
    margin: '22px 0',
    padding: '26px',
};

const totalLine = {
    display: 'block',
    padding: '6px 0',
};

const totalLabel = {
    color: '#a1a1aa',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '800',
    margin: '0',
    width: '50%',
};

const totalAmountText = {
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '900',
    margin: '0',
    textAlign: 'right' as const,
    width: '50%',
};

const discountText = {
    ...totalAmountText,
    color: '#22c55e',
};

const shippingText = {
    ...totalAmountText,
    color: '#22c55e',
};

const grandTotalLabel = {
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '900',
    margin: '0',
    textTransform: 'uppercase' as const,
    width: '45%',
};

const grandTotal = {
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '34px',
    fontWeight: '900',
    letterSpacing: '-0.04em',
    margin: '0',
    textAlign: 'right' as const,
    width: '55%',
};

const hr = {
    borderColor: '#2b2b2b',
    margin: '16px 0',
};

const regardsCard = {
    border: '1px solid #242424',
    borderRadius: '24px',
    margin: '22px 0',
    padding: '26px',
};

const regardsTitle = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '-0.04em',
    margin: '0 0 12px',
    textTransform: 'uppercase' as const,
};

const signature = {
    color: '#a1a1aa',
    fontSize: '14px',
    fontWeight: '700',
    margin: '22px 0 4px',
};

const signatureName = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '900',
    margin: '0',
};

const ctaWrap = {
    margin: '32px 0 20px',
    textAlign: 'center' as const,
};

const cta = {
    backgroundColor: '#ffffff',
    borderRadius: '999px',
    color: '#000000',
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: '900',
    letterSpacing: '0.14em',
    padding: '15px 28px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
};

const footer = {
    borderTop: '1px solid #1f1f1f',
    marginTop: '36px',
    paddingTop: '22px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#71717a',
    fontSize: '12px',
    lineHeight: '20px',
    margin: '0 0 6px',
};
