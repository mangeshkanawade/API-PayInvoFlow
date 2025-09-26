import { Request, Response } from "express";
import { PreviewInvoiceRequest } from "../dtos/previewInvoiceRequest";
import { CompanyModel, ICompany } from "../models/company.model";
import { IInvoice } from "../models/invoice.model";
import { BaseRepository } from "../repositories/base.repository";
import { InvoiceItemsRepository } from "../repositories/invoiceItems.repository";
import { BaseService } from "../services/base.service";
import { InvoiceService } from "../services/invoice.service";
import { IInvoiceItem } from "./../models/invoiceitem.model";
import { CompanyService } from "./../services/company.service";
import { BaseController } from "./base.controller";

export class InvoiceController extends BaseController<IInvoice> {
  private invoiceService: InvoiceService;
  private companyService: CompanyService;
  private invoiceItemRepository: InvoiceItemsRepository;
  private invoiceItemService: BaseService<IInvoiceItem>;

  constructor(service: InvoiceService) {
    super(service);
    this.invoiceService = service;
    // Initialize CompanyService
    const companyRepo = new BaseRepository<ICompany>(CompanyModel);
    this.companyService = new CompanyService(companyRepo);

    // Initialize InvoiceItemService
    this.invoiceItemRepository = new InvoiceItemsRepository();
    this.invoiceItemService = new BaseService<IInvoiceItem>(
      this.invoiceItemRepository
    );
  }

  override async create(req: Request, res: Response): Promise<void> {
    try {
      const companyInfo = await this.companyService.getById(req.body.company);

      const invoiceModel = {
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        client: req.body.client,
        company: req.body.company,
        cgstRate: companyInfo?.cgstRate ?? 6,
        sgstRate: companyInfo?.sgstRate ?? 6,
      };

      const invoice = await this.invoiceService.create(invoiceModel);

      const invoiceItemsModel = req.body.items.map((item: any) => ({
        invoice: invoice._id,
        date: item.date,
        particulars: item.particulars,
        vehicleNo: item.vehicleNo,
        invoiceNo: item.invoiceNo,
        quantity: item.quantity ?? 1,
        rate: item.rate,
        amount: (item.quantity ?? 1) * item.rate,
      }));

      invoiceItemsModel.forEach(async (item: any) => {
        await this.invoiceItemService.create(item);
      });

      res.status(201).json(invoice);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  override async update(req: Request, res: Response): Promise<void> {
    try {
      const invoiceId = req.params.id;
      const companyInfo = await this.companyService.getById(req.body.company);

      // Update invoice
      const invoiceModel = {
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        client: req.body.client,
        company: req.body.company,
        cgstRate: companyInfo?.cgstRate ?? 6,
        sgstRate: companyInfo?.sgstRate ?? 6,
      };

      const updatedInvoice = await this.invoiceService.update(
        invoiceId,
        invoiceModel
      );

      // Update invoice items
      const invoiceItems = req.body.items;

      // Optional: Remove old items if needed
      await this.invoiceItemRepository.deleteByInvoice(invoiceId);

      // Add new/updated items
      const invoiceItemsModel = invoiceItems.map((item: any) => ({
        invoice: invoiceId,
        date: item.date,
        particulars: item.particulars,
        vehicleNo: item.vehicleNo,
        invoiceNo: item.invoiceNo,
        quantity: item.quantity ?? 1,
        rate: item.rate,
        amount: (item.quantity ?? 1) * item.rate,
      }));

      for (const item of invoiceItemsModel) {
        await this.invoiceItemService.create(item);
      }

      res.status(200).json(updatedInvoice);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  override async getById(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await this.invoiceService.getById(req.params.id);
      if (!invoice) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async previewInvoice(req: Request, res: Response): Promise<void> {
    try {
      const previewInvoiceRequest = req.body as PreviewInvoiceRequest;
      const encryptedHtml = await this.invoiceService.previewInvoice(
        previewInvoiceRequest
      );
      res.json({ html: encryptedHtml });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
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
    const pdfBuffer = await this.invoiceService.exportPdfFile(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
    res.end();
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
