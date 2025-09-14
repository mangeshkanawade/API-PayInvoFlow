import nodemailer from "nodemailer";
import { ENV } from "../config/env";

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: ENV.EMAIL_SERVICE_USER,
        pass: ENV.EMAIL_SERVICE_PASSWORD,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: Array<{ filename: string; content: Buffer | string }>
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"PayInvoFlow" <${ENV.EMAIL_SERVICE_USER}>`,
        to,
        subject,
        text,
        html,
        attachments,
      });

      console.log("✅ Email sent:", info.messageId);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }
}
