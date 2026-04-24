#!/usr/bin/env node
/**
 * Creates Stripe Products + Prices for all 11 GetBuiltFast tiers.
 *
 * Safety:
 *   - Refuses to run unless STRIPE_SECRET_KEY starts with "sk_test_".
 *   - Skips tiers that already have a Product with the matching name in test mode.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-create-products.mjs
 *
 * After running, you can configure Checkout to use these products, but the
 * API route in app/api/checkout/route.ts creates price_data inline per session,
 * so this script is optional — useful only if Zal wants a centralized product
 * catalog in the Stripe dashboard.
 */

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY not set");
  process.exit(1);
}
if (!key.startsWith("sk_test_")) {
  console.error("Refusing to run: STRIPE_SECRET_KEY must be a TEST key (sk_test_*)");
  console.error("Set test keys first. Live mode requires explicit Zal approval.");
  process.exit(1);
}

const stripe = new Stripe(key, {
  apiVersion: "2025-02-24.acacia",
});

// Keep this list in sync with app/data/pricing.ts
const TIERS = [
  { key: "landing_page",      name: "Landing Page",               euros: 499,  recurring: false },
  { key: "full_website",      name: "Full Website",               euros: 799,  recurring: false },
  { key: "ecommerce",         name: "E-Commerce Store",           euros: 1499, recurring: false },
  { key: "saas_dashboard",    name: "SaaS Dashboard",             euros: 999,  recurring: false },
  { key: "brand_website",     name: "Brand Website",              euros: 499,  recurring: false },
  { key: "booking_platform",  name: "Booking Platform",           euros: 699,  recurring: false },
  { key: "ai_app",            name: "AI-Powered App",             euros: 1499, recurring: false },
  { key: "animated_showcase", name: "Animated Showcase",          euros: 999,  recurring: false },
  { key: "ai_avatar_video",   name: "AI Avatar Video",            euros: 499,  recurring: false },
  { key: "mobile_app",        name: "Mobile App (iOS + Android)", euros: 1999, recurring: false },
  { key: "maintenance",       name: "Maintenance",                euros: 49,   recurring: true },
];

async function findExisting(name) {
  const found = await stripe.products.search({
    query: `name:'GetBuiltFast — ${name}' AND active:'true'`,
    limit: 1,
  });
  return found.data[0] ?? null;
}

for (const tier of TIERS) {
  const displayName = `GetBuiltFast — ${tier.name}`;
  const existing = await findExisting(tier.name);
  if (existing) {
    console.log(`= ${tier.key.padEnd(20)} skip  (exists: ${existing.id})`);
    continue;
  }

  const product = await stripe.products.create({
    name: displayName,
    description: `Starting from €${tier.euros.toLocaleString("en-US")}${tier.recurring ? "/mo" : ""}. Scope confirmed in kickoff call.`,
    metadata: { tier_key: tier.key },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: tier.euros * 100,
    currency: "eur",
    ...(tier.recurring
      ? { recurring: { interval: "month" } }
      : {}),
    nickname: tier.recurring ? "monthly" : "starting-from",
    metadata: { tier_key: tier.key },
  });

  console.log(`+ ${tier.key.padEnd(20)} product=${product.id} price=${price.id}`);
}

console.log("\nDone. Inspect: https://dashboard.stripe.com/test/products");
