import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — GetBuiltFast",
};

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-10"
          style={{ color: "var(--accent)" }}
        >
          ← Back to GetBuiltFast
        </Link>

        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>
          Last updated: 1 April 2026
        </p>

        <div className="space-y-10" style={{ color: "var(--text-muted)", lineHeight: "1.8" }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>1. Controller</h2>
            <p>
              <strong style={{ color: "var(--text)" }}>Cinder Vale Ventures BV</strong> (GetBuiltFast) is the data controller
              responsible for your personal data. Contact:{" "}
              <a href="mailto:hello@get-built-fast.com" style={{ color: "var(--accent)" }}>
                hello@get-built-fast.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>2. What Data We Collect</h2>
            <p>We collect the following personal data when you submit our contact form:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Company name and KvK number (for business clients)</li>
              <li>Project details and budget range</li>
              <li>Message content</li>
            </ul>
            <p className="mt-3">
              We may also collect technical data such as IP address, browser type, and pages visited
              via standard web analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>3. Legal Basis (GDPR)</h2>
            <p>We process your data on the following legal bases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong style={{ color: "var(--text)" }}>Legitimate interest</strong> — to respond to project inquiries</li>
              <li><strong style={{ color: "var(--text)" }}>Contractual necessity</strong> — to deliver services you have engaged</li>
              <li><strong style={{ color: "var(--text)" }}>Consent</strong> — for marketing communications (only if explicitly opted in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>4. How We Use Your Data</h2>
            <p>Your data is used solely to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Respond to your project inquiry</li>
              <li>Deliver contracted web development services</li>
              <li>Send project updates and invoices</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>5. Data Sharing</h2>
            <p>
              We do not sell or share your personal data with third parties for marketing purposes.
              We may share data with service providers (e.g., email services) strictly necessary to deliver our services.
              All processors are GDPR-compliant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>6. Data Retention</h2>
            <p>
              Project-related data is retained for 7 years for accounting and legal compliance purposes.
              Inquiry data from non-converting leads is deleted after 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>7. Your Rights (GDPR)</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Lodge a complaint with the Dutch Data Protection Authority (AP)</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email us at{" "}
              <a href="mailto:hello@get-built-fast.com" style={{ color: "var(--accent)" }}>
                hello@get-built-fast.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>8. Cookies</h2>
            <p>
              We use minimal technical cookies required for site functionality (e.g., theme preference stored in localStorage).
              We do not use tracking or advertising cookies without consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>9. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>10. Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated &ldquo;last updated&rdquo; date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
