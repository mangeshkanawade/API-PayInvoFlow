import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "Admin" | "Company" | "Viewer";
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
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
