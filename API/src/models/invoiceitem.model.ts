import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceItem extends Document {
  invoice: mongoose.Types.ObjectId;
  date: Date;
  particulars: string;
  vehicleNo?: string;
  invoiceNo?: string;
  quantity?: number;
  rate?: number;
  amount: number;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    date: { type: Date, required: true },
    particulars: { type: String, required: true },
    vehicleNo: { type: String },
    invoiceNo: { type: String },
    quantity: { type: Number },
    rate: { type: Number },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const InvoiceItemModel = mongoose.model<IInvoiceItem>(
  "InvoiceItem",
  InvoiceItemSchema
);
