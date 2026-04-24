"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const pricingData = [
  { product: "Landing Page", price: "from €299", key: "landing_page" },
  { product: "Full Website", price: "from €799", key: "full_website" },
  { product: "E-Commerce Store", price: "from €1,499", key: "ecommerce", highlight: true },
  { product: "Mobile App (iOS + Android)", price: "from €1,999", key: "mobile_app" },
  { product: "Animated Showcase", price: "from €999", key: "animated_showcase" },
  { product: "AI Avatar Video", price: "from €499", key: "ai_avatar_video" },
  { product: "Maintenance", price: "from €49/mo", key: "maintenance" },
];

function PricingRow({ row, index }: { row: (typeof pricingData)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.tr
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: hovered ? "rgba(0,212,255,0.04)" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <td
        style={{
          padding: "1rem 0",
          fontSize: "1rem",
          fontWeight: row.highlight ? 700 : 500,
          color: row.highlight ? "#fff" : "rgba(255,255,255,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {row.product}
        {row.highlight && (
          <span
            style={{
              marginLeft: "0.6rem",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#000",
              backgroundColor: "var(--accent)",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              textTransform: "uppercase",
              verticalAlign: "middle",
            }}
          >
            Popular
          </span>
        )}
      </td>
      <td
        style={{
          padding: "1rem 0.75rem",
          fontSize: "1.3rem",
          fontWeight: 800,
          color: "var(--accent)",
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {row.price}
      </td>
      <td style={{ padding: "1rem 0", textAlign: "right" }}>
        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier: row.key }),
              });
              const data = (await res.json()) as { url?: string; error?: string };
              if (data.url) {
                window.location.href = data.url;
              } else {
                // Checkout not configured yet — fall back to brief wizard
                console.warn("Checkout unavailable:", data.error);
                window.location.href = "/start";
              }
            } catch (e) {
              console.error("Checkout request failed:", e);
              window.location.href = "/start";
            }
          }}
          style={{
            padding: "8px 16px",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#000",
            backgroundColor: "var(--accent)",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.82")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          Get Started
        </button>
      </td>
    </motion.tr>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        backgroundColor: "#0f0f0f",
        padding: "8rem 2rem",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
              lineHeight: 1.1,
            }}
          >
            Transparent Pricing.{" "}
            <span style={{ color: "var(--accent)" }}>No Surprises.</span>
          </h2>

          {/* CTA button — replaces old subtitle text */}
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              backgroundColor: "#00E5FF",
              color: "#000",
              fontWeight: 700,
              padding: "12px 28px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontFamily: "inherit",
              letterSpacing: "0.02em",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Get an instant price estimate →
          </button>
        </motion.div>

        {/* Table */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "340px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 0",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Product
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem 0.75rem",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem 0",
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row, i) => (
                <PricingRow key={row.key} row={row} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.3)",
            lineHeight: 1.6,
          }}
        >
          Base prices shown. Features, integrations, and add-ons affect final price.{" "}
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: 600,
              padding: 0,
            }}
          >
            Use our wizard for your exact estimate →
          </button>
        </motion.p>
      </div>
    </section>
  );
}
