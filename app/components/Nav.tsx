"use client";

import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Read theme on mount and apply
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as "dark" | "light" | null;
      const resolved: "dark" | "light" = stored === "light" ? "light" : "dark";
      setTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute("data-theme", next);
  };

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        paddingInline: "1.5rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            GetBuiltFast
          </a>

          {/* Desktop nav */}
          <div
            className="desktop-nav"
            style={{
              display: "none",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")
                }
              >
                {link.label}
              </button>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                backgroundColor: "var(--hover-tint)",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={() => scrollTo("#contact")}
              style={{
                paddingBlock: "0.65rem",
                paddingInline: "1.5rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#000",
                backgroundColor: "var(--accent)",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
              }
            >
              Start a Project
            </button>
          </div>

          {/* Mobile controls */}
          <div
            className="mobile-controls"
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                backgroundColor: "var(--hover-tint)",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            backgroundColor: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
            paddingInline: "1.5rem",
            paddingBlock: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  textAlign: "left",
                  fontSize: "1rem",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  paddingBlock: "0.5rem",
                  fontFamily: "inherit",
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                paddingBlock: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#000",
                backgroundColor: "var(--accent)",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Start a Project
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-controls { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-controls { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
