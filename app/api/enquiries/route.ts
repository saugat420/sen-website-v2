import { z } from "zod";
import type { EnquiryPayload } from "@/lib/enquiry-service";

export const runtime = "nodejs";

const levels = [
  "I know a few words.",
  "I can make simple sentences.",
  "I understand English, but struggle to speak.",
  "I can speak, but want to improve.",
] as const;

const challengeOptions = [
  "Finding the right words.",
  "Speaking without translating.",
  "Feeling confident.",
  "Pronunciation.",
  "Everyday conversations.",
  "Speaking at work.",
] as const;

const enquirySchema = z.object({
  enquiryId: z.string().min(16).max(80).regex(/^[a-zA-Z0-9-]+$/),
  name: z.string().trim().min(2).max(100).regex(/^[^\r\n]+$/),
  email: z.string().trim().max(180).refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
  phone: z.string().trim().transform((value) => value.replace(/[\s()-]/g, "")).pipe(z.string().regex(/^\+[1-9]\d{7,14}$/)),
  level: z.enum(levels),
  challenges: z.array(z.enum(challengeOptions)).min(1).max(challengeOptions.length),
  website: z.string().max(0),
  formStartedAt: z.number().int().positive(),
});

export async function POST(request: Request) {
  let payload: EnquiryPayload;
  try {
    payload = enquirySchema.parse(await request.json());
  } catch {
    return Response.json({ error: "Some answers need your attention. Please review the form and try again." }, { status: 400 });
  }

  if (Date.now() - payload.formStartedAt < 1200) {
    return Response.json({ error: "Please wait a moment and try again." }, { status: 429 });
  }

  const backendUrl = process.env.ENQUIRY_BACKEND_URL;
  if (backendUrl) return proxyToVercel(backendUrl, payload);

  const suppliedProxySecret = request.headers.get("x-sen-proxy-secret");
  const expectedProxySecret = process.env.ENQUIRY_BACKEND_SECRET;
  if (!expectedProxySecret || suppliedProxySecret !== expectedProxySecret) {
    return Response.json({ error: "This enquiry could not be authorised." }, { status: 401 });
  }

  try {
    const { processEnquiry } = await import("@/lib/enquiry-service");
    const result = await processEnquiry(payload);
    return Response.json(result);
  } catch (error) {
    console.error("Enquiry processing failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "We couldn’t complete your enquiry. Your answers are still here—please try again." }, { status: 502 });
  }
}

async function proxyToVercel(backendUrl: string, payload: EnquiryPayload) {
  const secret = process.env.ENQUIRY_BACKEND_SECRET;
  if (!secret) return Response.json({ error: "Enquiries are not open yet. Please check back soon." }, { status: 503 });

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-sen-proxy-secret": secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json();
    return Response.json(result, { status: response.status });
  } catch {
    return Response.json({ error: "We couldn’t reach our enquiry service. Your answers are still here—please try again." }, { status: 502 });
  }
}
