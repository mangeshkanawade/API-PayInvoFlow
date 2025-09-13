import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes/index.routes";
import { swaggerDocs } from "./swagger";

dotenv.config();

const app = express();

// ✅ Step 1: Allowed origins
const allowedOrigins = [
  "http://localhost:2000",
  "http://localhost:3000",
  "https://api-payinvoflow.vercel.app",
];

const serverUrl =
  ENV.NODE_ENV === "production"
    ? `${ENV.DOMAIN}/api` // use your domain in production
    : `http://localhost:${ENV.PORT}/api`;

// ✅ Serve static files from "public"
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Step 2: CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Step 3: DB connection
connectDB(ENV.DB_URL || "mongodb://127.0.0.1:27017/payinvflow");

//SeedHelper.run();

// ✅ Step 4: Health route
app.get("/", (_, res) => {
  res.send(`Running in ${ENV.NODE_ENV} mode 🚀`);
});

// ✅ Step 5: Swagger docs
swaggerDocs(app, Number(ENV.PORT));

// ✅ Step 6: API routes
app.use("/api", routes);

// ✅ Step 7: Error handler (last)
app.use(errorHandler);

// ✅ Step 8: Start server
app.listen(ENV.PORT, () =>
  console.log(`🚀 PayInvoFlow API running at ${serverUrl}`)
);
