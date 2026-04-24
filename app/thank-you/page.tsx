import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Thanks — GetBuiltFast",
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>;
}) {
  const { leadId } = await searchParams;

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(0,212,255,0.1)" }}
        >
          <CheckCircle size={40} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-4xl font-black mb-3">Brief received.</h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
          We&apos;ll be back within 2 hours with next steps.
        </p>

        <div
          className="rounded-xl p-6 text-left mb-8"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
            What happens next
          </p>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li><strong style={{ color: "var(--text)" }}>1.</strong> You get a confirmation email in the next few minutes.</li>
            <li><strong style={{ color: "var(--text)" }}>2.</strong> We review your brief, lock a final quote, and send you a 15-min kickoff slot.</li>
            <li><strong style={{ color: "var(--text)" }}>3.</strong> You approve the scope and we start building.</li>
          </ol>
        </div>

        {leadId && (
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            Reference: <code style={{ color: "var(--accent)" }}>{leadId}</code>
          </p>
        )}

        <Link href="/" className="btn-outline inline-flex text-sm">
          ← Back to GetBuiltFast
        </Link>
      </div>
    </main>
  );
}
