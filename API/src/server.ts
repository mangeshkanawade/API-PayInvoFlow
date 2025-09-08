import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
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
app.use("/api", routes);

// Swagger docs
const PORT = process.env.PORT || 5000;
swaggerDocs(app, Number(PORT));

// Global Error Handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 PayInvoFlow API running on http://localhost:${PORT}`)
);
