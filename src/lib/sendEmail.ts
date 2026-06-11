import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER?.trim();
  // Trim the password to guard against accidental leading/trailing whitespace in .env
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !Number.isFinite(port) || !user || !pass) {
    console.error("[Email] SMTP config check failed —", {
      host: host ?? "MISSING",
      port,
      user: user ?? "MISSING",
      passSet: !!pass,
    });
    throw new Error(
      "Missing SMTP configuration: SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS are required.",
    );
  }

  console.log(`[Email] Creating transporter → ${host}:${port} as ${user}`);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export function getFirstValidEmail(
  ...values: Array<string | undefined | null>
): string {
  return (
    values.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )?.trim() || ""
  );
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function sendWithRetry(
  to: string,
  subject: string,
  html: string,
  attachments?: nodemailer.SendMailOptions["attachments"],
  maxAttempts = 3,
): Promise<boolean> {
  const recipient = to.trim();

  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    console.error(`[Email] Invalid recipient address: "${to}"`);
    return false;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const transporter = createTransporter();

    try {
      // On the first attempt, verify the SMTP connection to catch credential
      // or connectivity issues immediately with a clear diagnostic message.
      if (attempt === 1) {
        try {
          await transporter.verify();
          console.log("[Email] SMTP connection verified successfully.");
        } catch (verifyErr) {
          const verifyMsg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
          console.error(
            "[Email] SMTP verification failed — check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env:",
            verifyMsg,
          );
          // Let the actual sendMail attempt continue; verify failure may still
          // allow sending in some SMTP server configurations.
        }
      }

      const info = await transporter.sendMail({
        from:
          process.env.EMAIL_FROM?.trim() || '"Spicylon" <noreply@spicylon.com>',
        to: recipient,
        subject,
        html,
        text: htmlToText(html),
        attachments,
      });

      await transporter.close();
      console.log(
        `[Email] ✅ Successfully sent to ${recipient} (attempt ${attempt}): ${info.messageId}`,
      );
      return true;
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `[Email] ❌ Attempt ${attempt}/${maxAttempts} failed for ${recipient}: ${message}`,
      );

      try {
        await transporter.close();
      } catch (closeError) {
        console.error(
          "[Email] Transport close failed:",
          closeError instanceof Error ? closeError.message : String(closeError),
        );
      }
    }

    if (attempt < maxAttempts) {
      const delay = 500 * attempt;
      console.log(`[Email] Retrying in ${delay}ms…`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  console.error(
    `[Email] ❌ All ${maxAttempts} attempts exhausted for ${recipient}: ${message}`,
  );
  return false;
}

export const sendEmailBackground = async (
  to: string,
  subject: string,
  html: string,
  attachments?: nodemailer.SendMailOptions["attachments"],
): Promise<boolean> => sendWithRetry(to, subject, html, attachments);
