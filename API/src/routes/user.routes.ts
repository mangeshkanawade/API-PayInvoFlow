import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique user ID
 *         username:
 *           type: string
 *           description: Username of the user
 *         name:
 *           type: string
 *           description: Full name of the user
 *         phone:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           description: Email address
 *       required:
 *         - _id
 *         - username
 *         - name
 *         - email
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               name:
 *                 type: string
 *                 example: user
 *               phone:
 *                 type: string
 *                 example: 7894561230
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *               role:
 *                 type: string
 *                 enum: [Admin, Biller, Viewer]
 *                 example: Viewer
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", UserController.register);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDTO'
 *       500:
 *         description: Server error
 */
router.get("/", UserController.getAll);

/**
 * @swagger
 * /users/username/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/username/:username", UserController.getByUsername);

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/email/:email", UserController.getByUserEmail);

export default router;
