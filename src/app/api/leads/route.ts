import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validators/lead";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateResult = await checkRateLimit(ip);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { consent: _, ...leadData } = parsed.data;

    // TODO: Save to database when DATABASE_URL is configured
    // const lead = await db.lead.create({ data: { ...leadData, source: body.source, pageUrl: body.pageUrl, utm: body.utm } });

    // TODO: Send emails when RESEND_API_KEY is configured
    // await resend.emails.send({ ... });

    console.log("[LEAD]", leadData);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[LEADS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
