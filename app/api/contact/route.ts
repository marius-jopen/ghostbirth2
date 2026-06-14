import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBSTACK_URL = "https://ghostbirth2.substack.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string = body.email ?? "";
    const role: string = body.role ?? "";
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Best-effort Substack subscribe via the endpoint their own widget uses.
    // Undocumented; may throttle or break — we mirror to Resend as backup.
    const substack = fetch(`${SUBSTACK_URL}/api/v1/free`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        first_url: `${SUBSTACK_URL}/`,
        first_referrer: "",
        current_url: `${SUBSTACK_URL}/`,
        current_referrer: "",
        referral_code: "",
        source: "subscribe_page",
      }),
    }).catch(() => null);

    const mail = resend.emails.send({
      from: "Ghostbirth 2 <onboarding@resend.dev>",
      to: "mail@mariusjopen.com",
      subject: `Ghostly News signup — ${role || "Unknown"}`,
      replyTo: email,
      html: `
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Role:</strong> ${role || "—"}</p>
      `,
    });

    await Promise.allSettled([substack, mail]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
