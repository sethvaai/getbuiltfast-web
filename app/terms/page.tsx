import Link from "next/link";

export const metadata = {
  title: "Terms of Service — GetBuiltFast",
};

export default function TermsPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: "var(--accent)" }}
        >
          ← Back to GetBuiltFast
        </Link>

        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>
          Last updated: 1 April 2026
        </p>

        <div className="space-y-10" style={{ color: "var(--text-muted)", lineHeight: "1.8" }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>1. Parties</h2>
            <p>
              These Terms of Service govern all services provided by <strong style={{ color: "var(--text)" }}>Cinder Vale Ventures BV</strong>,
              operating under the brand name <strong style={{ color: "var(--text)" }}>GetBuiltFast</strong>, registered in the Netherlands
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), to any person or entity (&ldquo;Client&rdquo;, &ldquo;you&rdquo;) engaging our web development services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>2. Services</h2>
            <p>
              GetBuiltFast provides web design and development services including, but not limited to, landing pages,
              e-commerce stores, SaaS dashboards, brand websites, booking platforms, and AI-powered applications.
              Scope, deliverables, and pricing are agreed upon prior to project commencement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>3. Payment</h2>
            <p>
              All prices are quoted in Euros (€) and are exclusive of VAT unless stated otherwise.
              Full payment is due before project commencement unless a written payment schedule has been agreed.
              We reserve the right to suspend or withhold delivery until payment is received.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>4. Delivery</h2>
            <p>
              We aim to deliver projects within 48 hours of receiving all required materials from the Client
              (content, brand assets, credentials). Delivery times may vary for complex projects.
              Delays caused by the Client&rsquo;s failure to provide required materials will not constitute a breach by us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>5. Revisions</h2>
            <p>
              Each project tier includes a specified number of revision rounds. Revisions beyond the included
              rounds will be billed at an hourly rate as agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>6. Intellectual Property</h2>
            <p>
              Upon receipt of full payment, the Client receives full ownership of all deliverables.
              We retain the right to display the work in our portfolio unless the Client requests otherwise in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>7. Cancellations & Refunds</h2>
            <p>
              Cancellations requested before work has commenced will receive a full refund.
              Once work has commenced, no refunds will be issued. We are not liable for any indirect,
              incidental, or consequential damages arising from use of the delivered product.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>8. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential all proprietary information shared during the project.
              We will not share Client data with third parties except as required to deliver the services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>9. Limitation of Liability</h2>
            <p>
              Our total liability under these Terms shall not exceed the fees paid by the Client for the
              specific project giving rise to the claim. We are not liable for any loss of business,
              revenue, or data arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Netherlands. Any disputes shall be subject to
              the exclusive jurisdiction of the courts of Amsterdam, the Netherlands.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>11. Contact</h2>
            <p>
              For any questions regarding these Terms, contact us at{" "}
              <a href="mailto:hello@get-built-fast.com" style={{ color: "var(--accent)" }}>
                hello@get-built-fast.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
