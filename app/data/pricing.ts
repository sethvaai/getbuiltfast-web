export type PricingTier = {
  key: string;
  name: string;
  priceLabel: string;
  priceFromEuros: number;
  recurring?: "monthly";
  highlight?: boolean;
};

export const PRICING: PricingTier[] = [
  { key: "landing_page",      name: "Landing Page",               priceLabel: "from €299",    priceFromEuros: 299 },
  { key: "full_website",      name: "Full Website",               priceLabel: "from €799",    priceFromEuros: 799 },
  { key: "ecommerce",         name: "E-Commerce Store",           priceLabel: "from €1,499",  priceFromEuros: 1499, highlight: true },
  { key: "saas_dashboard",    name: "SaaS Dashboard",             priceLabel: "from €999",    priceFromEuros: 999 },
  { key: "brand_website",     name: "Brand Website",              priceLabel: "from €499",    priceFromEuros: 499 },
  { key: "booking_platform",  name: "Booking Platform",           priceLabel: "from €699",    priceFromEuros: 699 },
  { key: "ai_app",            name: "AI-Powered App",             priceLabel: "from €1,499",  priceFromEuros: 1499 },
  { key: "animated_showcase", name: "Animated Showcase",          priceLabel: "from €999",    priceFromEuros: 999 },
  { key: "ai_avatar_video",   name: "AI Avatar Video",            priceLabel: "from €499",    priceFromEuros: 499 },
  { key: "mobile_app",        name: "Mobile App (iOS + Android)", priceLabel: "from €1,999",  priceFromEuros: 1999 },
  { key: "maintenance",       name: "Maintenance",                priceLabel: "from €49/mo",  priceFromEuros: 49, recurring: "monthly" },
];

export const TIER: Record<string, PricingTier> = Object.fromEntries(
  PRICING.map((t) => [t.key, t]),
);
