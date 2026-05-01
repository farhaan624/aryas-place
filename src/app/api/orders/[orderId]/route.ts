import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validations";
import { resend, FROM_EMAIL, APP_NAME } from "@/lib/resend";
import { render } from "@react-email/render";
import { OrderStatusUpdateEmail } from "@/emails/OrderStatusUpdateEmail";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await params;
    const isAdmin = session.user.role === "ADMIN";

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true, variant: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Customers can only view their own orders
    if (!isAdmin && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId } = await params;
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: parsed.data,
      include: {
        user: true,
        items: { include: { product: true, variant: true } },
      },
    });

    // Send status update email
    if (parsed.data.status) {
      try {
        const html = await render(
          OrderStatusUpdateEmail({
            name: order.user.name,
            orderNumber: order.orderNumber,
            newStatus: parsed.data.status,
          })
        );
        await resend.emails.send({
          from: FROM_EMAIL,
          to: order.user.email,
          subject: `${APP_NAME} — Order ${order.orderNumber} Update`,
          html,
        });
      } catch {
        // Email failure should not fail the update
      }
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
