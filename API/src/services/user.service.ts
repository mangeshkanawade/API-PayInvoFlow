import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { BaseService } from "./base.service";

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
}
