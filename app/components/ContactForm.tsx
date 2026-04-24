"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CheckCircle, User, Building2 } from "lucide-react";

type ClientType = "individual" | "business";

const projectTypes = [
  "Landing Page",
  "E-Commerce Store",
  "SaaS Dashboard",
  "Brand Website",
  "Booking Platform",
  "AI-Powered App",
  "Other",
];

const budgets = ["€299–€499", "€500–€999", "€1,000–€1,999", "€2,000+"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  color: "var(--text)",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  color: "var(--text-muted)",
};

export default function ContactForm() {
  const [clientType, setClientType] = useState<ClientType>("individual");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    kvk: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const set = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientType, ...formData }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please email us at hello@get-built-fast.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Let&apos;s Go
          </p>
          <h2 className="section-title">Start Your Project</h2>
          <p className="mt-4" style={{ color: "var(--text-muted)" }}>
            Fill this in. We&apos;ll be back within 2 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl p-8"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(0,212,255,0.1)" }}
                >
                  <CheckCircle size={40} style={{ color: "var(--accent)" }} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">You&apos;re in!</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  We&apos;ll be in touch within 2 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Client type toggle */}
                <div>
                  <label style={labelStyle}>Client Type</label>
                  <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                    {(["individual", "business"] as ClientType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setClientType(t)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all"
                        style={{
                          background: clientType === t ? "var(--accent)" : "transparent",
                          color: clientType === t ? "#000" : "var(--text-muted)",
                        }}
                      >
                        {t === "individual" ? <User size={15} /> : <Building2 size={15} />}
                        {t === "individual" ? "Individual" : "Business"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@email.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                {/* B2B fields */}
                <AnimatePresence>
                  {clientType === "business" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <label style={labelStyle}>Company Name</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => set("company", e.target.value)}
                          placeholder="Acme B.V."
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>KvK / Chamber of Commerce Number</label>
                        <input
                          type="text"
                          value={formData.kvk}
                          onChange={(e) => set("kvk", e.target.value)}
                          placeholder="12345678"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Project type */}
                <div>
                  <label style={labelStyle}>Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => set("projectType", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label style={labelStyle}>Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => set("budget", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  >
                    <option value="">Select budget range</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Tell us about your project *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    placeholder="Describe your vision, goals, and anything else we should know..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: "#ff6b6b" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-base"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Sending..." : "Send My Brief →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
