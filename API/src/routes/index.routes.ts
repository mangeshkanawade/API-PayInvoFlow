import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";
import { authMiddleware } from "../middleware/auth";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { BaseRepository } from "../repositories/base.repository";
import { InvoiceService } from "../services/invoice.service";
import authRoutes from "./auth.routes";
import clientRoutes from "./client.routes";
import companyRoutes from "./company.routes";
import invoiceRoutes from "./invoice.routes";
import invoiceItemRoutes from "./invoiceItem.routes";
import userRoutes from "./user.routes";

const router = Router();

// Alphabetical order
router.use("/auth", authRoutes);
router.use("/users", authMiddleware, userRoutes);
router.use("/company", authMiddleware, companyRoutes);
router.use("/clients", authMiddleware, clientRoutes);
router.use("/invoices", authMiddleware, invoiceRoutes);
router.use("/invoice-items", authMiddleware, invoiceItemRoutes);

//Temp Code

const repo = new BaseRepository<IInvoice>(InvoiceModel);
const service = new InvoiceService(repo);
const controller = new InvoiceController(service);
router.get("/pdf", controller.exportPdfFile);

export default router;
