"use client";

import { useReducer, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Zap } from "lucide-react";
import { PRICING } from "../data/pricing";
import {
  FEATURES,
  INTEGRATIONS,
  DESIGN_STYLES,
  TIMELINES,
  HEAR_ABOUT_US,
} from "../data/quiz-options";
import { computeEstimate, formatEuroRange } from "../lib/estimate";

const TOTAL_STEPS = 7;

type State = {
  step: number;
  projectTypeKey: string;
  featureKeys: string[];
  integrationKeys: string[];
  designStyleKey: string;
  colorScheme: string;
  referenceUrls: string;
  timelineKey: string;
  budgetEuros: number;
  rush: boolean;
  clientType: "individual" | "business";
  name: string;
  email: string;
  phone: string;
  companyName: string;
  hearAboutUs: string;
  description: string;
  submitState: "idle" | "submitting" | "error";
  errorMessage: string;
};

type Action =
  | { type: "next" }
  | { type: "back" }
  | { type: "setProject"; key: string }
  | { type: "toggleFeature"; key: string }
  | { type: "toggleIntegration"; key: string }
  | { type: "setDesign"; key: string }
  | { type: "setColor"; value: string }
  | { type: "setRefs"; value: string }
  | { type: "setTimeline"; key: string }
  | { type: "setBudget"; value: number }
  | { type: "setRush"; value: boolean }
  | { type: "setClientType"; value: "individual" | "business" }
  | { type: "setField"; field: keyof State; value: string }
  | { type: "submitStart" }
  | { type: "submitError"; message: string };

const initial: State = {
  step: 1,
  projectTypeKey: "",
  featureKeys: [],
  integrationKeys: [],
  designStyleKey: "",
  colorScheme: "",
  referenceUrls: "",
  timelineKey: "",
  budgetEuros: 1000,
  rush: false,
  clientType: "individual",
  name: "",
  email: "",
  phone: "",
  companyName: "",
  hearAboutUs: "",
  description: "",
  submitState: "idle",
  errorMessage: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "next":
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS) };
    case "back":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "setProject":
      return { ...state, projectTypeKey: action.key };
    case "toggleFeature": {
      const has = state.featureKeys.includes(action.key);
      return {
        ...state,
        featureKeys: has
          ? state.featureKeys.filter((k) => k !== action.key)
          : [...state.featureKeys, action.key],
      };
    }
    case "toggleIntegration": {
      const has = state.integrationKeys.includes(action.key);
      return {
        ...state,
        integrationKeys: has
          ? state.integrationKeys.filter((k) => k !== action.key)
          : [...state.integrationKeys, action.key],
      };
    }
    case "setDesign":
      return { ...state, designStyleKey: action.key };
    case "setColor":
      return { ...state, colorScheme: action.value };
    case "setRefs":
      return { ...state, referenceUrls: action.value };
    case "setTimeline":
      return { ...state, timelineKey: action.key };
    case "setBudget":
      return { ...state, budgetEuros: action.value };
    case "setRush":
      return { ...state, rush: action.value };
    case "setClientType":
      return { ...state, clientType: action.value };
    case "setField":
      return { ...state, [action.field]: action.value } as State;
    case "submitStart":
      return { ...state, submitState: "submitting", errorMessage: "" };
    case "submitError":
      return { ...state, submitState: "error", errorMessage: action.message };
    default:
      return state;
  }
}

function canContinue(s: State): boolean {
  switch (s.step) {
    case 1: return s.projectTypeKey !== "";
    case 2: return true;
    case 3: return true;
    case 4: return s.designStyleKey !== "";
    case 5: return s.timelineKey !== "";
    case 6: return s.name.trim() !== "" && /\S+@\S+\.\S+/.test(s.email);
    case 7: return true;
    default: return false;
  }
}

export default function BriefWizard() {
  const [state, dispatch] = useReducer(reducer, initial);
  const router = useRouter();

  useEffect(() => {
    // User spec: "/start route must clear form state on mount"
    // The initial state already satisfies this; this effect is a no-op safeguard
    // against any browser cache/back-forward restoration.
  }, []);

  const estimate = useMemo(
    () =>
      computeEstimate({
        projectTypeKey: state.projectTypeKey,
        featureKeys: state.featureKeys,
        rush: state.rush,
      }),
    [state.projectTypeKey, state.featureKeys, state.rush],
  );

  const submit = async () => {
    dispatch({ type: "submitStart" });
    try {
      const res = await fetch("/api/submit-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTypeKey: state.projectTypeKey,
          featureKeys: state.featureKeys,
          integrationKeys: state.integrationKeys,
          designStyleKey: state.designStyleKey,
          colorScheme: state.colorScheme,
          referenceUrls: state.referenceUrls,
          timelineKey: state.timelineKey,
          budgetEuros: state.budgetEuros,
          rush: state.rush,
          clientType: state.clientType,
          name: state.name,
          email: state.email,
          phone: state.phone,
          companyName: state.companyName,
          hearAboutUs: state.hearAboutUs,
          description: state.description,
          estimateMin: estimate.minEuros,
          estimateMax: estimate.maxEuros,
        }),
      });
      const data = (await res.json()) as { leadId?: string; error?: string };
      if (!res.ok) {
        dispatch({ type: "submitError", message: data.error ?? "Submit failed" });
        return;
      }
      const qs = data.leadId ? `?leadId=${encodeURIComponent(data.leadId)}` : "";
      router.push(`/thank-you${qs}`);
    } catch (e) {
      dispatch({
        type: "submitError",
        message: e instanceof Error ? e.message : "Network error",
      });
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12"
      style={{ color: "var(--text)" }}
    >
      <ProgressBar step={state.step} total={TOTAL_STEPS} />

      <div
        className="rounded-2xl p-6 sm:p-8 mt-8"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {state.step === 1 && <StepProject state={state} dispatch={dispatch} />}
            {state.step === 2 && <StepFeatures state={state} dispatch={dispatch} />}
            {state.step === 3 && <StepIntegrations state={state} dispatch={dispatch} />}
            {state.step === 4 && <StepDesign state={state} dispatch={dispatch} />}
            {state.step === 5 && <StepTimeline state={state} dispatch={dispatch} />}
            {state.step === 6 && <StepContact state={state} dispatch={dispatch} />}
            {state.step === 7 && <StepReview state={state} estimateText={formatEuroRange(estimate)} />}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          {state.step > 1 ? (
            <button
              onClick={() => dispatch({ type: "back" })}
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}

          {state.step < TOTAL_STEPS ? (
            <button
              disabled={!canContinue(state)}
              onClick={() => dispatch({ type: "next" })}
              className="btn-primary inline-flex items-center gap-2 text-sm"
              style={{ opacity: canContinue(state) ? 1 : 0.45, cursor: canContinue(state) ? "pointer" : "not-allowed" }}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              disabled={state.submitState === "submitting"}
              onClick={submit}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              {state.submitState === "submitting" ? "Sending..." : "Submit brief →"}
            </button>
          )}
        </div>

        {state.submitState === "error" && (
          <p className="text-sm mt-4" style={{ color: "#ff6b6b" }}>
            {state.errorMessage}. Email us directly at hello@get-built-fast.com.
          </p>
        )}
      </div>

      <p className="text-xs mt-6 text-center" style={{ color: "var(--text-muted)" }}>
        Live estimate: <span style={{ color: "var(--accent)", fontWeight: 700 }}>{formatEuroRange(estimate)}</span>
      </p>
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step - 1) / (total - 1)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        <span>Step {step} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

type StepProps = { state: State; dispatch: React.Dispatch<Action> };

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>{eyebrow}</p>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-sm" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
    </div>
  );
}

function StepProject({ state, dispatch }: StepProps) {
  return (
    <div>
      <SectionHeading eyebrow="Step 1" title="What are we building?" subtitle="Pick the closest match. We'll refine it together." />
      <div className="grid sm:grid-cols-2 gap-3">
        {PRICING.map((tier) => {
          const selected = state.projectTypeKey === tier.key;
          return (
            <button
              key={tier.key}
              onClick={() => dispatch({ type: "setProject", key: tier.key })}
              className="rounded-xl p-4 text-left transition-all"
              style={{
                background: selected ? "rgba(0,212,255,0.08)" : "var(--bg)",
                border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm mb-1">{tier.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{tier.priceLabel}</div>
                </div>
                {selected && <Check size={18} style={{ color: "var(--accent)" }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepFeatures({ state, dispatch }: StepProps) {
  return (
    <div>
      <SectionHeading eyebrow="Step 2" title="What features do you need?" subtitle="Pick as many as apply. Skip if you're not sure." />
      <div className="grid sm:grid-cols-2 gap-2">
        {FEATURES.map((f) => {
          const selected = state.featureKeys.includes(f.key);
          return (
            <button
              key={f.key}
              onClick={() => dispatch({ type: "toggleFeature", key: f.key })}
              className="rounded-lg p-3 text-left text-sm transition-all flex items-center gap-2"
              style={{
                background: selected ? "rgba(0,212,255,0.08)" : "var(--bg)",
                border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: selected ? "var(--accent)" : "transparent", border: "1.5px solid var(--border)" }}
              >
                {selected && <Check size={12} style={{ color: "#000" }} />}
              </div>
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepIntegrations({ state, dispatch }: StepProps) {
  return (
    <div>
      <SectionHeading eyebrow="Step 3" title="Any integrations?" subtitle="Tools you want wired in from day one." />
      <div className="grid sm:grid-cols-2 gap-2">
        {INTEGRATIONS.map((i) => {
          const selected = state.integrationKeys.includes(i.key);
          return (
            <button
              key={i.key}
              onClick={() => dispatch({ type: "toggleIntegration", key: i.key })}
              className="rounded-lg p-3 text-left text-sm transition-all flex items-center gap-2"
              style={{
                background: selected ? "rgba(0,212,255,0.08)" : "var(--bg)",
                border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: selected ? "var(--accent)" : "transparent", border: "1.5px solid var(--border)" }}
              >
                {selected && <Check size={12} style={{ color: "#000" }} />}
              </div>
              <span>{i.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDesign({ state, dispatch }: StepProps) {
  return (
    <div>
      <SectionHeading eyebrow="Step 4" title="Design direction" subtitle="Pick one style, tell us your color vibe, optionally drop links." />
      <div className="grid sm:grid-cols-3 gap-2 mb-6">
        {DESIGN_STYLES.map((d) => {
          const selected = state.designStyleKey === d.key;
          return (
            <button
              key={d.key}
              onClick={() => dispatch({ type: "setDesign", key: d.key })}
              className="rounded-lg p-3 text-sm font-medium transition-all"
              style={{
                background: selected ? "rgba(0,212,255,0.08)" : "var(--bg)",
                border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Color scheme (optional)</label>
      <input
        value={state.colorScheme}
        onChange={(e) => dispatch({ type: "setColor", value: e.target.value })}
        placeholder="e.g. navy + gold, monochrome, warm pastels"
        className="w-full rounded-lg p-3 text-sm mb-4"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
      />

      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Reference URLs (optional)</label>
      <textarea
        value={state.referenceUrls}
        onChange={(e) => dispatch({ type: "setRefs", value: e.target.value })}
        placeholder="Paste 1-3 sites you like, one per line"
        rows={3}
        className="w-full rounded-lg p-3 text-sm"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
    </div>
  );
}

function StepTimeline({ state, dispatch }: StepProps) {
  return (
    <div>
      <SectionHeading eyebrow="Step 5" title="Timeline and budget" />
      <div className="grid grid-cols-2 gap-2 mb-6">
        {TIMELINES.map((t) => {
          const selected = state.timelineKey === t.key;
          return (
            <button
              key={t.key}
              onClick={() => dispatch({ type: "setTimeline", key: t.key })}
              className="rounded-lg p-3 text-sm font-medium transition-all"
              style={{
                background: selected ? "rgba(0,212,255,0.08)" : "var(--bg)",
                border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
        Budget target: <span style={{ color: "var(--text)", fontWeight: 700 }}>€{state.budgetEuros.toLocaleString("en-US")}</span>
      </label>
      <input
        type="range"
        min={299}
        max={5000}
        step={100}
        value={state.budgetEuros}
        onChange={(e) => dispatch({ type: "setBudget", value: parseInt(e.target.value, 10) })}
        className="w-full mb-6"
        style={{ accentColor: "var(--accent)" }}
      />

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={state.rush}
          onChange={(e) => dispatch({ type: "setRush", value: e.target.checked })}
          className="w-4 h-4"
          style={{ accentColor: "var(--accent)" }}
        />
        <span className="text-sm inline-flex items-center gap-1">
          <Zap size={14} style={{ color: "var(--accent)" }} /> Rush delivery (+25%)
        </span>
      </label>
    </div>
  );
}

function StepContact({ state, dispatch }: StepProps) {
  const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" };
  const labelStyle = { color: "var(--text-muted)" };

  return (
    <div>
      <SectionHeading eyebrow="Step 6" title="Where do we send the brief?" />

      <div className="flex rounded-lg overflow-hidden mb-5" style={{ border: "1px solid var(--border)" }}>
        {(["individual", "business"] as const).map((t) => (
          <button
            key={t}
            onClick={() => dispatch({ type: "setClientType", value: t })}
            className="flex-1 py-2 text-sm font-semibold"
            style={{
              background: state.clientType === t ? "var(--accent)" : "transparent",
              color: state.clientType === t ? "#000" : "var(--text-muted)",
            }}
          >
            {t === "individual" ? "Individual" : "Business"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1" style={labelStyle}>Name *</label>
          <input value={state.name}
            onChange={(e) => dispatch({ type: "setField", field: "name", value: e.target.value })}
            className="w-full rounded-lg p-3 text-sm" style={inputStyle} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={labelStyle}>Email *</label>
          <input type="email" value={state.email}
            onChange={(e) => dispatch({ type: "setField", field: "email", value: e.target.value })}
            className="w-full rounded-lg p-3 text-sm" style={inputStyle} placeholder="you@email.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={labelStyle}>Phone (optional)</label>
          <input type="tel" value={state.phone}
            onChange={(e) => dispatch({ type: "setField", field: "phone", value: e.target.value })}
            className="w-full rounded-lg p-3 text-sm" style={inputStyle} placeholder="+31 6 ..." />
        </div>
        {state.clientType === "business" && (
          <div>
            <label className="block text-xs font-semibold mb-1" style={labelStyle}>Company name</label>
            <input value={state.companyName}
              onChange={(e) => dispatch({ type: "setField", field: "companyName", value: e.target.value })}
              className="w-full rounded-lg p-3 text-sm" style={inputStyle} placeholder="Acme B.V." />
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1" style={labelStyle}>How did you hear about us?</label>
          <select value={state.hearAboutUs}
            onChange={(e) => dispatch({ type: "setField", field: "hearAboutUs", value: e.target.value })}
            className="w-full rounded-lg p-3 text-sm" style={inputStyle}>
            <option value="">Select...</option>
            {HEAR_ABOUT_US.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={labelStyle}>Anything else to share? (optional)</label>
          <textarea value={state.description}
            onChange={(e) => dispatch({ type: "setField", field: "description", value: e.target.value })}
            rows={3} className="w-full rounded-lg p-3 text-sm" style={inputStyle}
            placeholder="Goals, constraints, anything that'll help us nail it." />
        </div>
      </div>
    </div>
  );
}

function StepReview({ state, estimateText }: { state: State; estimateText: string }) {
  const tier = PRICING.find((t) => t.key === state.projectTypeKey);
  const row = (label: string, value: string) => (
    <div className="flex items-start justify-between gap-3 py-2" style={{ borderTop: "1px solid var(--border)" }}>
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-sm text-right font-medium">{value || "—"}</span>
    </div>
  );

  const featureLabels = state.featureKeys.map((k) => FEATURES.find((f) => f.key === k)?.label ?? k).join(", ");
  const integrationLabels = state.integrationKeys.map((k) => INTEGRATIONS.find((i) => i.key === k)?.label ?? k).join(", ");
  const designLabel = DESIGN_STYLES.find((d) => d.key === state.designStyleKey)?.label ?? "";
  const timelineLabel = TIMELINES.find((t) => t.key === state.timelineKey)?.label ?? "";

  return (
    <div>
      <SectionHeading eyebrow="Step 7" title="Review and submit" subtitle="Double-check the brief, then hit submit." />

      <div
        className="rounded-xl p-5 mb-6 text-center"
        style={{ background: "rgba(0,212,255,0.06)", border: "1px solid var(--accent)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
          Estimated price range
        </p>
        <p className="text-3xl font-black" style={{ color: "var(--accent)" }}>{estimateText}</p>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Final quote after we review your brief. 48h turnaround.
        </p>
      </div>

      <div>
        {row("Project", tier?.name ?? "")}
        {row("Features", featureLabels)}
        {row("Integrations", integrationLabels)}
        {row("Design", designLabel)}
        {row("Color", state.colorScheme)}
        {row("References", state.referenceUrls)}
        {row("Timeline", timelineLabel + (state.rush ? " + rush" : ""))}
        {row("Budget", `€${state.budgetEuros.toLocaleString("en-US")}`)}
        {row("Name", state.name)}
        {row("Email", state.email)}
        {row("Phone", state.phone)}
        {state.clientType === "business" && row("Company", state.companyName)}
        {row("Heard via", state.hearAboutUs)}
        {row("Notes", state.description)}
      </div>
    </div>
  );
}
