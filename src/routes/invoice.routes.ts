import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { InvoiceService } from "../services/invoice.service";

const router = Router();

// Wiring repo → service → controller
const repo = new InvoiceRepository();
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
router
  .route("/")
  .get((req, res) => controller.getAll(req, res))
  .post((req, res) => controller.create(req, res));

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
  .get((req, res) => controller.getById(req, res))
  .put((req, res) => controller.update(req, res))
  .delete((req, res) => controller.delete(req, res));

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
router.get("/:id/pdf", (req, res) => controller.exportPdfFile(req, res));

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
 * @swagger
 * /invoices/{invoiceId}/send-email:
 *   post:
 *     summary: Send invoice email to client
 *     description: Sends the invoice email with PDF attachment to the client associated with the given invoiceId.
 *     tags:
 *       - Invoices
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the invoice to email
 *     responses:
 *       200:
 *         description: Invoice email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Invoice email sent
 *       500:
 *         description: Server error while sending invoice email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invoice not found
 */
router.post("/:invoiceId/send-email", controller.sendInvoiceEmail);
/**
 * @swagger
 * /invoices/preview:
 *   post:
 *     summary: Preview Invoice (Encrypted HTML)
 *     description: Generates a preview of the invoice and returns encrypted HTML.
 *     tags:
 *       - Invoices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreviewInvoiceRequest'
 *     responses:
 *       200:
 *         description: Encrypted HTML generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 html:
 *                   type: string
 *                   description: Encrypted HTML string
 *                   example: "r0O9i3kB8jZ4y8F6TnF1Vg==:Q9lHw8zE8vC6m4U4Y9XKug=="
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     PreviewInvoiceRequest:
 *       type: object
 *       required:
 *         - company
 *         - client
 *         - items
 *       properties:
 *         company:
 *           type: string
 *           example: "64f89acdb21e8e8e12345678"
 *         client:
 *           type: string
 *           example: "64f89bcd1234abcd56781234"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceItem'
 *
 *     InvoiceItem:
 *       type: object
 *       required:
 *         - date
 *         - particulars
 *         - vehicleNo
 *         - quantity
 *         - rate
 *         - amount
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-09-25"
 *         particulars:
 *           type: string
 *           example: "Transport service"
 *         vehicleNo:
 *           type: string
 *           example: "MH12AB1234"
 *         quantity:
 *           type: integer
 *           example: 5
 *         rate:
 *           type: number
 *           example: 1200
 *         amount:
 *           type: number
 *           example: 6000
 */
router.post("/preview", (req, res) => controller.previewInvoice(req, res));

export default router;
