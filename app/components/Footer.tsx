import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <a href="#" style={{ color: "var(--accent)", fontWeight: 900, fontSize: "1.1rem" }}>GetBuiltFast</a>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>Built fast. Built beautiful.</p>
        </div>
        <div className="flex gap-6">
          <Link href="/terms" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Privacy Policy</Link>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "right" }}>
          <a href="mailto:hello@get-built-fast.com" style={{ color: "var(--text-muted)" }}>✉ hello@get-built-fast.com</a>
          <p style={{ marginTop: "4px" }}>GetBuiltFast © 2026</p>
        </div>
      </div>
    </footer>
  );
}
