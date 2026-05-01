import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

interface OrderStatusUpdateEmailProps {
  name: string;
  orderNumber: string;
  newStatus: string;
  message?: string;
}

export function OrderStatusUpdateEmail({
  name,
  orderNumber,
  newStatus,
  message,
}: OrderStatusUpdateEmailProps) {
  const statusLabel = STATUS_LABELS[newStatus] ?? newStatus;

  return (
    <Html>
      <Head />
      <Preview>Your Arya's Place order #{orderNumber} is now {statusLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Arya's Place</Heading>
          <Section style={section}>
            <Heading as="h2" style={subheading}>Order Update</Heading>
            <Text style={text}>Dear {name},</Text>
            <Text style={text}>
              Your order <span style={orderRef}>{orderNumber}</span> has been
              updated to:
            </Text>
            <Text style={statusBadge}>{statusLabel}</Text>
            {message && <Text style={text}>{message}</Text>}
            <Text style={text}>
              Thank you for your patience and for choosing Arya's Place.
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
const orderRef = { color: "#C9A84C", letterSpacing: "0.05em" };
const statusBadge = { display: "inline-block", backgroundColor: "#1A1A1A", color: "#F5F0E8", padding: "8px 20px", borderRadius: "2px", fontSize: "14px", letterSpacing: "0.1em", margin: "8px 0 16px 0" };
const footer = { textAlign: "center" as const, fontSize: "12px", color: "#999", marginTop: "32px" };
