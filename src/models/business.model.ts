import mongoose, { Document, Schema } from "mongoose";

export interface IBusiness extends Document {
  name: string;
  email: string;
  ownerName?: string;
  contact?: string;
  description?: string;
  logo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    contact: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // store file URL or base64
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BusinessModel = mongoose.model<IBusiness>(
  "Business",
  BusinessSchema
);
