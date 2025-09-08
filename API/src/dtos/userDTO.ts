import { Exclude, Expose } from "class-transformer";

export class UserDTO {
  @Expose()
  _id!: string;

  @Expose()
  username!: string;

  @Expose()
  name!: string;

  @Expose()
  phone!: string;

  @Expose()
  email!: string;

  @Exclude()
  password!: string;
}
