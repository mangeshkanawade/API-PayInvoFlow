import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { BaseRepository } from "../repositories/base.repository";
import { InvoiceService } from "../services/invoice.service";

const router = Router();

// Wiring repo → service → controller
const repo = new BaseRepository<IInvoice>(InvoiceModel);
const service = new InvoiceService(repo);
const controller = new InvoiceController(service);

/**
 * @openapi
 * tags:
 *   name: Invoices
 *   description: API for managing invoices
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - invoiceNumber
 *         - invoiceDate
 *         - client
 *         - company
 *         - subtotal
 *         - cgstAmount
 *         - sgstAmount
 *         - grandTotal
 *         - amountInWords
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated invoice ID
 *         invoiceNumber:
 *           type: string
 *           example: AE-25-26-61
 *         invoiceDate:
 *           type: string
 *           format: date
 *           example: 2025-04-30
 *         client:
 *           type: string
 *           description: Reference to Client ID
 *         company:
 *           type: string
 *           description: Reference to Company ID
 *         subtotal:
 *           type: number
 *           example: 107000
 *         cgstRate:
 *           type: number
 *           example: 6
 *         sgstRate:
 *           type: number
 *           example: 6
 *         cgstAmount:
 *           type: number
 *           example: 6420
 *         sgstAmount:
 *           type: number
 *           example: 6420
 *         grandTotal:
 *           type: number
 *           example: 119840
 *         amountInWords:
 *           type: string
 *           example: One Lakh Nineteen Thousand Eight Hundred Forty Rupees Only
 *         status:
 *           type: string
 *           enum: [Draft, Paid, Cancelled]
 *           example: Draft
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// ================= Routes ================= //

/**
 * @openapi
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.route("/").get(controller.getAll).post(controller.create);

/**
 * @openapi
 * /invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *   put:
 *     summary: Update invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *   delete:
 *     summary: Delete invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 */
router
  .route("/:id")
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.delete);

/**
 * @openapi
 * /invoices/history:
 *   get:
 *     summary: Get invoice history
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: List of past invoices
 */
router.get("/history", controller.history);

/**
 * @openapi
 * /invoices/{id}/status:
 *   put:
 *     summary: Update invoice status
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Draft, Paid, Cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put("/:id/status", controller.updateStatus);

/**
 * @openapi
 * /invoices/{id}/pdf:
 *   get:
 *     summary: Export invoice as PDF
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generated successfully
 */
router.get("/:id/pdf", controller.exportPdfFile);

/**
 * @openapi
 * /invoices/client/{clientId}:
 *   get:
 *     summary: Get invoices by client
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of invoices for the client
 */
router.get("/client/:clientId", controller.getByClient);

/**
 * @openapi
 * /invoices/company/{companyId}:
 *   get:
 *     summary: Get invoices by company
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of invoices for the company
 */
router.get("/company/:companyId", controller.getByCompany);

// Temp Need to removelater

/**
 * @openapi
 * /pdf:
 *   get:
 *     summary: Export invoice as PDF
 *     tags: [PDF]
 *     responses:
 *       200:
 *         description: PDF generated successfully
 */
router.get("/pdf", controller.exportPdfFile);

/**
 * @openapi
 * /googledrive:
 *   get:
 *     summary: Google Drive Service
 *     tags: [Google Drive]
 *     responses:
 *       200:
 *         description: Google Drive Service
 */
router.get("/googledrive", controller.googleDrive);

export default router;
