import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.GBF_STRIPE_SECRET_KEY_TEST;
  if (!key) return null;
  if (!cached) {
    cached = new Stripe(key, {
      // Pin API version so behavior doesn't drift on library upgrade
      apiVersion: "2025-02-24.acacia",
    });
  }
  return cached;
}

export function isTestMode(): boolean {
  const key = process.env.GBF_STRIPE_SECRET_KEY_TEST ?? "";
  return key.startsWith("sk_test_");
}
