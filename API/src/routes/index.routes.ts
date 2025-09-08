import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import authRoutes from "./auth.routes";
import clientRoutes from "./client.routes";
import companyRoutes from "./company.routes";
import invoiceRoutes from "./invoice.routes";
import invoiceItemRoutes from "./invoiceItem.routes";
import userRoutes from "./user.routes";

const router = Router();

// Alphabetical order
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/company", authMiddleware, companyRoutes);
router.use("/clients", authMiddleware, clientRoutes);
router.use("/invoices", authMiddleware, invoiceRoutes);
router.use("/invoice-items", authMiddleware, invoiceItemRoutes);

export default router;
