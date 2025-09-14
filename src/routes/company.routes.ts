import { Router } from "express";
import { BaseController } from "../controllers/base.controller";
import { CompanyModel, ICompany } from "../models/company.model";
import { BaseRepository } from "../repositories/base.repository";
import { CompanyService } from "../services/company.service";

const router = Router();

// Layered wiring
const repo = new BaseRepository<ICompany>(CompanyModel);
const service = new CompanyService(repo);
const controller = new BaseController(service);

/**
 * @openapi
 * tags:
 *   name: Company
 *   description: API for managing company information
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - email
 *         - phone
 *         - gstin
 *         - state
 *         - stateCode
 *         - bankName
 *         - bankBranch
 *         - accountNumber
 *         - ifscCode
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated company ID
 *         name:
 *           type: string
 *           example: Ansh Enterprises
 *         address:
 *           type: string
 *           example: A/p Karegaon MIDC, Tal - Shirur, Dist - Pune 412220
 *         email:
 *           type: string
 *           format: email
 *           example: info@anshenterprises.com
 *         phone:
 *           type: string
 *           example: "+91-9876543210"
 *         gstin:
 *           type: string
 *           example: 27BRFPK4610M1ZN
 *         state:
 *           type: string
 *           example: Maharashtra
 *         stateCode:
 *           type: string
 *           example: 27
 *         bankName:
 *           type: string
 *           example: HDFC Bank
 *         bankBranch:
 *           type: string
 *           example: Karegaon, Shirur, Pune
 *         accountNumber:
 *           type: string
 *           example: 50200069436732
 *         ifscCode:
 *           type: string
 *           example: HDFC0003160
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /company:
 *   get:
 *     summary: Get all companies
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.route("/").get(controller.getAll).post(controller.create);

/**
 * @openapi
 * /company/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *   put:
 *     summary: Update company by ID
 *     tags: [Company]
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
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *   delete:
 *     summary: Delete company by ID
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 */
router
  .route("/:id")
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.delete);

export default router;
