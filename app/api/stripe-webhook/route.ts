import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await persistOrder(session);
  }

  return NextResponse.json({ received: true });
}

async function persistOrder(session: Stripe.Checkout.Session) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("Supabase not configured — skipping order persistence");
    return;
  }

  const row = {
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    email: session.customer_email ?? session.customer_details?.email ?? "unknown@unknown",
    product_name: session.metadata?.tier
      ? `GetBuiltFast — ${session.metadata.tier}`
      : "GetBuiltFast — unknown",
    amount_cents: session.amount_total ?? 0,
    status: "paid",
    client_type: session.metadata?.client_type ?? null,
    lead_id: session.metadata?.lead_id || null,
    paid_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/orders`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Supabase order upsert failed: ${res.status} ${text}`);
    }
  } catch (e) {
    console.error("Supabase order upsert threw:", e);
  }
}
