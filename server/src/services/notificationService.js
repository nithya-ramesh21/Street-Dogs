import nodemailer from "nodemailer";

const createTransport = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendNotification = async ({ subject, text }) => {
  const to = process.env.NOTIFY_TO;
  if (!to) {
    console.log("Notification skipped: NOTIFY_TO missing");
    return;
  }

  const transporter = createTransport();

  if (!transporter) {
    console.log(`Notification (log only): ${subject} | ${text}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.NOTIFY_FROM || "streetdogs@example.com",
    to,
    subject,
    text,
  });
};
