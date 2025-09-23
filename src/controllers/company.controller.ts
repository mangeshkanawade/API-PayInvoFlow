import { Request, Response } from "express";
import { ICompany } from "../models/company.model";
import { CompanyService } from "../services/company.service";
import { BaseController } from "./base.controller";

export class CompanyController extends BaseController<ICompany> {
  private companyService: CompanyService;

  constructor(service: CompanyService) {
    super(service);
    this.companyService = service;
  }

  override async create(req: Request, res: Response): Promise<void> {
    try {
      // File comes from multer
      const logoFile = req.file;

      const companyData: Partial<ICompany> = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        gstin: req.body.gstin,
        state: req.body.state,
        stateCode: req.body.stateCode,
        bankName: req.body.bankName,
        bankBranch: req.body.bankBranch,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
        invoicePrefix: req.body.invoicePrefix,
        status: req.body.status,
      };

      const result = await this.companyService.createWithLogo(
        companyData,
        logoFile
      );
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  override async update(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.params.id;
      const logoFile = req.file;

      const companyData: Partial<ICompany> = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        gstin: req.body.gstin,
        state: req.body.state,
        stateCode: req.body.stateCode,
        bankName: req.body.bankName,
        bankBranch: req.body.bankBranch,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
        invoicePrefix: req.body.invoicePrefix,
        status: req.body.status,
      };

      const result = await this.companyService.updateWithLogo(
        companyId,
        companyData,
        logoFile
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
