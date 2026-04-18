"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import Hero from "@/app/components/Hero";
import HowItWorks from "@/app/components/HowItWorks";
import Products from "@/app/components/Products";
import Portfolio from "@/app/components/Portfolio";
import Pricing from "@/app/components/Pricing";
import ContactForm from "@/app/components/ContactForm";
import Footer from "@/app/components/Footer";

type Theme = "dark" | "light";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Init theme from localStorage
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <>
      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-black tracking-tight"
            style={{ color: "var(--accent)" }}
          >
            GetBuiltFast
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* CTA — desktop */}
            <a href="#contact" className="btn-primary hidden md:inline-flex text-sm py-2">
              Start a Project
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden px-6 pb-4 space-y-3"
            style={{ background: "var(--nav-bg)", backdropFilter: "blur(16px)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary block text-center text-sm py-2"
            >
              Start a Project
            </a>
          </div>
        )}
      </nav>

      {/* ── SECTIONS ──────────────────────────────────────────── */}
      <main>
        <Hero />
        <HowItWorks />
        <Products />
        <Portfolio />
        <Pricing />
        <ContactForm />
      </main>

      <Footer />
    </>
  );
}
