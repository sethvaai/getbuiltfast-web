"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Brief Us",
    desc: "Fill our quick form. Tell us your vision, brand, goals. We listen, we ask the right questions, we nail the brief.",
  },
  {
    num: "02",
    title: "We Build",
    desc: "Our AI + expert team gets to work. Daily updates. Zero friction. You watch it come to life.",
  },
  {
    num: "03",
    title: "Go Live",
    desc: "Review, approve, launch. Your site is live in 48 hours. No delays, no excuses, no BS.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 px-6" ref={ref} style={{ overflowX: "hidden" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            The Process
          </p>
          <h2 className="section-title">Simple. Fast. Done.</h2>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-12 left-0 right-0 h-px"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              className="h-full origin-left"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              style={{ background: "var(--accent)", transformOrigin: "left" }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
                className="relative text-center md:text-left"
              >
                {/* Step number dot */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 relative z-10"
                  style={{ background: "var(--accent)" }}
                >
                  <span className="text-black font-bold text-sm">{i + 1}</span>
                </div>

                <div
                  className="text-7xl font-black mb-4 select-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(0,212,255,0.2)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>

                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.7" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
