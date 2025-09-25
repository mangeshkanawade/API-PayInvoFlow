import { Types } from "mongoose";
import { PreviewInvoiceRequest } from "../dtos/previewInvoiceRequest";
import { formatDate } from "../helper/dateFormator";
import { encrypt } from "../helper/encryptionHelper";
import { htmlGenerator } from "../helper/htmlGeneratorFromTemplate";
import { InvoiceCalculator } from "../helper/invoiceCalculator";
import { amountToWords } from "../helper/numberToWords";
import { pdfGenerator } from "../helper/pdfGenerator";
import { BusinessModel, IBusiness } from "../models/business.model";
import { ClientModel, IClient } from "../models/client.model";
import { CompanyModel, ICompany } from "../models/company.model";
import { EmailLogModel } from "../models/emailLog.model";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceAmountModel } from "../models/invoiceamount.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "../repositories/base.repository";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { BaseService } from "../services/base.service";
import { generateInvoiceEmailTemplate } from "../utils/emailTemplates";
import { CompanyService } from "./company.service";
import { MailService } from "./mail.service";
export class InvoiceService extends BaseService<IInvoice> {
  private companyService: CompanyService;
  private clientService: BaseService<IClient>;
  private bussinessRepository: BaseRepository<IBusiness>;

  constructor(public repo: InvoiceRepository) {
    super(repo);
    this.companyService = new CompanyService(
      new BaseRepository<ICompany>(CompanyModel)
    );
    this.clientService = new BaseService<IClient>(
      new BaseRepository<IClient>(ClientModel)
    );
    this.bussinessRepository = new BaseRepository<IBusiness>(BusinessModel);
  }

  async history(filters: any) {
    return InvoiceModel.find(filters).populate("client").populate("company");
  }

  async updateStatus(id: string, status: string) {
    return InvoiceModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async exportPdf(id: string): Promise<Buffer> {
    return Buffer.alloc(0);
  }

  async getByClient(clientId: string) {
    return InvoiceModel.find({ client: clientId }).populate("client company");
  }

  async getByCompany(companyId: string) {
    return InvoiceModel.find({ company: companyId }).populate("client company");
  }

  // Item Handling (moved to InvoiceItemModel)
  async addItem(invoiceId: string, item: any) {
    return InvoiceItemModel.create({ ...item, invoice: invoiceId });
  }

  async updateItem(invoiceId: string, itemId: string, item: any) {
    return InvoiceItemModel.findOneAndUpdate(
      { _id: itemId, invoice: invoiceId },
      item,
      { new: true }
    );
  }

  async removeItem(invoiceId: string, itemId: string) {
    return InvoiceItemModel.findOneAndDelete({
      _id: itemId,
      invoice: invoiceId,
    });
  }

  async getInvoiceDetails(invoiceId: string) {
    if (!Types.ObjectId.isValid(invoiceId)) {
      throw new Error("Invalid invoice ID");
    }

    // Run queries in parallel
    const [invoice, items, business, invoiceAmounts] = (await Promise.all([
      InvoiceModel.findById(invoiceId)
        .populate("client")
        .populate("company")
        .lean()
        .exec(),
      InvoiceItemModel.find({ invoice: invoiceId }).lean().exec(),
      BusinessModel.findOne({ email: "payinvoflow@gmail.com" }).lean().exec(),
      InvoiceAmountModel.findOne({ invoice: invoiceId }).lean().exec(),
    ])) as any;

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const subtotalAmt = items.reduce(
      (sum: any, i: any) => sum + (i.amount ?? 0),
      0
    );

    const { subtotal, cgstAmount, sgstAmount, grandTotal, amountInWords } =
      await InvoiceCalculator.calculateTotals(
        subtotalAmt,
        invoice?.cgstRate,
        invoice?.sgstRate
      );

    await InvoiceAmountModel.replaceOne(
      { invoice: invoice._id },
      {
        invoice: invoice._id,
        subtotal,
        cgstAmount,
        sgstAmount,
        grandTotal,
        amountInWords,
      },
      { upsert: true }
    );

    const invoiceAmount = (await InvoiceAmountModel.findOne({
      invoice: invoiceId,
    })
      .lean()
      .exec()) as any;

    const data = {
      company: {
        name: invoice.company?.name ?? "",
        gstin: invoice.company?.gstin ?? "",
        address: invoice.company?.address ?? "",
        stateCode: invoice.company?.stateCode ?? "",
        state: invoice.company?.state ?? "",
        logo: invoice.company?.logo ?? "",
        bankBranch: invoice.company?.bankBranch ?? "",
        accountNumber: invoice.company?.accountNumber ?? "",
        ifscCode: invoice.company?.ifscCode ?? "",
      },
      client: {
        name: invoice.client?.name ?? "",
        gstin: invoice.client?.gstin ?? "",
        address: invoice.client?.address ?? "",
        state: invoice.client?.state ?? "",
      },
      invoice: {
        invoiceNumber: invoice.invoiceNumber ?? "",
        invoiceDate: invoice.invoiceDate
          ? formatDate(new Date(invoice.invoiceDate))
          : "",
        status: invoice.status ?? "Draft",
        cgstRate: invoice.cgstRate ?? 0,
        sgstRate: invoice.sgstRate ?? 0,
      },
      invoiceItems: items.map((item: any, idx: number) => ({
        sr: idx + 1,
        date: item.date ? formatDate(new Date(item.date)) : "",
        vehicleNo: item.vehicleNo ?? "",
        particulars: item.particulars ?? "",
        quantity: item.quantity ?? 0,
        rate: item.rate ?? 0,
        amount: item.amount ?? 0,
      })),
      totals: invoiceAmount
        ? {
            subtotal: invoiceAmount.subtotal,
            cgstAmount: invoiceAmount.cgstAmount,
            sgstAmount: invoiceAmount.sgstAmount,
            grandTotal: invoiceAmount.grandTotal.toFixed(2),
            amountInWords: amountToWords(invoiceAmount.grandTotal),
          }
        : {},
      business: {
        name: business?.name ?? "",
        email: business?.email ?? "",
        ownerName: business?.ownerName ?? "",
        contact: business?.contact ?? "",
        logo: business?.logo ?? "",
      },
    };

    return data;
  }

  async exportPdfFile(invoiceId: string): Promise<Buffer> {
    const pdfData = await this.getInvoiceDetails(invoiceId);

    const html = await htmlGenerator(pdfData);
    return await pdfGenerator(html);
  }

  async previewInvoice(
    previewInvoiceRequest: PreviewInvoiceRequest
  ): Promise<string> {
    const company = await this.companyService.getById(
      previewInvoiceRequest.company
    );
    const client = await this.clientService.getById(
      previewInvoiceRequest.client
    );

    const business = (
      await this.bussinessRepository.findAll({
        email: "payinvoflow@gmail.com",
      })
    )[0];

    const subtotalAmt = previewInvoiceRequest.items.reduce(
      (sum: any, i: any) => sum + (i.amount ?? 0),
      0
    );

    const { subtotal, cgstAmount, sgstAmount, grandTotal, amountInWords } =
      await InvoiceCalculator.calculateTotals(
        subtotalAmt,
        company?.cgstRate,
        company?.sgstRate
      );

    const invoiceData = {
      company: {
        name: company?.name ?? "xxxxx xxxxx",
        gstin: company?.gstin ?? "xxxxxxxxx",
        address: company?.address ?? "xxxxxxxxxxxxx",
        stateCode: company?.stateCode ?? "xx",
        state: company?.state ?? "xxxxxxxx",
        logo: company?.logo ?? "",
        bankBranch: company?.bankBranch ?? "xxxxxxxxxxxxx",
        accountNumber: company?.accountNumber ?? "xxxxxxxxxxxx",
        ifscCode: company?.ifscCode ?? "xxxxxxxxx",
      },
      client: {
        name: client?.name ?? "xxxxxxxx",
        gstin: client?.gstin ?? "xxxxxxxxxx",
        address: client?.address ?? "xxxxxxxxxx",
        state: client?.state ?? "xxxxxxxxx",
      },
      invoice: {
        invoiceNumber: "xxxx",
        invoiceDate: "xx-xx-xxxx",
        cgstRate: company?.cgstRate ?? 0,
        sgstRate: company?.sgstRate ?? 0,
      },
      invoiceItems: previewInvoiceRequest.items.map(
        (item: any, idx: number) => ({
          sr: idx + 1,
          date: item.date ? formatDate(new Date(item.date)) : "",
          vehicleNo: item.vehicleNo ?? "",
          particulars: item.particulars ?? "",
          quantity: item.quantity ?? 0,
          rate: item.rate ?? 0,
          amount: item.amount ?? 0,
        })
      ),
      totals: {
        subtotal: subtotal,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        grandTotal: grandTotal.toFixed(2),
        amountInWords: amountToWords(grandTotal),
      },
      business: {
        name: business?.name ?? "",
        email: business?.email ?? "",
        ownerName: business?.ownerName ?? "",
        contact: business?.contact ?? "",
        logo: business?.logo ?? "",
      },
    };

    // Generate HTML
    const html = await htmlGenerator(invoiceData);

    // Encrypt before returning
    const encryptedHtml = encrypt(html);

    return encryptedHtml;
  }

  async sendInvoiceEmail(invoiceId: string) {
    const [invoice, items, business, invoiceAmounts] = (await Promise.all([
      InvoiceModel.findById(invoiceId)
        .populate("client")
        .populate("company")
        .lean()
        .exec(),
      InvoiceItemModel.find({ invoice: invoiceId }).lean().exec(),
      BusinessModel.findOne({ email: "payinvoflow@gmail.com" }).lean().exec(),
      InvoiceAmountModel.findOne({ invoice: invoiceId }).lean().exec(),
    ])) as any;

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const client = invoice.client;
    const company = invoice.company;

    const subtotalAmt = items.reduce(
      (sum: any, i: any) => sum + (i.amount ?? 0),
      0
    );

    const { subtotal, cgstAmount, sgstAmount, grandTotal, amountInWords } =
      await InvoiceCalculator.calculateTotals(
        subtotalAmt,
        invoice?.cgstRate,
        invoice?.sgstRate
      );

    await InvoiceAmountModel.replaceOne(
      { invoice: invoice._id },
      {
        invoice: invoice._id,
        subtotal,
        cgstAmount,
        sgstAmount,
        grandTotal,
        amountInWords,
      },
      { upsert: true }
    );

    const invoiceAmount = (await InvoiceAmountModel.findOne({
      invoice: invoiceId,
    })
      .lean()
      .exec()) as any;

    const pdfBuffer = await this.exportPdfFile(invoiceId);

    const mailService = new MailService();

    try {
      await mailService.sendMail(
        client.email,
        `Invoice #${invoice.invoiceNumber} from ${company.name}`,
        "Please find attached your invoice.",
        generateInvoiceEmailTemplate(
          company,
          client,
          invoice.invoiceNumber,
          invoice.invoiceDate,
          new Date().setDate(new Date().getDate() + 30).toString(),
          invoiceAmount.grandTotal,
          business
        ),
        [
          {
            filename: `Invoice-${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
          },
        ]
      );

      console.log("✅ Invoice email sent to:", client.email);

      // Log success
      await EmailLogModel.create({
        to: client.email,
        subject: `Invoice #${invoice.invoiceNumber} from ${company.name}`,
        body: `Please find attached your invoice.`,
        attachments: [`Invoice-${invoice.invoiceNumber}.pdf`],
        sentAt: new Date(),
        status: "SENT",
      });
    } catch (error: any) {
      console.error("❌ Failed to send invoice email:", error);

      // Log failure
      await EmailLogModel.create({
        to: client.email,
        subject: `Invoice #${invoice.invoiceNumber} from ${company.name}`,
        body: `Please find attached your invoice.`,
        attachments: [`Invoice-${invoice.invoiceNumber}.pdf`],
        sentAt: new Date(),
        status: "FAILED",
        errorMessage: error.message,
      });

      throw error; // rethrow if you want controller to handle
    }
  }
}
