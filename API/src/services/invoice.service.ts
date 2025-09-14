import { Types } from "mongoose";
import { formatDate } from "../helper/dateFormator";
import { InvoiceCalculator } from "../helper/invoiceCalculator";
import { amountToWords } from "../helper/numberToWords";
import { pdfGenerator } from "../helper/pdfGenerator";
import { BusinessModel } from "../models/business.model";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceAmountModel } from "../models/invoiceamount.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";
import { generateInvoiceEmailTemplate } from "../utils/emailTemplates";
import { MailService } from "./mail.service";
export class InvoiceService extends BaseService<IInvoice> {
  constructor(public repo: BaseRepository<IInvoice>) {
    super(repo);
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

  async exportPdfFile(invoiceId: string): Promise<Buffer> {
    invoiceId = "68c54296d8dd4104c4ab4cb5";
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

    const pdfData = {
      company: {
        name: invoice.company?.companyName ?? "",
        gstin: invoice.company?.gstin ?? "",
        address: invoice.company?.address ?? "",
        stateCode: invoice.company?.stateCode ?? "",
        state: invoice.company?.state ?? "",
        logo: invoice.company?.logo ?? "",
        branch: invoice.company?.bankBranch ?? "",
        account: invoice.company?.accountNumber ?? "",
        ifsc: invoice.company?.ifscCode ?? "",
      },
      client: {
        name: invoice.client?.name ?? "",
        gstin: invoice.client?.gstin ?? "",
        address: invoice.client?.address ?? "",
        state: invoice.client?.state ?? "",
      },
      invoice: {
        number: invoice.invoiceNumber ?? "",
        date: invoice.invoiceDate
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
            cgst: invoiceAmount.cgstAmount,
            sgst: invoiceAmount.sgstAmount,
            grandTotal: invoiceAmount.grandTotal,
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

    return pdfGenerator(pdfData);
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

    await mailService.sendMail(
      client.email,
      `Invoice #${invoice.invoiceNumber} from ${company.companyName}`,
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
  }
}
