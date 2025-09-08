import PDFDocument from "pdfkit";
import { IClient } from "../models/client.model";
import { ICompany } from "../models/company.model";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseService } from "../services/base.service";

export class InvoiceService extends BaseService<IInvoice> {
  async history(filters: any) {
    return InvoiceModel.find(filters).populate("client").populate("company");
  }

  async updateStatus(id: string, status: string) {
    return InvoiceModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async exportPdf(id: string): Promise<Buffer> {
    const invoice = await InvoiceModel.findById(id)
      .populate<{ client: IClient }>("client")
      .populate<{ company: ICompany }>("company")
      .lean();

    if (!invoice) throw new Error("Invoice not found");

    const items = await InvoiceItemModel.find({ invoice: invoice._id });

    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    return new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // ===== Invoice Header =====
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
      doc.text(`Date: ${invoice.invoiceDate.toDateString()}`);
      doc.moveDown();

      // ===== Client Details =====
      const client = invoice.client as unknown as IClient;
      doc.fontSize(14).text("Client:", { underline: true });
      if (client) {
        doc.text(`Name: ${client.name}`);
        doc.text(`Email: ${client.email}`);
        doc.text(`Phone: ${client.phone}`);
        doc.text(`Address: ${client.address}`);
        doc.text(`GSTIN: ${client.gstin}`);
      }
      doc.moveDown();

      // ===== Company Details =====
      const company = invoice.company as unknown as ICompany;
      doc.fontSize(14).text("Company:", { underline: true });
      if (company) {
        doc.text(`Name: ${company.companyName}`);
        doc.text(`Email: ${company.email}`);
        doc.text(`Phone: ${company.phone}`);
        doc.text(`GSTIN: ${company.gstin}`);
        doc.text(`Bank: ${company.bankName}, Branch: ${company.bankBranch}`);
        doc.text(
          `Account No: ${company.accountNumber}, IFSC: ${company.ifscCode}`
        );
      }
      doc.moveDown();

      // ===== Items =====
      doc.fontSize(14).text("Items:", { underline: true });
      items.forEach((item, i) => {
        doc.text(
          `${i + 1}. ${item.particulars} | Amount: ₹${
            item.amount
          } | Date: ${item.date.toDateString()}`
        );
      });
      doc.moveDown();

      // ===== Totals =====
      doc.fontSize(14).text(`Subtotal: ₹${invoice.subtotal}`);
      doc.text(`CGST (${invoice.cgstRate}%): ₹${invoice.cgstAmount}`);
      doc.text(`SGST (${invoice.sgstRate}%): ₹${invoice.sgstAmount}`);
      doc.text(`Grand Total: ₹${invoice.grandTotal}`);
      doc.text(`Amount in Words: ${invoice.amountInWords}`);

      doc.end();
    });
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
}
