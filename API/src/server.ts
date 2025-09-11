import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes/index.routes";
import { swaggerDocs } from "./swagger";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/payinvflow");

// Routes
app.get("/", (_, res) => {
  res.send(`Running in ${ENV.NODE_ENV} mode 🚀`);
});

// Swagger docs
const PORT = ENV.PORT;
swaggerDocs(app, Number(ENV.PORT));

app.use("/api", routes);

// Global Error Handler (must be after routes)
app.use(errorHandler);

app.listen(ENV.PORT, () =>
  console.log(`🚀 PayInvoFlow API running on http://localhost:${ENV.PORT}`)
);
