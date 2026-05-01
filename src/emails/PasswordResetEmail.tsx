import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Arya's Place password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Arya's Place</Heading>
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Password Reset Request
            </Heading>
            <Text style={text}>Hello {name},</Text>
            <Text style={text}>
              We received a request to reset the password for your Arya's Place
              account. Click the button below to set a new password.
            </Text>
            <Link href={resetUrl} style={button}>
              Reset Password
            </Link>
            <Text style={warning}>
              This link will expire in 1 hour. If you did not request a password
              reset, please ignore this email — your account remains secure.
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
const button = { display: "inline-block", backgroundColor: "#1A1A1A", color: "#F5F0E8", padding: "14px 32px", borderRadius: "2px", textDecoration: "none", fontSize: "14px", letterSpacing: "0.1em", marginTop: "8px" };
const warning = { fontSize: "13px", color: "#888888", marginTop: "24px", lineHeight: "1.5" };
const footer = { textAlign: "center" as const, fontSize: "12px", color: "#999999", marginTop: "32px" };
