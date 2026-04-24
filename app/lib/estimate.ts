import { TIER } from "../data/pricing";
import { FEATURES } from "../data/quiz-options";

export type EstimateInput = {
  projectTypeKey: string;
  featureKeys: string[];
  rush: boolean;
  budgetHint?: number;
};

export type Estimate = {
  baseEuros: number;
  featuresAddEuros: number;
  rushAddEuros: number;
  minEuros: number;
  maxEuros: number;
};

export function computeEstimate(input: EstimateInput): Estimate {
  const tier = TIER[input.projectTypeKey];
  const base = tier?.priceFromEuros ?? 499;

  const featuresAdd = input.featureKeys.reduce((sum, key) => {
    const f = FEATURES.find((x) => x.key === key);
    return sum + (f?.priceAddEuros ?? 0);
  }, 0);

  const subtotal = base + featuresAdd;
  const rushAdd = input.rush ? Math.round(subtotal * 0.25) : 0;
  const center = subtotal + rushAdd;

  return {
    baseEuros: base,
    featuresAddEuros: featuresAdd,
    rushAddEuros: rushAdd,
    minEuros: center,
    maxEuros: Math.round(center * 1.4),
  };
}

export function formatEuroRange(e: Estimate): string {
  const f = (n: number) =>
    `€${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `${f(e.minEuros)}–${f(e.maxEuros)}`;
}
