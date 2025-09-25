import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  DOMAIN: process.env.DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_SERVICE_USER: process.env.EMAIL_SERVICE_USER,
  EMAIL_SERVICE_PASSWORD: process.env.EMAIL_SERVICE_PASSWORD,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
};
