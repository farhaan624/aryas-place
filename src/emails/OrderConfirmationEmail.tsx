import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
}

interface OrderConfirmationEmailProps {
  name: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    country: string;
  };
}

export function OrderConfirmationEmail({
  name,
  orderNumber,
  items,
  totalAmount,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Arya's Place pre-order #{orderNumber} is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Arya's Place</Heading>
          <Section style={section}>
            <Heading as="h2" style={subheading}>Order Confirmed</Heading>
            <Text style={text}>
              Dear {name}, your pre-order has been received and confirmed.
            </Text>
            <Text style={orderRef}>Order Reference: {orderNumber}</Text>

            <Section style={itemsSection}>
              {items.map((item, idx) => (
                <Row key={idx} style={itemRow}>
                  <Column>
                    <Text style={itemName}>
                      {item.productName}
                      {item.variantLabel ? ` — ${item.variantLabel}` : ""}
                    </Text>
                    <Text style={itemQty}>Qty: {item.quantity}</Text>
                  </Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text style={itemPrice}>
                      ${(item.unitPrice * item.quantity).toLocaleString()}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Total</Text></Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={totalAmount_}>${totalAmount.toLocaleString()}</Text>
              </Column>
            </Row>

            <Section style={addressSection}>
              <Text style={addressTitle}>Shipping To</Text>
              <Text style={addressText}>
                {shippingAddress.fullName}
                <br />
                {shippingAddress.line1}
                <br />
                {shippingAddress.city}, {shippingAddress.country}
              </Text>
            </Section>

            <Text style={text}>
              We will notify you when your order status changes. Thank you for
              choosing Arya's Place.
            </Text>
          </Section>
          <Text style={footer}>
            © {new Date().getFullYear()} Arya's Place. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#F5F0E8", fontFamily: "Georgia, serif" };
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "600px" };
const heading = { fontSize: "32px", letterSpacing: "0.1em", textAlign: "center" as const, color: "#1A1A1A", marginBottom: "40px" };
const subheading = { fontSize: "22px", color: "#1A1A1A", marginBottom: "16px" };
const section = { backgroundColor: "#ffffff", padding: "40px", borderRadius: "4px" };
const text = { fontSize: "16px", lineHeight: "1.6", color: "#444444", marginBottom: "16px" };
const orderRef = { fontSize: "14px", color: "#C9A84C", letterSpacing: "0.05em", marginBottom: "24px" };
const itemsSection = { borderTop: "1px solid #eee", marginTop: "24px", paddingTop: "24px" };
const itemRow = { marginBottom: "12px" };
const itemName = { fontSize: "15px", color: "#1A1A1A", margin: "0 0 4px 0" };
const itemQty = { fontSize: "13px", color: "#888", margin: "0" };
const itemPrice = { fontSize: "15px", color: "#1A1A1A", margin: "0" };
const totalRow = { borderTop: "1px solid #eee", marginTop: "16px", paddingTop: "16px" };
const totalLabel = { fontSize: "16px", fontWeight: "bold", color: "#1A1A1A", margin: "0" };
const totalAmount_ = { fontSize: "16px", fontWeight: "bold", color: "#1A1A1A", margin: "0" };
const addressSection = { marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #eee" };
const addressTitle = { fontSize: "13px", letterSpacing: "0.1em", color: "#888", margin: "0 0 8px 0" };
const addressText = { fontSize: "15px", color: "#444", lineHeight: "1.6", margin: "0" };
const footer = { textAlign: "center" as const, fontSize: "12px", color: "#999", marginTop: "32px" };
