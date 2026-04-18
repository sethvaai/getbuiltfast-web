import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const {
      clientType,
      name,
      email,
      company,
      kvk,
      projectType,
      budget,
      message,
    } = body;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00D4FF;">New Project Brief — GetBuiltFast</h2>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">Client Type</td><td>${clientType === "business" ? "Business" : "Individual"}</td></tr>
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">Name</td><td>${name}</td></tr>
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${clientType === "business" ? `
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">Company</td><td>${company || "—"}</td></tr>
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">KvK Number</td><td>${kvk || "—"}</td></tr>
          ` : ""}
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">Project Type</td><td>${projectType || "—"}</td></tr>
          <tr><td style="padding:8px 0; font-weight:bold; color:#666;">Budget</td><td>${budget || "—"}</td></tr>
        </table>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-weight:bold; color:#666;">Message</p>
        <p style="white-space:pre-wrap;">${message}</p>
        <hr style="margin: 16px 0;" />
        <p style="font-size:12px; color:#999;">Sent via GetBuiltFast contact form</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "noreply@cindervaleventures.com",
      to: "hello@get-built-fast.com",
      replyTo: email,
      subject: `New Project Brief from ${name} — GetBuiltFast`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
