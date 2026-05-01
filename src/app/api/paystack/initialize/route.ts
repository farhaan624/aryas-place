import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const reference = `maison_${order.id}_${Date.now()}`;
  const amountInKobo = Math.round(Number(order.totalAmount) * 100);
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?reference=${reference}&orderId=${orderId}`;

  const result = await initializeTransaction({
    email: session.user.email!,
    amount: amountInKobo,
    reference,
    callback_url: callbackUrl,
    metadata: { orderId },
  });

  if (!result.status) {
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { stripePaymentIntentId: reference },
  });

  return NextResponse.json({
    authorization_url: result.data.authorization_url,
    reference: result.data.reference,
  });
}
