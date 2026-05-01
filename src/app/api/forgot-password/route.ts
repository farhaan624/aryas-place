import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { resend, FROM_EMAIL, APP_URL, APP_NAME } from "@/lib/resend";
import { render } from "@react-email/render";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with that email, a reset link has been sent.",
      });
    }

    // Invalidate any existing tokens
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;

    try {
      const html = await render(
        PasswordResetEmail({ name: user.name, resetUrl })
      );
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Reset your ${APP_NAME} password`,
        html,
      });
    } catch {
      // Email failure should not expose user existence
    }

    return NextResponse.json({
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
