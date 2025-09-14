import { Request, Response } from "express";
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

  exportPdfFile = async (req: Request, res: Response) => {
    const pdfBuffer = await this.invoiceService.exportPdfFile("");
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  };

  sendInvoiceEmail = async (req: Request, res: Response) => {
    try {
      const { invoiceId } = req.params;
      await this.invoiceService.sendInvoiceEmail(invoiceId);
      res.json({ success: true, message: "Invoice email sent" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
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
