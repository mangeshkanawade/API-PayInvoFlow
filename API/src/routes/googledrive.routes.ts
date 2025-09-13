import { Router } from "express";
import multer from "multer";
import { GoogleDriveController } from "../controllers/googledrive.controller";

const router = Router();
const controller = new GoogleDriveController();
const upload = multer(); // Use memory storage for buffer uploads

/**
 * @swagger
 * /drive/files:
 *   get:
 *     summary: List files in Google Drive folder
 *     tags: [GoogleDrive]
 *     responses:
 *       200:
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to list files
 */
router.get("/files", controller.listFiles.bind(controller));

/**
 * @swagger
 * /drive/files/{id}:
 *   get:
 *     summary: Download a file from Google Drive
 *     tags: [GoogleDrive]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to download file
 */
router.get("/files/:id", controller.downloadFile.bind(controller));

/**
 * @swagger
 * /drive/files:
 *   post:
 *     summary: Upload a file to Google Drive
 *     tags: [GoogleDrive]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploaded:
 *                   type: object
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to upload file
 */
router.post(
  "/files",
  upload.single("file"),
  controller.uploadFile.bind(controller)
);

/**
 * @swagger
 * /drive/files/{id}:
 *   delete:
 *     summary: Delete a file from Google Drive
 *     tags: [GoogleDrive]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete file
 */
router.delete("/files/:id", controller.deleteFile.bind(controller));

export default router;
