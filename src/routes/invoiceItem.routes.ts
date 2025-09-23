import { Router } from "express";
import { InvoiceItemController } from "../controllers/invoiceItem.controller";
import { IInvoiceItem } from "../models/invoiceitem.model";
import { InvoiceItemsRepository } from "../repositories/invoiceItems.repository";
import { BaseService } from "../services/base.service";

const router = Router();

// Wiring repo → service → controller
const repo = new InvoiceItemsRepository();
const service = new BaseService<IInvoiceItem>(repo);
const controller = new InvoiceItemController(service);

/**
 * @openapi
 * tags:
 *   name: InvoiceItems
 *   description: API for managing invoice line items
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     InvoiceItem:
 *       type: object
 *       required:
 *         - invoice
 *         - date
 *         - particulars
 *         - amount
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated item ID
 *         invoice:
 *           type: string
 *           description: Reference to Invoice ID
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-04-05
 *         particulars:
 *           type: string
 *           example: HORA - PG1 - PG2 - NGM - Amber
 *         vehicleNo:
 *           type: string
 *           example: MH 12 PQ 7136
 *         invoiceNo:
 *           type: string
 *           example: AE-25-26-61
 *         quantity:
 *           type: number
 *           example: 2
 *         rate:
 *           type: number
 *           example: 1100
 *         amount:
 *           type: number
 *           example: 2200
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
 * /invoice-items:
 *   get:
 *     summary: Get all invoice items
 *     tags: [InvoiceItems]
 *     responses:
 *       200:
 *         description: List of invoice items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InvoiceItem'
 *   post:
 *     summary: Create a new invoice item
 *     tags: [InvoiceItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceItem'
 *     responses:
 *       201:
 *         description: Invoice item created successfully
 */
router.route("/").get(controller.getAll).post(controller.create);

/**
 * @openapi
 * /invoice-items/{id}:
 *   get:
 *     summary: Get invoice item by ID
 *     tags: [InvoiceItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice item retrieved successfully
 *   put:
 *     summary: Update invoice item by ID
 *     tags: [InvoiceItems]
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
 *             $ref: '#/components/schemas/InvoiceItem'
 *     responses:
 *       200:
 *         description: Invoice item updated successfully
 *   delete:
 *     summary: Delete invoice item by ID
 *     tags: [InvoiceItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice item deleted successfully
 */
router
  .route("/:id")
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.delete);

/**
 * @openapi
 * /invoice-items/invoice/{invoiceId}:
 *   get:
 *     summary: Get items by invoice ID
 *     tags: [InvoiceItems]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of items for the given invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InvoiceItem'
 */
router.get("/invoice/:invoiceId", controller.getByInvoice);

export default router;
