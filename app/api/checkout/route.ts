import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../lib/stripe";
import { TIER } from "../../data/pricing";

type CheckoutPayload = {
  tier: string;
  email?: string;
  leadId?: string;
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured (STRIPE_SECRET_KEY missing)" },
      { status: 503 },
    );
  }

  const body = (await req.json()) as CheckoutPayload;
  const tier = TIER[body.tier];
  if (!tier) {
    return NextResponse.json({ error: `Unknown tier: ${body.tier}` }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_ORIGIN ??
    "https://www.get-built-fast.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: tier.recurring === "monthly" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: tier.priceFromEuros * 100,
            product_data: {
              name: `GetBuiltFast — ${tier.name}`,
              description: `Starting at ${tier.priceLabel}. Scope confirmed in kickoff call.`,
            },
            ...(tier.recurring === "monthly"
              ? { recurring: { interval: "month" as const } }
              : {}),
          },
          quantity: 1,
        },
      ],
      customer_email: body.email,
      metadata: {
        tier: tier.key,
        lead_id: body.leadId ?? "",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel?tier=${encodeURIComponent(tier.key)}`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error("Stripe checkout session failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe error" },
      { status: 500 },
    );
  }
}
