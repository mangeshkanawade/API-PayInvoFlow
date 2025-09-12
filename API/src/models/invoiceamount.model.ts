import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceAmount extends Document {
  invoice: mongoose.Types.ObjectId; // Reference to Invoice
  subtotal: number;
  cgstAmount?: number;
  sgstAmount?: number;
  grandTotal: number;
  amountInWords: string;
}

const InvoiceAmountSchema = new Schema<IInvoiceAmount>(
  {
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      unique: true,
    },
    subtotal: { type: Number, required: true },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    amountInWords: { type: String, required: true },
  },
  { timestamps: true }
);

export const InvoiceAmountModel = mongoose.model<IInvoiceAmount>(
  "InvoiceAmount",
  InvoiceAmountSchema
);
