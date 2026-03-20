import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { toStripePence } from "@/lib/vat";
import { generateOrderNumber } from "@/lib/utils";
import Decimal from "decimal.js";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  billingAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    county: z.string().optional(),
    postcode: z.string(),
    country: z.string().default("GB"),
  }),
  couponCode: z.string().optional(),
  digitalWaiver: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, customerEmail, customerName, billingAddress, couponCode } = checkoutSchema.parse(body);

    // Fetch products from DB to prevent price tampering
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
      include: { category: true },
    });

    if (products.length !== items.length) {
      return NextResponse.json({ error: "One or more products not found or unavailable." }, { status: 400 });
    }

    // Calculate totals
    let subtotal = new Decimal(0);
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const price = new Decimal(product.price.toString());
      const vatRate = new Decimal(product.vatRate.toString());
      const vatAmount = price.mul(vatRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
      const priceIncVAT = price.add(vatAmount);
      subtotal = subtotal.add(price.mul(item.quantity));
      return {
        price_data: {
          currency: "gbp",
          product_data: { name: product.name, metadata: { productId: product.id } },
          unit_amount: toStripePence(priceIncVAT),
          tax_behavior: "inclusive" as const,
        },
        quantity: item.quantity,
      };
    });

    // Validate coupon
    let coupon = null;
    const discountAmount = new Decimal(0);
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: { code: couponCode, active: true, validFrom: { lte: new Date() }, OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }] },
      });
    }

    const vatAmount = subtotal.mul(new Decimal("0.20")).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    const total = subtotal.add(vatAmount).sub(discountAmount);

    // Create pending order
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id,
        guestEmail: session ? undefined : customerEmail,
        status: "PENDING",
        subtotal,
        vatAmount,
        total,
        currency: "GBP",
        couponId: coupon?.id,
        billingName: customerName,
        billingLine1: billingAddress.line1,
        billingLine2: billingAddress.line2,
        billingCity: billingAddress.city,
        billingPostcode: billingAddress.postcode,
        billingCountry: billingAddress.country,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            const unitPrice = new Decimal(product.price.toString());
            const vatRate = new Decimal(product.vatRate.toString());
            const itemVat = unitPrice.mul(vatRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice,
              vatRate: vatRate,
              vatAmount: itemVat.mul(item.quantity),
              total: unitPrice.add(itemVat).mul(item.quantity),
              productName: product.name,
              productType: product.type,
            };
          }),
        },
      },
    });

    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: { orderId: order.id, orderNumber },
      billing_address_collection: "auto",
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
