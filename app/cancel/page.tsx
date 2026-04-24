import Link from "next/link";
import { XCircle } from "lucide-react";
import { TIER } from "../data/pricing";

export const metadata = {
  title: "Checkout canceled — GetBuiltFast",
};

type Props = {
  searchParams: Promise<{ tier?: string }>;
};

export default async function CancelPage({ searchParams }: Props) {
  const { tier } = await searchParams;
  const tierData = tier ? TIER[tier] : null;

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(255,107,107,0.1)" }}
        >
          <XCircle size={40} style={{ color: "#ff6b6b" }} />
        </div>

        <h1 className="text-4xl font-black mb-3">Checkout canceled.</h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
          No charge was made. Want to talk first before committing?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/start" className="btn-primary inline-flex text-sm">
            Start a project brief instead
          </Link>
          {tierData && (
            <Link
              href={`/#pricing`}
              className="btn-outline inline-flex text-sm"
            >
              Back to {tierData.name}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
