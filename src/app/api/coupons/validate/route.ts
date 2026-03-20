import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
        validFrom: { lte: new Date() },
        OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
      },
    });

    if (!coupon) return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 404 });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
    }

    const sub = new Decimal(subtotal || 0);
    if (coupon.minOrderValue && sub.lt(new Decimal(coupon.minOrderValue.toString()))) {
      return NextResponse.json({ error: `Minimum order value of £${coupon.minOrderValue} required.` }, { status: 400 });
    }

    let discountAmount: Decimal;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = sub.mul(new Decimal(coupon.discountValue.toString()).div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    } else {
      discountAmount = Decimal.min(new Decimal(coupon.discountValue.toString()), sub);
    }

    return NextResponse.json({ valid: true, discountAmount: discountAmount.toNumber(), discountType: coupon.discountType, description: coupon.description });
  } catch {
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}
