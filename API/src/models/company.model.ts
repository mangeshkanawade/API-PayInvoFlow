import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  companyName: string;
  address: string;
  email: string;
  phone: string;
  gstin: string;
  state: string;
  stateCode: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  ifscCode: string;
  logo: string;
}

const CompanySchema = new Schema<ICompany>(
  {
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gstin: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, required: true },
    bankName: { type: String, required: true },
    bankBranch: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    logo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CompanyModel = mongoose.model<ICompany>("Company", CompanySchema);
