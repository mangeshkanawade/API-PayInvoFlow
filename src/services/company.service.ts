import { ICompany } from "../models/company.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "./base.service";
import { VercelBlobService } from "./vercel-blob.service";

export class CompanyService extends BaseService<ICompany> {
  private vercelBlobService: VercelBlobService;

  constructor(public repo: BaseRepository<ICompany>) {
    super(repo);
    this.vercelBlobService = new VercelBlobService();
  }

  async createWithLogo(
    data: Partial<ICompany>,
    file?: Express.Multer.File
  ): Promise<ICompany> {
    if (!data.name) {
      throw new Error("Company name is required");
    }

    let logoUrl: string | undefined;
    let logoKey: string | undefined;

    if (file) {
      logoKey = `company-logos/${Date.now()}-${file.originalname}`;

      const blobUrl = await this.vercelBlobService.uploadFile(
        logoKey,
        file.buffer,
        file.mimetype
      );

      logoUrl = blobUrl;
    }

    return super.create({
      ...data,
      logo: logoUrl ?? "",
      logoKey: logoKey ?? "",
    });
  }

  async updateWithLogo(
    id: string,
    data: Partial<ICompany>,
    file?: Express.Multer.File
  ): Promise<ICompany> {
    const company = await super.getById(id);
    if (!company) {
      throw new Error("Company not found");
    }

    let logoUrl = company.logo;
    let logoKey = company.logoKey;

    if (file) {
      // Remove old logo if exists
      if (logoKey) {
        await this.vercelBlobService
          .deleteFile(logoKey)
          .catch((err) => console.warn("Failed to delete old logo:", err));
      }

      // Upload new logo
      logoKey = `company-logos/${Date.now()}-${file.originalname}`;
      logoUrl = await this.vercelBlobService.uploadFile(
        logoKey,
        file.buffer,
        file.mimetype
      );
    }

    return super.update(id, {
      ...data,
      logo: logoUrl ?? "",
      logoKey: logoKey ?? "",
    }) as Promise<ICompany>;
  }

  override async delete(id: string): Promise<ICompany | null> {
    const company = await super.getById(id);
    if (!company) {
      return null;
    }

    if (company.logoKey) {
      await this.vercelBlobService.deleteFile(company.logoKey);
    }

    return super.delete(id);
  }
}
