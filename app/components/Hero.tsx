"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const words = ["Your", "Website.", "Live", "in", "48", "Hours."];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState({ h: "48", m: "00", s: "00" });
  const startRef = useRef<number>(Date.now());

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.6)";
        ctx.fill();

        for (const q of particles) {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,212,255,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Countdown timer (48h from page load)
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const total = 48 * 60 * 60 * 1000;
      const remaining = total - (elapsed % total);
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setCountdown({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.5 }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(0,212,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
          style={{
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "var(--accent)",
          }}
        >
          ✦ 6 sites delivered · 48hr guarantee
        </motion.div>

        {/* Headline */}
        <h1
          className="section-title mb-6"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="inline-block mr-3"
              style={word === "48" || word === "Hours." ? { color: "var(--accent)" } : {}}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-xl mb-10 max-w-2xl mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          AI-powered web agency delivering stunning, production-ready websites from{" "}
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>€299</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <a href="#contact" className="btn-primary text-lg">
            Start Your Project →
          </a>
          <a href="#portfolio" className="btn-outline text-lg">
            See Our Work
          </a>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="inline-flex flex-col items-center gap-2"
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Next delivery slot closes in
          </p>
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-3xl font-bold"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--accent)",
            }}
          >
            <span>{countdown.h}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "1.5rem" }}>:</span>
            <span>{countdown.m}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "1.5rem" }}>:</span>
            <span>{countdown.s}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
