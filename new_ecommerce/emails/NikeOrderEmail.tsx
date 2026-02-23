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

interface NikeOrderEmailProps {
    customerName: string;
    orderId: string;
    totalAmount: number;
    items: any[];
}

export const NikeOrderEmail = ({
    customerName = 'Athlete',
    orderId = 'NX-12345',
    totalAmount = 0,
    items = [],
}: NikeOrderEmailProps) => (
    <Html>
        <Head />
        <Preview>Your Nike Order Confirmation - {orderId}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={logo}>NIKE</Text>
                </Section>
                <Heading style={h1}>JUST DONE IT.</Heading>
                <Text style={text}>
                    Hi {customerName},
                </Text>
                <Text style={text}>
                    Your order has been received and is being processed. Thank you for choosing Nike.
                </Text>

                <Section style={orderInfo}>
                    <Text style={orderLabel}>Order ID</Text>
                    <Text style={orderValue}>{orderId}</Text>
                    <Hr style={hr} />
                    <Text style={orderLabel}>Total Amount Paid</Text>
                    <Text style={totalValue}>${totalAmount.toFixed(2)}</Text>
                </Section>

                <Section style={footer}>
                    <Text style={footerText}>
                        © 2026 Nike, Inc. All Rights Reserved.
                    </Text>
                    <Text style={footerLink}>
                        <Link href="https://nike.com" style={link}>View Website</Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default NikeOrderEmail;

const main = {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};

const header = {
    padding: '32px 0',
    textAlign: 'center' as const,
};

const logo = {
    fontSize: '32px',
    fontWeight: '900',
    letterSpacing: '-0.05em',
    margin: '0',
};

const h1 = {
    color: '#ff0000',
    fontSize: '48px',
    fontWeight: '900',
    textAlign: 'center' as const,
    margin: '40px 0',
    fontStyle: 'italic',
};

const text = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#d1d5db',
};

const orderInfo = {
    backgroundColor: '#111827',
    borderRadius: '16px',
    padding: '24px',
    margin: '32px 0',
    border: '1px solid #1f2937',
};

const orderLabel = {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: '#9ca3af',
    margin: '0 0 4px',
};

const orderValue = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 16px',
};

const totalValue = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0',
};

const hr = {
    borderColor: '#1f2937',
    margin: '16px 0',
};

const footer = {
    textAlign: 'center' as const,
    marginTop: '48px',
};

const footerText = {
    fontSize: '12px',
    color: '#6b7280',
};

const footerLink = {
    marginTop: '12px',
};

const link = {
    color: '#ffffff',
    fontWeight: '700',
    textDecoration: 'underline',
};
