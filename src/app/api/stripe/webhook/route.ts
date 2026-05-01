import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL, APP_NAME } from "@/lib/resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
      include: {
        user: true,
        items: { include: { product: true, variant: true } },
      },
    });

    // Send confirmation email
    try {
      const html = await render(
        OrderConfirmationEmail({
          name: order.user.name,
          orderNumber: order.orderNumber,
          items: order.items.map((item) => ({
            productName: item.product.name,
            variantLabel: item.variant
              ? `${item.variant.type}: ${item.variant.value}`
              : undefined,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          })),
          totalAmount: Number(order.totalAmount),
          shippingAddress: order.shippingAddress as {
            fullName: string;
            line1: string;
            city: string;
            country: string;
          },
        })
      );
      await resend.emails.send({
        from: FROM_EMAIL,
        to: order.user.email,
        subject: `${APP_NAME} — Order ${order.orderNumber} Confirmed`,
        html,
      });
    } catch {
      // Don't fail the webhook on email errors
    }
  }

  return NextResponse.json({ received: true });
}
