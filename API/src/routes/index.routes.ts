import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import clientRoutes from "./client.routes";
import billerRoutes from "./company.routes";
import invoiceRoutes from "./invoice.routes";
import invoiceItemRoutes from "./invoiceItem.routes";
import userRoutes from "./user.routes";

const router = Router();

// Alphabetical order
router.use("/auth", userRoutes);
router.use("/users", userRoutes);
router.use("/company", authMiddleware, billerRoutes);
router.use("/clients", authMiddleware, clientRoutes);
router.use("/invoices", authMiddleware, invoiceRoutes);
router.use("/invoice-items", authMiddleware, invoiceItemRoutes);

export default router;
