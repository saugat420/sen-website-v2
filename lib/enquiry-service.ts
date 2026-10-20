import { JWT } from "google-auth-library";
import nodemailer from "nodemailer";

export type EnquiryPayload = {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  challenges: string[];
  website: string;
  formStartedAt: number;
};

type SheetState = { rowNumber: number; adminEmailStatus: string; confirmationEmailStatus: string };

const headers = [
  "Submitted At", "Enquiry ID", "Full Name", "Email", "WhatsApp", "English Level",
  "Challenges", "Admin Notification", "Learner Confirmation", "Source",
];

const requiredEnv = (key: string) => {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`Missing required server configuration: ${key}`);
  return value;
};

const safeCell = (value: string) => /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
const html = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character] ?? character);
const quotedSheet = (name: string) => `'${name.replace(/'/g, "''")}'`;

async function googleAccessToken() {
  const client = new JWT({
    email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const access = await client.getAccessToken();
  if (!access.token) throw new Error("Google did not return an access token");
  return access.token;
}

async function sheetsRequest(path: string, init: RequestInit = {}) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
  const token = await googleAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Google Sheets request failed (${response.status}): ${detail}`);
  }
  return response.status === 204 ? null : response.json();
}

export async function ensureSheetReady() {
  const sheetName = requiredEnv("GOOGLE_SHEET_NAME");
  const encodedSheet = encodeURIComponent(quotedSheet(sheetName));
  const workbook = await sheetsRequest("?fields=sheets(properties(sheetId,title),bandedRanges(bandedRangeId))") as {
    sheets?: Array<{ properties?: { sheetId?: number; title?: string }; bandedRanges?: unknown[] }>;
  };
  const sheet = workbook.sheets?.find((item) => item.properties?.title === sheetName);
  const sheetId = sheet?.properties?.sheetId;
  const hasBanding = Boolean(sheet?.bandedRanges?.length);
  if (sheetId === undefined) throw new Error(`The Google Sheet tab “${sheetName}” was not found`);

  await sheetsRequest(`/values/${encodedSheet}!A1:J1?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [headers] }),
  });

  const widths = [155, 245, 190, 235, 170, 250, 340, 165, 175, 150];
  const requests: Record<string, unknown>[] = [
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
    { repeatCell: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 10 }, cell: { userEnteredFormat: { backgroundColor: { red: 0.024, green: 0.29, blue: 0.68 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 }, horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE", wrapStrategy: "WRAP" } }, fields: "userEnteredFormat" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: 10 }, cell: { userEnteredFormat: { verticalAlignment: "TOP", wrapStrategy: "WRAP" } }, fields: "userEnteredFormat.verticalAlignment,userEnteredFormat.wrapStrategy" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 42 }, fields: "pixelSize" } },
    { setBasicFilter: { filter: { range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: 10 } } } },
    ...widths.map((pixelSize, index) => ({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: "pixelSize" } })),
  ];

  if (!hasBanding) {
    requests.push({ addBanding: { bandedRange: { range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: 10 }, rowProperties: { headerColor: { red: 0.024, green: 0.29, blue: 0.68 }, firstBandColor: { red: 1, green: 1, blue: 1 }, secondBandColor: { red: 0.93, green: 0.96, blue: 1 } } } } });
  }

  await sheetsRequest(":batchUpdate", { method: "POST", body: JSON.stringify({ requests }) });
}

async function findOrCreateRow(payload: EnquiryPayload): Promise<SheetState> {
  const sheetName = requiredEnv("GOOGLE_SHEET_NAME");
  const range = encodeURIComponent(`${quotedSheet(sheetName)}!B2:B`);
  const existing = await sheetsRequest(`/values/${range}`) as { values?: string[][] };
  const existingIndex = existing.values?.findIndex((row) => row[0] === payload.enquiryId) ?? -1;

  if (existingIndex >= 0) {
    const rowNumber = existingIndex + 2;
    const rowRange = encodeURIComponent(`${quotedSheet(sheetName)}!A${rowNumber}:J${rowNumber}`);
    const row = await sheetsRequest(`/values/${rowRange}`) as { values?: string[][] };
    return {
      rowNumber,
      adminEmailStatus: row.values?.[0]?.[7] ?? "Pending",
      confirmationEmailStatus: row.values?.[0]?.[8] ?? "Pending",
    };
  }

  const submittedAt = new Date().toISOString();
  const appendRange = encodeURIComponent(`${quotedSheet(sheetName)}!A:J`);
  const appended = await sheetsRequest(`/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({ values: [[
      submittedAt,
      safeCell(payload.enquiryId),
      safeCell(payload.name),
      safeCell(payload.email),
      safeCell(payload.phone),
      safeCell(payload.level),
      safeCell(payload.challenges.join("; ")),
      "Pending",
      "Pending",
      "Website",
    ]] }),
  }) as { updates?: { updatedRange?: string } };
  const rowNumber = Number(appended.updates?.updatedRange?.match(/!A(\d+):/)?.[1]);
  if (!rowNumber) throw new Error("Google Sheets did not return the saved row number");
  return { rowNumber, adminEmailStatus: "Pending", confirmationEmailStatus: "Pending" };
}

async function setStatus(rowNumber: number, column: "H" | "I", status: string) {
  const sheetName = requiredEnv("GOOGLE_SHEET_NAME");
  const range = encodeURIComponent(`${quotedSheet(sheetName)}!${column}${rowNumber}`);
  await sheetsRequest(`/values/${range}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ values: [[status]] }) });
}

function transporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: requiredEnv("SMTP_USER"), pass: requiredEnv("SMTP_APP_PASSWORD").replace(/\s/g, "") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

async function sendAdminNotification(payload: EnquiryPayload) {
  const recipient = requiredEnv("NOTIFICATION_EMAIL");
  const from = requiredEnv("SMTP_USER");
  const challengeList = payload.challenges.map((item) => `<li>${html(item)}</li>`).join("");
  await transporter().sendMail({
    from: `Spoken English Nepal <${from}>`,
    to: recipient,
    replyTo: payload.email,
    subject: `New SEN enquiry — ${payload.name}`,
    text: `New Spoken English Nepal enquiry\n\nName: ${payload.name}\nEmail: ${payload.email}\nWhatsApp: ${payload.phone}\nEnglish level: ${payload.level}\nChallenges: ${payload.challenges.join(", ")}\nEnquiry ID: ${payload.enquiryId}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#111d2c"><h2 style="color:#064aad">New Spoken English Nepal enquiry</h2><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px;border-bottom:1px solid #d8e0e9"><strong>Name</strong></td><td style="padding:8px;border-bottom:1px solid #d8e0e9">${html(payload.name)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #d8e0e9"><strong>Email</strong></td><td style="padding:8px;border-bottom:1px solid #d8e0e9">${html(payload.email)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #d8e0e9"><strong>WhatsApp</strong></td><td style="padding:8px;border-bottom:1px solid #d8e0e9">${html(payload.phone)}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #d8e0e9"><strong>English level</strong></td><td style="padding:8px;border-bottom:1px solid #d8e0e9">${html(payload.level)}</td></tr></table><h3>They would like help with</h3><ul>${challengeList}</ul><p style="color:#5c6674">Enquiry ID: ${html(payload.enquiryId)}</p></div>`,
  });
}

async function sendLearnerConfirmation(payload: EnquiryPayload) {
  const from = requiredEnv("SMTP_USER");
  await transporter().sendMail({
    from: `Spoken English Nepal <${from}>`,
    to: payload.email,
    subject: "We received your Spoken English Nepal enquiry",
    text: `Hi ${payload.name},\n\nThank you for enquiring about the English Fluency Launchpad. We have received your details and our team will follow up with you on WhatsApp.\n\nYour English level: ${payload.level}\nYou would like help with: ${payload.challenges.join(", ")}\n\nSpoken English Nepal`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#111d2c"><h2 style="color:#064aad">We received your enquiry</h2><p>Hi ${html(payload.name)},</p><p>Thank you for enquiring about the <strong>English Fluency Launchpad</strong>. We have received your details, and our team will follow up with you on WhatsApp.</p><div style="padding:16px;border-radius:12px;background:#edf5ff"><p style="margin:0 0 8px"><strong>Your English level:</strong> ${html(payload.level)}</p><p style="margin:0"><strong>You would like help with:</strong> ${html(payload.challenges.join(", "))}</p></div><p>Keep an eye on WhatsApp for the program fee, available timings and next steps.</p><p><strong>Spoken English Nepal</strong></p></div>`,
  });
}

export async function verifyEmailConnection() {
  await transporter().verify();
}

export async function processEnquiry(payload: EnquiryPayload) {
  const supportNumber = requiredEnv("WHATSAPP_SUPPORT_NUMBER").replace(/\D/g, "");
  if (supportNumber.length < 8) throw new Error("WHATSAPP_SUPPORT_NUMBER is invalid");

  await ensureSheetReady();
  const saved = await findOrCreateRow(payload);
  const failures: string[] = [];

  if (saved.adminEmailStatus !== "Sent") {
    try {
      await sendAdminNotification(payload);
      await setStatus(saved.rowNumber, "H", "Sent");
    } catch (error) {
      await setStatus(saved.rowNumber, "H", "Failed").catch(() => undefined);
      failures.push(error instanceof Error ? error.message : "Admin notification failed");
    }
  }

  if (saved.confirmationEmailStatus !== "Sent") {
    try {
      await sendLearnerConfirmation(payload);
      await setStatus(saved.rowNumber, "I", "Sent");
    } catch (error) {
      await setStatus(saved.rowNumber, "I", "Failed").catch(() => undefined);
      failures.push(error instanceof Error ? error.message : "Learner confirmation failed");
    }
  }

  if (failures.length) throw new Error(`The enquiry was saved, but email delivery failed: ${failures.join("; ")}`);

  const message = [
    "Hello Spoken English Nepal,",
    "I’d like to know more about English Fluency Launchpad.",
    "",
    `Name: ${payload.name}`,
    `WhatsApp: ${payload.phone}`,
    `Email: ${payload.email}`,
    `English level: ${payload.level}`,
    `What I need help with: ${payload.challenges.join(", ")}`,
    "",
    "Please share the program fee, available timings and next steps.",
  ].join("\n");

  return { ok: true, enquiryId: payload.enquiryId, whatsappUrl: `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}` };
}
