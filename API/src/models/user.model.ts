import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "Admin" | "Company" | "Viewer";
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Company", "Viewer"],
      default: "Viewer",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
