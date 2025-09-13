import fs from "fs";
import { drive_v3, google } from "googleapis";
import mime from "mime-types";
import path from "path";
import { Readable } from "stream";
import { ENV } from "../config/env";

export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor() {
    const keyPath = path.resolve(
      ENV.GOOGLE_SERVICE_ACCOUNT_KEY ||
        "./src/config/google-drive-settings.json"
    );

    // Read the service account JSON
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

    // Use JWT auth directly (like your working example)
    const authClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    this.drive = google.drive({ version: "v3", auth: authClient });
  }

  /** List files inside a folder or Shared Drive */
  public async listFiles(folderId?: string): Promise<drive_v3.Schema$File[]> {
    const q = folderId
      ? `'${folderId}' in parents and trashed = false`
      : "trashed = false";

    const res = await this.drive.files.list({
      pageSize: 100,
      q,
      fields: "files(id, name, mimeType, size, parents, createdTime)",
      supportsAllDrives: true, // ⚡ important for Shared Drives
      includeItemsFromAllDrives: true, // ⚡ important for Shared Drives
    });

    return res.data.files || [];
  }

  /** Upload file from local path to Drive/Shared Drive */
  public async uploadFile(
    filePath: string,
    folderId?: string
  ): Promise<drive_v3.Schema$File | null> {
    const fileName = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    const res = await this.drive.files.create({
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : undefined,
      },
      media: {
        mimeType,
        body: fs.createReadStream(filePath),
      },
      fields: "id, name, mimeType, size",
      supportsAllDrives: true,
    });

    return res.data || null;
  }

  /** Upload file from buffer to Drive/Shared Drive */
  public async uploadFileFromBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folderId?: string
  ): Promise<drive_v3.Schema$File | null> {
    const res = await this.drive.files.create({
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : undefined,
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: "id, name, mimeType, size",
      supportsAllDrives: true,
    });

    return res.data || null;
  }

  /** Download file by ID */
  public async downloadFile(
    fileId: string
  ): Promise<{ data: Buffer; mimeType: string; name: string }> {
    const fileMeta = await this.drive.files.get({
      fileId,
      fields: "name, mimeType",
      supportsAllDrives: true,
    });

    const res = await this.drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" as any }
    );

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      (res.data as Readable)
        .on("data", (chunk) => chunks.push(Buffer.from(chunk)))
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    return {
      data: Buffer.concat(chunks),
      mimeType: fileMeta.data.mimeType || "application/octet-stream",
      name: fileMeta.data.name || "downloaded-file",
    };
  }

  /** Delete file by ID */
  public async deleteFile(fileId: string): Promise<void> {
    await this.drive.files.delete({
      fileId,
      supportsAllDrives: true,
    });
  }
}
