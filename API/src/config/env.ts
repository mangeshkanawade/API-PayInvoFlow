import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  SWAGGER_APIS: process.env.SWAGGER_APIS || "src/routes/*.ts",
  DB_URL:
    process.env.DB_URL ||
    "mongodb+srv://kanawade84_db_user:8MwP90H1pQsZfr8J@payinvflowcluster.u0jycte.mongodb.net/payinvflow",
  DOMAIN:
    process.env.DOMAIN || `http://localhost:${process.env.PORT || "3000"}`,
  JWT_SECRET: process.env.JWT_SECRET || "PayInvFlowSuperSecretKey123",
};
