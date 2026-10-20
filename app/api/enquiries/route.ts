import { z } from "zod";

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
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().max(180).refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
  phone: z.string().trim().transform((value) => value.replace(/[\s()-]/g, "")).pipe(z.string().regex(/^\+[1-9]\d{7,14}$/)),
  level: z.enum(levels),
  challenges: z.array(z.enum(challengeOptions)).min(1).max(challengeOptions.length),
  website: z.string().max(0),
  formStartedAt: z.number().int().positive(),
});

const safeCell = (value: string) => /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  const supportNumber = process.env.WHATSAPP_SUPPORT_NUMBER?.replace(/\D/g, "");

  if (!webhookUrl || !webhookSecret || !supportNumber) {
    return Response.json({ error: "Enquiries are not open yet. Please check back soon." }, { status: 503 });
  }

  let payload: z.infer<typeof enquirySchema>;
  try {
    payload = enquirySchema.parse(await request.json());
  } catch {
    return Response.json({ error: "Some answers need your attention. Please review the form and try again." }, { status: 400 });
  }

  if (Date.now() - payload.formStartedAt < 1200) {
    return Response.json({ error: "Please wait a moment and try again." }, { status: 429 });
  }

  const submittedAt = new Date().toISOString();
  const sheetPayload = {
    submissionTimestamp: submittedAt,
    enquiryId: safeCell(payload.enquiryId),
    fullName: safeCell(payload.name),
    emailAddress: safeCell(payload.email),
    whatsappNumber: safeCell(payload.phone),
    englishLevel: safeCell(payload.level),
    selectedChallenges: safeCell(payload.challenges.join("; ")),
    eagernessToImprove: "",
  };

  try {
    const saveResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${webhookSecret}`, "Idempotency-Key": payload.enquiryId },
      body: JSON.stringify({ ...sheetPayload, secret: webhookSecret }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!saveResponse.ok) throw new Error(`Spreadsheet receiver returned ${saveResponse.status}`);
    const confirmation = await saveResponse.json() as { ok?: boolean; enquiryId?: string; duplicate?: boolean };
    if (!confirmation.ok || confirmation.enquiryId !== payload.enquiryId) throw new Error("Spreadsheet receiver did not confirm the saved enquiry");

    const message = [
      "Hello Spoken English Nepal,",
      "I’d like to know more about English Fluency Launchpad.",
      "",
      `Name: ${payload.name}`,
      `WhatsApp: ${payload.phone}`,
      ...(payload.email ? [`Email: ${payload.email}`] : []),
      `English level: ${payload.level}`,
      `What I need help with: ${payload.challenges.join(", ")}`,
      "",
      "Please share the program fee, available timings and next steps.",
    ].join("\n");

    return Response.json({ ok: true, enquiryId: payload.enquiryId, whatsappUrl: `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}` });
  } catch (error) {
    console.error("Enquiry save failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "We couldn’t save your enquiry. Your answers are still here—please try again." }, { status: 502 });
  }
}
