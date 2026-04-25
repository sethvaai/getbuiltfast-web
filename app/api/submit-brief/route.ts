import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "../../lib/supabase";
import { PRICING } from "../../data/pricing";
import { FEATURES, INTEGRATIONS, DESIGN_STYLES, TIMELINES } from "../../data/quiz-options";

type BriefPayload = {
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
  phone?: string;
  companyName?: string;
  hearAboutUs?: string;
  description?: string;
  estimateMin: number;
  estimateMax: number;
};

function label<T extends { key: string; label?: string; name?: string }>(
  list: T[],
  key: string,
): string {
  const match = list.find((x) => x.key === key);
  if (!match) return key;
  return match.label ?? match.name ?? key;
}

function splitRefs(raw: string): string[] {
  return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as BriefPayload;

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const projectLabel = label(PRICING, body.projectTypeKey);
  const featureLabels = body.featureKeys.map((k) => label(FEATURES, k));
  const integrationLabels = body.integrationKeys.map((k) => label(INTEGRATIONS, k));
  const designLabel = label(DESIGN_STYLES, body.designStyleKey);
  const timelineLabel = label(TIMELINES, body.timelineKey);
  const referenceUrls = splitRefs(body.referenceUrls ?? "");

  let leadId: string | null = null;
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.insertLead({
      email: body.email,
      name: body.name,
      phone: body.phone || null,
      company_name: body.companyName || null,
      client_type: body.clientType,
      project_type: body.projectTypeKey,
      features: body.featureKeys,
      integrations: body.integrationKeys,
      style_preferences: {
        style: body.designStyleKey,
        color: body.colorScheme || null,
      },
      reference_urls: referenceUrls,
      timeline: body.timelineKey,
      budget_range: String(body.budgetEuros),
      rush_delivery: body.rush,
      estimated_price_min: body.estimateMin,
      estimated_price_max: body.estimateMax,
      description: body.description || null,
      hear_about_us: body.hearAboutUs || null,
      status: "new",
    });
    if (error) {
      console.error("Supabase insert failed:", error.message);
    } else if (data?.id) {
      leadId = data.id;
    }
  } else {
    console.warn("GBF_SUPABASE_URL / GBF_SUPABASE_SERVICE_ROLE missing — skipping DB insert");
  }

  // Email notification to team + client (skipped if no key)
  const resendKey = process.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;

  const html = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="color: #00D4FF; margin: 0 0 8px;">New Project Brief — GetBuiltFast</h2>
      ${leadId ? `<p style="font-size: 12px; color: #666;">Lead ID: <code>${leadId}</code></p>` : ""}
      <p style="font-size: 14px; color: #666;">Estimated range: <strong>€${body.estimateMin.toLocaleString("en-US")}–€${body.estimateMax.toLocaleString("en-US")}</strong></p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding:6px 0; color:#666; width: 150px;">Client</td><td>${escape(body.clientType === "business" ? "Business" : "Individual")}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Name</td><td>${escape(body.name)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Email</td><td><a href="mailto:${escape(body.email)}">${escape(body.email)}</a></td></tr>
        ${body.phone ? `<tr><td style="padding:6px 0; color:#666;">Phone</td><td>${escape(body.phone)}</td></tr>` : ""}
        ${body.companyName ? `<tr><td style="padding:6px 0; color:#666;">Company</td><td>${escape(body.companyName)}</td></tr>` : ""}
        <tr><td style="padding:6px 0; color:#666;">Project</td><td>${escape(projectLabel)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Features</td><td>${escape(featureLabels.join(", ")) || "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Integrations</td><td>${escape(integrationLabels.join(", ")) || "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Design</td><td>${escape(designLabel)}${body.colorScheme ? " · " + escape(body.colorScheme) : ""}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">References</td><td>${referenceUrls.map((u) => `<a href="${escape(u)}">${escape(u)}</a>`).join("<br>") || "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Timeline</td><td>${escape(timelineLabel)}${body.rush ? " · rush (+25%)" : ""}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Budget target</td><td>€${body.budgetEuros.toLocaleString("en-US")}</td></tr>
        ${body.hearAboutUs ? `<tr><td style="padding:6px 0; color:#666;">Heard via</td><td>${escape(body.hearAboutUs)}</td></tr>` : ""}
      </table>
      ${body.description ? `<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;"><p style="color:#666; font-weight: bold;">Notes</p><p style="white-space: pre-wrap;">${escape(body.description)}</p>` : ""}
    </div>
  `;

  let mailError: { message: string } | null = null;
  if (resend) {
    const { error } = await resend.emails.send({
      from: "noreply@cindervaleventures.com",
      to: "hello@get-built-fast.com",
      replyTo: body.email,
      subject: `New Brief: ${projectLabel} — ${body.name}`,
      html,
    });
    mailError = error ?? null;
    if (mailError) console.error("Resend failed:", mailError.message);
    // Client confirmation email
    await resend.emails.send({
      from: 'noreply@cindervaleventures.com',
      to: body.email,
      subject: 'Brief received — GetBuiltFast',
      html: '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px"><h2 style="color:#00d4ff">Brief received.</h2><p>Hi ' + body.name + ',</p><p>We received your brief and will be in touch within 2 hours with next steps.</p><p>Reference: ' + leadId + '</p><p>— GetBuiltFast team</p></div>',
    });

    // Notify n8n
    fetch('https://agentseth.cindervaleventures.com/webhook/7c40a17e-ff4d-4e1d-b4a3-f4cf8b5c9743', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: body.name, email: body.email, project_type: projectLabel}),
    }).catch(() => {});

  } else {
    console.warn("RESEND_API_KEY missing — skipping email notification");
  }

  // Hard fail only if we delivered nowhere
  if (!leadId && (!resend || mailError)) {
    return NextResponse.json(
      { error: "Brief not delivered — server is missing RESEND_API_KEY and SUPABASE keys" },
      { status: 500 },
    );
  }

  return NextResponse.json({ leadId, success: true });
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
