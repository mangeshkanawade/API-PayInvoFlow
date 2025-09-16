import { del, head, put } from "@vercel/blob";
import { ENV } from "../config/env";
export class VercelBlobService {
  private token: string;

  constructor() {
    if (!ENV.BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        "Vercel Blob: No token found. Set BLOB_READ_WRITE_TOKEN environment variable"
      );
    }
    this.token = ENV.BLOB_READ_WRITE_TOKEN;
  }

  /**
   * Upload a file buffer to Vercel Blob
   * @param key Path in blob storage, e.g. "company-logos/logo.png"
   * @param fileBuffer File content as Buffer
   * @param contentType MIME type
   */
  async uploadFile(
    key: string,
    fileBuffer: Buffer,
    contentType: string
  ): Promise<string> {
    const blob = await put(key, fileBuffer, {
      access: "public",
      contentType,
      token: this.token,
    });

    return blob.url; // Return public URL
  }

  /**
   * Get metadata of a file from blob storage
   * @param key Path in blob storage
   */
  async getFileMetadata(key: string): Promise<any> {
    const metadata = await head(key, { token: this.token });
    return metadata;
  }

  /**
   * Delete a file from blob storage
   * @param key Path in blob storage
   */
  async deleteFile(key: string): Promise<void> {
    await del(key, { token: this.token });
  }
}
