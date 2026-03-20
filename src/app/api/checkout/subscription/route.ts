import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const schema = z.object({
  plan: z.enum(["pro", "business"]),
});

const PLANS = {
  pro: {
    name: "Omni Cartix Pro",
    amount: 999, // £9.99 in pence
    interval: "month" as const,
  },
  business: {
    name: "Omni Cartix Business",
    amount: 2999, // £29.99 in pence
    interval: "month" as const,
  },
};

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be signed in to subscribe." }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = schema.parse(body);
    const planConfig = PLANS[plan];

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: planConfig.name },
            unit_amount: planConfig.amount,
            recurring: { interval: planConfig.interval },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: { userId: session.user.id, plan },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { userId: session.user.id, plan, type: "subscription" },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Subscription checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
