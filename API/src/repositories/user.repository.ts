import { IUser, UserModel } from "../models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  }

  async findByUsername(username: string) {
    return await UserModel.findOne({ username });
  }
}
