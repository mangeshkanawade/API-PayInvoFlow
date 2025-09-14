import { Router } from "express";
import { BaseController } from "../controllers/base.controller";
import { ClientModel, IClient } from "../models/client.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";

const router = Router();

// Generic wiring
const repo = new BaseRepository<IClient>(ClientModel);
const service = new BaseService(repo);
const controller = new BaseController(service);

/**
 * @openapi
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - email
 *         - phone
 *         - gstin
 *         - state
 *         - stateCode
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated client ID
 *         name:
 *           type: string
 *           example: John Doe
 *         address:
 *           type: string
 *           example: 123, Business Street, Pune
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: "+91-9876543210"
 *         gstin:
 *           type: string
 *           minLength: 15
 *           maxLength: 15
 *           example: 27AABCU9603R1ZM
 *         state:
 *           type: string
 *           example: Maharashtra
 *         stateCode:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           example: 27
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 */

/**
 * @openapi
 * tags:
 *   name: Clients
 *   description: API for managing clients
 */

/**
 * @openapi
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of clients retrieved successfully
 *   post:
 *     summary: Create a client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client created successfully
 */
router.route("/").get(controller.getAll).post(controller.create);

/**
 * @openapi
 * /clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client retrieved successfully
 *       404:
 *         description: Client not found
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
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
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 */
router
  .route("/:id")
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.delete);

export default router;
