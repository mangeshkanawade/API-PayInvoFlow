import * as fs from "fs";
import path from "path";
import { pdfGenerator } from "../helper/pdfGenerator";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";
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

  async exportPdfFile(): Promise<Buffer> {
    const invoiceData = await this.buildInvoiceData();
    return await pdfGenerator(invoiceData);
  }

  async buildInvoiceData() {
    const logoPath = path.join(__dirname, "../images/logo.png");
    const logoBuffer = await fs.promises.readFile(logoPath);
    const logoBase64 = logoBuffer.toString("base64");

    return {
      provider: {
        name: "Ansh Enterprises",
        gstin: "27BRFPK4610M1ZN",
        address: "A/p Karegaon MIDC, Tal - Shirur, Dist - Pune 412220",
        state: "Maharashtra",
        logo: logoBase64,
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
}
