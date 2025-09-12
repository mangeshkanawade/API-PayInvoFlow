import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { BaseService } from "./base.service";

import crypto from "crypto";
import { UserModel } from "../models/user.model";

export class UserService extends BaseService<IUser> {
  private jwtSecret: string;

  constructor(public repo: UserRepository, jwtSecret: string) {
    super(repo);
    this.jwtSecret = jwtSecret;
  }

  async register(userData: Partial<IUser>) {
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const user = await this.repo.create({
      ...userData,
      password: hashedPassword,
    } as IUser);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid email or password");

    // generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, this.jwtSecret, {
      expiresIn: "1h",
    });

    return {
      token,
      user: {
        id: user?._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getByUserEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  async getByUsername(username: string) {
    return this.repo.findByUsername(username);
  }

  /**
   * Generates a password reset token and sets expiry, then returns token
   */
  async forgotPassword(email: string): Promise<string> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    // You should send this token via email to the user
    return token;
  }

  /**
   * Resets the user's password using the token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new Error("Invalid or expired token");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return true;
  }
}
