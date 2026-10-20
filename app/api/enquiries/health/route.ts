export const runtime = "nodejs";

export async function GET(request: Request) {
  const expected = process.env.ENQUIRY_BACKEND_SECRET;
  const supplied = request.headers.get("x-sen-backend-secret");
  if (!expected || supplied !== expected) {
    return Response.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { ensureSheetReady, verifyEmailConnection } = await import("@/lib/enquiry-service");
    await ensureSheetReady();
    await verifyEmailConnection();
    return Response.json({ ok: true, sheet: "ready", email: "ready" });
  } catch (error) {
    console.error("Enquiry service health check failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Enquiry services are not ready" }, { status: 503 });
  }
}
