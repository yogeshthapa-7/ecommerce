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
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>{`
                    @media only screen and (max-width: 640px) {
                        .email-container {
                            width: 100% !important;
                            padding-left: 16px !important;
                            padding-right: 16px !important;
                        }
                        .email-stack {
                            display: block !important;
                            width: 100% !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                        }
                        .email-stack-image {
                            display: block !important;
                            margin: 0 auto 12px auto !important;
                            text-align: center !important;
                        }
                        .email-stack-total {
                            display: block !important;
                            width: 100% !important;
                            text-align: left !important;
                            padding-top: 8px !important;
                        }
                        .email-mobile-text {
                            font-size: 28px !important;
                            line-height: 32px !important;
                        }
                        .email-mobile-h1 {
                            font-size: 32px !important;
                            line-height: 36px !important;
                        }
                    }
                `}</style>
            </Head>
            <Preview>Your Nike order is confirmed - {orderId}</Preview>
            <Body style={main}>
                <Container className="email-container" style={container}>
                    <Section style={topBar}>
                        <Text style={logo}>NIKE</Text>
                        <Text style={topMeta}>Order Confirmed</Text>
                    </Section>

                    <Section style={hero}>
                        <Text style={eyebrow}>Thanks for your order</Text>
                        <Heading className="email-mobile-h1" style={h1}>JUST DONE IT.</Heading>
                        <Text className="email-mobile-text" style={heroText}>
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
                        <Text style={{ ...mutedText, marginBottom: '16px' }}>
                            {items.length} item{items.length === 1 ? '' : 's'} in this order
                        </Text>

                        {items.length > 0 ? (
                            items.map((item, index) => {
                                const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

                                return (
                                    <Section key={`${item.name}-${index}`} style={productRow}>
                                        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ borderCollapse: 'collapse' }}>
                                            <tr>
                                                <td width="84" valign="top" style={{ paddingRight: '16px', textAlign: 'left' }}>
                                                    {item.image ? (
                                                        <Img
                                                            src={item.image}
                                                            alt={item.name}
                                                            width="84"
                                                            height="84"
                                                            style={{ display: 'block', width: '84px', height: '84px', objectFit: 'contain', borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}
                                                        />
                                                    ) : (
                                                        <div style={{ display: 'inline-block', width: '84px', height: '84px', lineHeight: '84px', textAlign: 'center', borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#a1a1aa', fontSize: '20px', fontWeight: '900', letterSpacing: '0.08em' }}>NIKE</div>
                                                    )}
                                                </td>
                                                <td valign="top" style={{ textAlign: 'left', paddingRight: '16px' }}>
                                                    <Text style={productName}>{item.name}</Text>
                                                    <Text style={productMeta}>
                                                        Qty {item.quantity || 1}
                                                        {item.size ? ` / Size ${item.size}` : ''}
                                                        {item.color ? ` / ${item.color}` : ''}
                                                    </Text>
                                                    <Text style={productPrice}>
                                                        {formatMoney(Number(item.price || 0), item.currency || currency)} each
                                                    </Text>
                                                </td>
                                                <td valign="top" style={{ textAlign: 'right' }}>
                                                    <Text style={productTotal}>
                                                        {formatMoney(lineTotal, item.currency || currency)}
                                                    </Text>
                                                </td>
                                            </tr>
                                        </table>
                                    </Section>
                                );
                            })
                        ) : (
                            <Text style={mutedText}>Your ordered products will appear here.</Text>
                        )}
                    </Section>

                    <Section style={totalsCard}>
                        <Text style={sectionTitle}>Receipt</Text>
                        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ borderCollapse: 'collapse' }}>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#a1a1aa', fontSize: '14px', fontWeight: '800', lineHeight: '20px', whiteSpace: 'nowrap' }}>
                                    Subtotal
                                </td>
                                <td style={{ padding: '6px 0', color: '#ffffff', fontSize: '14px', fontWeight: '900', lineHeight: '20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {formatMoney(resolvedSubtotal, currency)}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#a1a1aa', fontSize: '14px', fontWeight: '800', lineHeight: '20px', whiteSpace: 'nowrap' }}>
                                    Discount
                                </td>
                                <td style={{ padding: '6px 0', color: '#22c55e', fontSize: '14px', fontWeight: '900', lineHeight: '20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {discount > 0 ? `-${formatMoney(discount, currency)}` : formatMoney(0, currency)}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#a1a1aa', fontSize: '14px', fontWeight: '800', lineHeight: '20px', whiteSpace: 'nowrap' }}>
                                    Tax
                                </td>
                                <td style={{ padding: '6px 0', color: '#ffffff', fontSize: '14px', fontWeight: '900', lineHeight: '20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {formatMoney(tax, currency)}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px 0', color: '#a1a1aa', fontSize: '14px', fontWeight: '800', lineHeight: '20px', whiteSpace: 'nowrap' }}>
                                    Shipping
                                </td>
                                <td style={{ padding: '6px 0', color: '#22c55e', fontSize: '14px', fontWeight: '900', lineHeight: '20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {shipping > 0 ? formatMoney(shipping, currency) : 'FREE'}
                                </td>
                            </tr>
                        </table>
                        <Hr style={hr} />
                        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ borderCollapse: 'collapse' }}>
                            <tr>
                                <td style={{ padding: '0', color: '#ffffff', fontSize: '16px', fontWeight: '900', lineHeight: '20px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                    Total Paid
                                </td>
                                <td style={{ padding: '0', color: '#ffffff', fontSize: '34px', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {formatMoney(resolvedTotal, currency)}
                                </td>
                            </tr>
                        </table>
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
    padding: '0',
};

const container = {
    margin: '0 auto',
    padding: '24px 0 48px',
    maxWidth: '620px',
    width: '100%',
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
    lineHeight: '1',
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
    maxWidth: '100%',
    height: 'auto',
    objectFit: 'cover' as const,
    verticalAlign: 'top',
};

const productImageWrap = {
    display: 'inline-block',
    textAlign: 'center' as const,
    verticalAlign: 'top',
    width: '84px',
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
    lineHeight: '1',
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
    lineHeight: '1.2',
    margin: '0 0 12px',
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
