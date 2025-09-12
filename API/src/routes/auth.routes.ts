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
 *                 example: payinvoflow@gmail.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *     responses:
 *       200:
 *         description: JWT token and user info
 */
router.post("/login", UserController.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *                 example: payinvoflow@gmail.com
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
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: payinvoflow@gmail.com
 *     responses:
 *       200:
 *         description: Reset token sent to email
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", UserController.forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: NewPass@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", UserController.resetPassword);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", UserController.refreshToken);

export default router;
