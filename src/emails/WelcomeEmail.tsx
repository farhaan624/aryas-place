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

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Arya's Place — Your world of luxury awaits</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Arya's Place</Heading>
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Welcome, {name}
            </Heading>
            <Text style={text}>
              Thank you for joining Arya's Place. You now have exclusive access to
              pre-order the world&apos;s most coveted luxury items before they&apos;re
              available to the public.
            </Text>
            <Text style={text}>
              Browse our curated collections, save your favourites to your wishlist,
              and secure your pre-orders today.
            </Text>
            <Link href={loginUrl} style={button}>
              Explore the Collection
            </Link>
          </Section>
          <Text style={footer}>
            © {new Date().getFullYear()} Arya's Place. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#F5F0E8",
  fontFamily: "Georgia, serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const heading = {
  fontSize: "32px",
  letterSpacing: "0.1em",
  textAlign: "center" as const,
  color: "#1A1A1A",
  marginBottom: "40px",
};

const subheading = {
  fontSize: "22px",
  color: "#1A1A1A",
  marginBottom: "16px",
};

const section = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "4px",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#444444",
  marginBottom: "16px",
};

const button = {
  display: "inline-block",
  backgroundColor: "#1A1A1A",
  color: "#F5F0E8",
  padding: "14px 32px",
  borderRadius: "2px",
  textDecoration: "none",
  fontSize: "14px",
  letterSpacing: "0.1em",
  marginTop: "8px",
};

const footer = {
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#999999",
  marginTop: "32px",
};
