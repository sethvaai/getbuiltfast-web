import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { getStripe } from "../lib/stripe";

export const metadata = {
  title: "Payment confirmed — GetBuiltFast",
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let summary: { productName: string; amountEuros: number; email: string } | null = null;
  const stripe = getStripe();
  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      const line = session.line_items?.data[0];
      summary = {
        productName: line?.description ?? "GetBuiltFast project",
        amountEuros: (session.amount_total ?? 0) / 100,
        email: session.customer_email ?? session.customer_details?.email ?? "—",
      };
    } catch (e) {
      console.error("Could not retrieve session:", e);
    }
  }

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(0,212,255,0.1)" }}
        >
          <CheckCircle size={40} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-4xl font-black mb-3">Payment received.</h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
          We&apos;re in. You&apos;ll get a kickoff-call link by email within 2 hours.
        </p>

        {summary && (
          <div
            className="rounded-xl p-6 mb-8 text-left"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Product</span>
              <span className="text-sm font-medium text-right">{summary.productName}</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Amount</span>
              <span className="text-sm font-medium">€{summary.amountEuros.toLocaleString("en-US")}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Receipt</span>
              <span className="text-sm font-medium">{summary.email}</span>
            </div>
          </div>
        )}

        {session_id && (
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            Session: <code style={{ color: "var(--accent)" }}>{session_id}</code>
          </p>
        )}

        <Link href="/" className="btn-outline inline-flex text-sm">← Back to home</Link>
      </div>
    </main>
  );
}
