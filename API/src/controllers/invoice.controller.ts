import { Request, Response } from "express";
import * as fs from "fs";
import { pdfGenerator_Puppeteer } from "../helper/pdfGenerator";
import { IInvoice } from "../models/invoice.model";
import { InvoiceService } from "../services/invoice.service";
import { BaseController } from "./base.controller";

export class InvoiceController extends BaseController<IInvoice> {
  private invoiceService: InvoiceService;

  constructor(service: InvoiceService) {
    super(service);
    this.invoiceService = service;
  }

  // Fetch invoice history
  history = async (req: Request, res: Response) => {
    const result = await this.invoiceService.history(req.query);
    res.json(result);
  };

  // Update invoice status
  updateStatus = async (req: Request, res: Response) => {
    const result = await this.invoiceService.updateStatus(
      req.params.id,
      req.body.status
    );
    res.json(result);
  };

  // Export invoice as PDF
  exportPdf = async (req: Request, res: Response) => {
    const pdfBuffer = await this.invoiceService.exportPdf(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  };

  // Convert uploaded HTML → PDF
  htmltopdf = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send({ message: "HTML file is required" });
      }

      const htmlContent = fs.readFileSync(file.path, "utf8");
      const pdfBuffer = await pdfGenerator_Puppeteer(htmlContent);

      fs.unlinkSync(file.path); // cleanup temp file

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${file.originalname.replace(/\.html?$/, ".pdf")}`
      );
      res.send(pdfBuffer);
    } catch (err: any) {
      res.status(500).send({ message: err.message });
    }
  };

  // Get invoices by Client ID
  getByClient = async (req: Request, res: Response) => {
    const result = await this.invoiceService.getByClient(req.params.clientId);
    res.json(result);
  };

  // Get invoices by Company ID
  getByCompany = async (req: Request, res: Response) => {
    const result = await this.invoiceService.getByCompany(req.params.companyId);
    res.json(result);
  };
}
