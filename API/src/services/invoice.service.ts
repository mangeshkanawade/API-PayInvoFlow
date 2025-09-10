import * as fs from "fs";
import path from "path";
// import { create } from "pdf-creator-node";
import { pdfOptions } from "../helper/pdfOptions";
import { IClient } from "../models/client.model";
import { ICompany } from "../models/company.model";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";
const pdf = require("pdf-creator-node");

export class InvoiceService extends BaseService<IInvoice> {
  constructor(public repo: BaseRepository<IInvoice>, jwtSecret: string) {
    super(repo);
  }

  async history(filters: any) {
    return InvoiceModel.find(filters).populate("client").populate("company");
  }

  async updateStatus(id: string, status: string) {
    return InvoiceModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  buildInvoiceData(payload: any) {
    if (payload && typeof payload === "object") return payload;

    return {
      provider: {
        name: "Ansh Enterprises",
        gstin: "27BRFPK4610M1ZN",
        address: "A/p Karegaon MIDC, Tal - Shirur, Dist - Pune 412220",
        state: "Maharashtra",
        // Use either a base64 logo or leave empty to show the placeholder
        logo: "", // data URI or file path not used here; placeholder used in template
        // logoBase64: "" // if using data:image/png;base64,...
      },
      receiver: {
        name: "Hora Art Centre Pvt Ltd.",
        gstin: "27AABCH2273C1ZZ",
        address:
          "Plot No/E-30, MIDC Area Karegaon, Tal - Shirur, Dist - Pune 412220",
        state: "Maharashtra",
      },
      invoice: {
        taxNo: "AE-25-26-61",
        taxDate: "30/04/2025",
        number: "AE-25-26-61",
        date: "30/04/2025",
        period: "01/04/2025 - 30/04/2025",
        stateCode: "27",
        stateName: "Maharashtra",
      },
      summary: {
        totalEntries: 78,
        vehicles: "MH 12 PQ 7136, MH 12 PQ 1920",
        routes:
          "HORA-LG, EVARY-HORA, PG1, PG2, NGM, Amber, CML, PG4, Savera, Cariar, NEEL Ind. Shirwal",
      },
      bank: {
        name: "HDFC Bank",
        branch: "Karegaon, Shirur, Pune",
        account: "50200069436732",
        ifsc: "HDFC0003160",
      },
      items: [
        {
          sr: 1,
          date: "01/04/2025",
          vehicle: "MH 12 PQ 7136",
          particulars: "HORA - LG",
          amount: "600.00",
        },
        {
          sr: 2,
          date: "02/04/2025",
          vehicle: "MH 12 PQ 1920",
          particulars: "EVARY - HORA",
          amount: "1400.00",
        },
        {
          sr: 3,
          date: "02/04/2025",
          vehicle: "MH 12 PQ 7136",
          particulars: "HORA - PG1 - PG2 - NGM - PG4 - Amber - EML",
          amount: "1800.00",
        },
        // ... add rows up to 78 as per invoice
      ],
      totals: {
        subtotal: "107000.00",
        cgst: "6420.00",
        sgst: "6420.00",
        grand: "119840.00",
        inWords:
          "One Lakh Nineteen Thousand Eight Hundred Forty Four Rupees Only",
      },
    };
  }

  async exportPdf(id: string): Promise<Buffer> {
    // 1. Fetch invoice with relations
    const invoice = await InvoiceModel.findById(id)
      .populate<{ client: IClient }>("client")
      .populate<{ company: ICompany }>("company")
      .lean();

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // 2. Fetch items
    const items = await InvoiceItemModel.find({ invoice: invoice._id }).lean();

    // 3. Build invoice data object
    const subtotal = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * item.amount,
      0
    );
    const tax = (subtotal * 20) / 100;
    const grandTotal = subtotal + tax;

    const invoiceData = {
      invoice,
      items,
      totals: {
        subtotal,
        tax,
        grandTotal,
      },
    };

    try {
      // 4. Load HTML template
      const templatePath = path.join(__dirname, "../views/template.html");
      const html = await fs.promises.readFile(templatePath, "utf-8");

      // 5. Ensure docs directory exists
      const docsDir = path.join(__dirname, "../docs");
      await fs.promises.mkdir(docsDir, { recursive: true });

      // 6. Generate unique filename
      const filename = `${Date.now()}_${Math.floor(Math.random() * 1e6)}.pdf`;
      const filePath = path.join(docsDir, filename);

      // 7. Create PDF
      const document = {
        html,
        // data: invoiceData,
        data: this.buildInvoiceData(null),
        path: filePath,
        type: "buffer", // return as buffer
      };

      const result: Buffer = await pdf.create(document, pdfOptions);
      // result is the PDF Buffer since type = "buffer"

      // 8. Optionally, also save the file for public access
      await fs.promises.writeFile(filePath, result);

      return result;
    } catch (err) {
      console.error("PDF generation failed:", err);
      throw new Error("PDF generation failed");
    }
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
