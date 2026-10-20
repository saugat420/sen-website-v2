# Enquiry integration setup

The public form is intentionally fail-closed until all three server-side values are configured:

- `GOOGLE_SHEETS_WEBHOOK_URL`: the deployed receiver URL.
- `GOOGLE_SHEETS_WEBHOOK_SECRET`: a long random shared secret checked by the receiver.
- `WHATSAPP_SUPPORT_NUMBER`: digits only, including country code.

Add these as hosted runtime variables, not in source. Mark the webhook URL and secret as sensitive.

## Receiver contract

The website sends a JSON `POST` only from the server. The receiver must compare `secret` with its server-side secret, check column B for the incoming `enquiryId`, and return existing IDs as successful duplicates without appending. A successful response must be JSON: `{ "ok": true, "enquiryId": "the incoming ID", "duplicate": false }`.

Append these columns in order: submission timestamp, enquiry ID, full name, email address, WhatsApp number, English level, selected challenges, reserved legacy field.

Email is optional and may be an empty string. The final legacy field is also sent as an empty string so existing eight-column sheets and receivers remain compatible after removal of the eagerness question.

The route reuses the same enquiry ID on retries, sanitizes spreadsheet-formula prefixes, waits for an explicit save confirmation, and only then returns a WhatsApp URL to the browser.

## Google Apps Script example

Store the shared secret in Apps Script Properties as `WEBHOOK_SECRET`, and replace `SPREADSHEET_ID` and `SHEET_NAME`.

```js
const SPREADSHEET_ID = "replace-me";
const SHEET_NAME = "Enquiries";

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  const expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (!expected || body.secret !== expected) return json({ ok: false, error: "unauthorized" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return json({ ok: false, error: "sheet_not_found" });
    const lastRow = sheet.getLastRow();
    const ids = lastRow > 1 ? sheet.getRange(2, 2, lastRow - 1, 1).getDisplayValues().flat() : [];
    if (ids.includes(body.enquiryId)) return json({ ok: true, enquiryId: body.enquiryId, duplicate: true });

    sheet.appendRow([
      body.submissionTimestamp, body.enquiryId, body.fullName, body.emailAddress,
      body.whatsappNumber, body.englishLevel, body.selectedChallenges, body.eagernessToImprove,
    ]);
    SpreadsheetApp.flush();
    return json({ ok: true, enquiryId: body.enquiryId, duplicate: false });
  } finally {
    lock.releaseLock();
  }
}
```
