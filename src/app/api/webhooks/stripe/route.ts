import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { generateLicenseKey } from "@/lib/license";
import { addHours } from "date-fns";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;
    default:
      break;
  }

  return new NextResponse("OK", { status: 200 });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  // Idempotency check
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.status === "PAID") return;

  // Mark order as PAID
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID", stripePaymentId: session.payment_intent as string, paymentMethod: "stripe" },
  });

  // Fulfill digital products
  for (const item of order.items) {
    if (item.productType === "DIGITAL" || item.productType === "SAAS") {
      // Create download links
      for (let q = 0; q < item.quantity; q++) {
        await prisma.downloadLink.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            userId: order.userId,
            expiresAt: addHours(new Date(), item.product.downloadExpiry),
            maxDownloads: item.product.downloadLimit,
          },
        });
      }

      // Generate license keys for SAAS products
      if (item.productType === "SAAS" && item.product.licenseType) {
        for (let q = 0; q < item.quantity; q++) {
          await prisma.licenseKey.create({
            data: {
              key: generateLicenseKey(),
              productId: item.productId,
              orderId: order.id,
              userId: order.userId,
            },
          });
        }
      }
    }
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // Stripe v20 moved period fields — access via any for forward compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;
  const periodStart: number = sub.current_period_start ?? sub.billing_cycle_anchor ?? 0;
  const periodEnd: number = sub.current_period_end ?? sub.trial_end ?? 0;
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status === "active" ? "ACTIVE" : subscription.status === "canceled" ? "CANCELLED" : subscription.status === "past_due" ? "PAST_DUE" : "TRIALING",
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
    create: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0]?.price.id || "",
      status: "ACTIVE",
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      userId: subscription.metadata?.userId || "",
    },
  });
}
