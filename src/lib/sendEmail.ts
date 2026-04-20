import nodemailer from 'nodemailer';

// Create generic transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Utility to send emails in the background. 
 * Does NOT return a promise so your frontend doesn't hang.
 */
export const sendEmailBackground = (
  to: string,
  subject: string,
  html: string,
  attachments?: any[]
) => {
  // Fire and forget, catching errors internally
  transporter
    .sendMail({
      from: process.env.EMAIL_FROM || '"Spicylon" <noreply@spicylon.com>',
      to,
      subject,
      html,
      attachments,
    })
    .then((info) => {
      console.log(`[Email] Successfully sent to ${to}: ${info.messageId}`);
    })
    .catch((err) => {
      console.error(`[Email] Failed to send to ${to}:`, err);
    });
};
