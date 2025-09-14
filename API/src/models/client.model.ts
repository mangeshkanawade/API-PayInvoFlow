import { Document, Schema, model } from "mongoose";

export interface IClient extends Document {
  name: string;
  address: string;
  email: string;
  phone: string;
  gstin: string;
  state: string;
  stateCode: string;
  createdAt?: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gstin: { type: String, required: true, minlength: 15, maxlength: 15 },
    state: { type: String, required: true },
    stateCode: { type: String, required: true, minlength: 2, maxlength: 2 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ClientModel = model<IClient>("Client", clientSchema);
