import { Request, Response } from "express";
import { ENV } from "../config/env";
import { GoogleDriveService } from "../services/googledrive.service";

export class GoogleDriveController {
  // List files in a Google Drive folder
  async listFiles(req: Request, res: Response) {
    const svc = new GoogleDriveService();
    try {
      const files = await svc.listFiles(ENV.GOOGLE_DRIVE_FOLDER_ID);
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: "Failed to list Google Drive files." });
    }
  }

  // Download a file from Google Drive
  async downloadFile(req: Request, res: Response) {
    const svc = new GoogleDriveService();
    const fileId = req.params.id;
    try {
      const file = await svc.downloadFile(fileId);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.name}"`
      );
      res.setHeader("Content-Type", file.mimeType);
      res.send(file.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to download file." });
    }
  }

  // Upload a file to Google Drive
  async uploadFile(req: Request, res: Response) {
    const svc = new GoogleDriveService();
    try {
      // Assuming file is available in req.file (using multer or similar middleware)
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const uploaded = await svc.uploadFileFromBuffer(
        file.buffer,
        file.originalname,
        file.mimetype,
        ENV.GOOGLE_DRIVE_FOLDER_ID
      );
      res.json({ uploaded });
    } catch (error) {
      res.status(500).json({ error: `Failed to upload file. => ${error}` });
    }
  }

  // Delete a file from Google Drive
  async deleteFile(req: Request, res: Response) {
    const svc = new GoogleDriveService();
    const fileId = req.params.id;
    try {
      await svc.deleteFile(fileId);
      res.json({ message: "File deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file." });
    }
  }
}
