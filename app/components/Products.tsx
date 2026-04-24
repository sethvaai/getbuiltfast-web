"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, ShoppingCart, BarChart3, Globe, Calendar, Bot } from "lucide-react";
import { TIER } from "../data/pricing";

const products = [
  {
    tierKey: "landing_page",
    icon: Zap,
    desc: "Convert visitors into customers with a stunning, fast landing page.",
  },
  {
    tierKey: "ecommerce",
    icon: ShoppingCart,
    desc: "Full Shopify or custom store with cart, checkout, and payments.",
  },
  {
    tierKey: "saas_dashboard",
    icon: BarChart3,
    desc: "Complex dashboards, analytics, user management — built right.",
  },
  {
    tierKey: "brand_website",
    icon: Globe,
    desc: "Multi-page brand presence with CMS integration.",
  },
  {
    tierKey: "booking_platform",
    icon: Calendar,
    desc: "Calendar, scheduling, payments. Done in 48 hours.",
  },
  {
    tierKey: "ai_app",
    icon: Bot,
    desc: "Custom AI integrations, chatbots, automation workflows.",
  },
];

export default function Products() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Services
          </p>
          <h2 className="section-title">What We Build</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => {
            const tier = TIER[p.tierKey];
            const Icon = p.icon;
            const priceDisplay = tier.priceLabel.replace(/^from /, "From ");
            return (
              <motion.div
                key={p.tierKey}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl p-6 transition-all duration-300 cursor-default"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,212,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0,212,255,0.1)" }}
                >
                  <Icon size={22} style={{ color: "var(--accent)" }} />
                </div>
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>
                  {priceDisplay}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
