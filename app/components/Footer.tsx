import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="py-12 px-6 mt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <div className="text-xl font-black mb-1" style={{ color: "var(--accent)" }}>
              GetBuiltFast
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Built fast. Built beautiful.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:hello@get-built-fast.com"
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Mail size={14} />
              hello@get-built-fast.com
            </a>
          </div>
        </div>

        <div
          className="mt-8 pt-6 text-center text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          GetBuiltFast © 2026
        </div>
      </div>
    </footer>
  );
}
