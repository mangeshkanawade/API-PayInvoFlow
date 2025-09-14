import mongoose, { Document, Schema } from "mongoose";

export interface IEmailLog extends Document {
  to: string;
  subject: string;
  body: string;
  attachments?: string[];
  sentAt: Date;
  status: "SENT" | "FAILED";
  errorMessage?: string;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [{ type: String }],
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["SENT", "FAILED"], required: true },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const EmailLogModel = mongoose.model<IEmailLog>(
  "EmailLog",
  EmailLogSchema
);
