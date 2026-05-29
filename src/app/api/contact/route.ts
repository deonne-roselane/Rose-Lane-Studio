import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  company?: string;
  role?: string;
  email?: string;
  engagementTypes?: string[];
  situation?: string;
  timeline?: string;
  referral?: string;
  timezone?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatEmailBody(payload: Required<Pick<ContactPayload, "name" | "email">> & ContactPayload) {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company || "—"}`,
    `Role: ${payload.role || "—"}`,
    `Engagement type: ${payload.engagementTypes?.join(", ") || "—"}`,
    `Timeline: ${payload.timeline || "—"}`,
    `How they heard about Rose Lane Studio: ${payload.referral || "—"}`,
    `Timezone: ${payload.timezone || "—"}`,
    "",
    "Describe the situation:",
    payload.situation || "—",
  ];

  return lines.join("\n");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const engagementTypes = Array.isArray(payload.engagementTypes)
      ? payload.engagementTypes.filter(Boolean)
      : [];
    const timeline = payload.timeline?.trim() ?? "";

    if (
      !name ||
      !email ||
      !isValidEmail(email) ||
      engagementTypes.length === 0 ||
      !timeline
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const company = payload.company?.trim() ?? "";
    const subject = company
      ? `Web inquiry - ${name} (${company})`
      : `Web inquiry - ${name}`;

    const { error } = await resend.emails.send({
      from: "Rose Lane Studio <web@roselanestudio.co>",
      to: ["deonne.castaneda@gmail.com", "deonne@roselanestudio.co"],
      replyTo: email,
      subject,
      text: formatEmailBody({
        ...payload,
        name,
        email,
        company,
        engagementTypes,
        timeline,
      }),
    });

    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
