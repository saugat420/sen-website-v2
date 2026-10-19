declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    GOOGLE_SHEETS_WEBHOOK_URL?: string;
    GOOGLE_SHEETS_WEBHOOK_SECRET?: string;
    WHATSAPP_SUPPORT_NUMBER?: string;
  }
}
