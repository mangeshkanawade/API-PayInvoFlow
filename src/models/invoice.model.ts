import mongoose, { Document, Schema } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  client: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  cgstRate?: number;
  sgstRate?: number;
  status: "Draft" | "Paid" | "Cancelled";
  dueDate?: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    cgstRate: { type: Number, default: 6.0 },
    sgstRate: { type: Number, default: 6.0 },
    status: { type: String, default: "Draft" },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const InvoiceModel = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
