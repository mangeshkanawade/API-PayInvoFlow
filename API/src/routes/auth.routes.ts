import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and get JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *     responses:
 *       200:
 *         description: JWT token and user info
 */
router.post("/login", UserController.login);

export default router;
