import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const result = await verifyTransaction(reference);

  if (!result.status || result.data?.status !== "success") {
    return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
  }

  const orderId = result.data.metadata?.orderId;

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });
  }

  return NextResponse.json({ success: true, orderId });
}
