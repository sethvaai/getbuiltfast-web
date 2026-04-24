"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, ShoppingCart, BarChart3, Globe, Calendar, Bot } from "lucide-react";

const products = [
  {
    icon: Zap,
    name: "Landing Page",
    price: "From €499",
    desc: "Convert visitors into customers with a stunning, fast landing page.",
  },
  {
    icon: ShoppingCart,
    name: "E-Commerce Store",
    price: "From €799",
    desc: "Full Shopify or custom store with cart, checkout, and payments.",
  },
  {
    icon: BarChart3,
    name: "SaaS Dashboard",
    price: "From €999",
    desc: "Complex dashboards, analytics, user management — built right.",
  },
  {
    icon: Globe,
    name: "Brand Website",
    price: "From €499",
    desc: "Multi-page brand presence with CMS integration.",
  },
  {
    icon: Calendar,
    name: "Booking Platform",
    price: "From €699",
    desc: "Calendar, scheduling, payments. Done in 48 hours.",
  },
  {
    icon: Bot,
    name: "AI-Powered App",
    price: "From €1,499",
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
            const Icon = p.icon;
            return (
              <motion.div
                key={p.name}
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
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>
                  {p.price}
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
