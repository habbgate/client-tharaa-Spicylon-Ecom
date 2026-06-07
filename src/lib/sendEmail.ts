import nodemailer from "nodemailer";

function createTransporter() {
  const port = parseInt(process.env.SMTP_PORT || "587");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

async function sendWithRetry(
  to: string,
  subject: string,
  html: string,
  attachments?: any[],
  maxAttempts = 3,
): Promise<boolean> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const transporter = createTransporter();
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Spicylon" <noreply@spicylon.com>',
        to,
        subject,
        html,
        attachments,
      });
      console.log(`[Email] Successfully sent to ${to}: ${info.messageId}`);
      return true;
    } catch (err) {
      lastError = err;
      console.error(`[Email] Attempt ${attempt} failed for ${to}:`, err);
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }

  console.error(`[Email] Failed after ${maxAttempts} attempts for ${to}:`, lastError);
  return false;
}

/**
 * Sends an email and awaits delivery before resolving.
 * Must be awaited — fire-and-forget breaks on Vercel serverless.
 */
export const sendEmailBackground = async (
  to: string,
  subject: string,
  html: string,
  attachments?: any[],
): Promise<boolean> => sendWithRetry(to, subject, html, attachments);
