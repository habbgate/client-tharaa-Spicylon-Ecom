import nodemailer from "nodemailer";

// Create generic transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email and awaits delivery before resolving.
 * Must be awaited — fire-and-forget breaks on Vercel serverless.
 */
export const sendEmailBackground = async (
  to: string,
  subject: string,
  html: string,
  attachments?: any[],
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Spicylon" <noreply@spicylon.com>',
      to,
      subject,
      html,
      attachments,
    });
    console.log(`[Email] Successfully sent to ${to}: ${info.messageId}`);
  } catch (err) {
    // Log but do not re-throw — email failure should never crash the API response
    console.error(`[Email] Failed to send to ${to}:`, err);
  }
};
