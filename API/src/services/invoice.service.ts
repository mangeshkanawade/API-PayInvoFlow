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

    const businessLogoPath = path.join(__dirname, "../images/payinvoflow.png");
    const businessLogoBuffer = await fs.promises.readFile(businessLogoPath);
    const businessLogoBase64 = businessLogoBuffer.toString("base64");

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

        {
          sr: 29,
          date: "15/04/2025",
          vehicle: "MH 12 PQ 1946",
          particulars: "Amber - HORA",
          amount: "3300.00",
        },
        {
          sr: 30,
          date: "16/04/2025",
          vehicle: "MH 12 PQ 1947",
          particulars: "EML - PG1",
          amount: "3400.00",
        },
        {
          sr: 31,
          date: "16/04/2025",
          vehicle: "MH 12 PQ 1948",
          particulars: "PG2 - PG3",
          amount: "3500.00",
        },
        {
          sr: 32,
          date: "17/04/2025",
          vehicle: "MH 12 PQ 1949",
          particulars: "PG4 - Amber",
          amount: "3600.00",
        },
        {
          sr: 33,
          date: "17/04/2025",
          vehicle: "MH 12 PQ 1950",
          particulars: "HORA - EML",
          amount: "3700.00",
        },
        {
          sr: 34,
          date: "18/04/2025",
          vehicle: "MH 12 PQ 1951",
          particulars: "PG1 - PG2",
          amount: "3800.00",
        },
        {
          sr: 35,
          date: "18/04/2025",
          vehicle: "MH 12 PQ 1952",
          particulars: "PG3 - PG4",
          amount: "3900.00",
        },
        {
          sr: 36,
          date: "19/04/2025",
          vehicle: "MH 12 PQ 1953",
          particulars: "Amber - HORA",
          amount: "4000.00",
        },
        {
          sr: 37,
          date: "19/04/2025",
          vehicle: "MH 12 PQ 1954",
          particulars: "EML - PG1",
          amount: "4100.00",
        },
        {
          sr: 38,
          date: "20/04/2025",
          vehicle: "MH 12 PQ 1955",
          particulars: "PG2 - PG3",
          amount: "4200.00",
        },
        {
          sr: 39,
          date: "20/04/2025",
          vehicle: "MH 12 PQ 1956",
          particulars: "PG4 - Amber",
          amount: "4300.00",
        },
        {
          sr: 40,
          date: "21/04/2025",
          vehicle: "MH 12 PQ 1957",
          particulars: "HORA - EML",
          amount: "4400.00",
        },
        {
          sr: 41,
          date: "21/04/2025",
          vehicle: "MH 12 PQ 1958",
          particulars: "PG1 - PG2",
          amount: "4500.00",
        },
        {
          sr: 42,
          date: "22/04/2025",
          vehicle: "MH 12 PQ 1959",
          particulars: "PG3 - PG4",
          amount: "4600.00",
        },
        {
          sr: 43,
          date: "22/04/2025",
          vehicle: "MH 12 PQ 1960",
          particulars: "Amber - HORA",
          amount: "4700.00",
        },
        {
          sr: 44,
          date: "23/04/2025",
          vehicle: "MH 12 PQ 1961",
          particulars: "EML - PG1",
          amount: "4800.00",
        },
        {
          sr: 45,
          date: "23/04/2025",
          vehicle: "MH 12 PQ 1962",
          particulars: "PG2 - PG3",
          amount: "4900.00",
        },
        {
          sr: 46,
          date: "24/04/2025",
          vehicle: "MH 12 PQ 1963",
          particulars: "PG4 - Amber",
          amount: "5000.00",
        },
        {
          sr: 47,
          date: "24/04/2025",
          vehicle: "MH 12 PQ 1964",
          particulars: "HORA - EML",
          amount: "5100.00",
        },
        {
          sr: 48,
          date: "25/04/2025",
          vehicle: "MH 12 PQ 1965",
          particulars: "PG1 - PG2",
          amount: "5200.00",
        },
        {
          sr: 49,
          date: "25/04/2025",
          vehicle: "MH 12 PQ 1966",
          particulars: "PG3 - PG4",
          amount: "5300.00",
        },
        {
          sr: 50,
          date: "26/04/2025",
          vehicle: "MH 12 PQ 1967",
          particulars: "Amber - HORA",
          amount: "5400.00",
        },
        {
          sr: 51,
          date: "26/04/2025",
          vehicle: "MH 12 PQ 1968",
          particulars: "EML - PG1",
          amount: "5500.00",
        },
        {
          sr: 52,
          date: "27/04/2025",
          vehicle: "MH 12 PQ 1969",
          particulars: "PG2 - PG3",
          amount: "5600.00",
        },
        {
          sr: 33,
          date: "17/04/2025",
          vehicle: "MH 12 PQ 1950",
          particulars: "HORA - EML",
          amount: "3700.00",
        },
        {
          sr: 34,
          date: "18/04/2025",
          vehicle: "MH 12 PQ 1951",
          particulars: "PG1 - PG2",
          amount: "3800.00",
        },
        {
          sr: 35,
          date: "18/04/2025",
          vehicle: "MH 12 PQ 1952",
          particulars: "PG3 - PG4",
          amount: "3900.00",
        },
        {
          sr: 36,
          date: "19/04/2025",
          vehicle: "MH 12 PQ 1953",
          particulars: "Amber - HORA",
          amount: "4000.00",
        },
        {
          sr: 37,
          date: "19/04/2025",
          vehicle: "MH 12 PQ 1954",
          particulars: "EML - PG1",
          amount: "4100.00",
        },
        {
          sr: 38,
          date: "20/04/2025",
          vehicle: "MH 12 PQ 1955",
          particulars: "PG2 - PG3",
          amount: "4200.00",
        },
        {
          sr: 39,
          date: "20/04/2025",
          vehicle: "MH 12 PQ 1956",
          particulars: "PG4 - Amber",
          amount: "4300.00",
        },
        {
          sr: 40,
          date: "21/04/2025",
          vehicle: "MH 12 PQ 1957",
          particulars: "HORA - EML",
          amount: "4400.00",
        },
        {
          sr: 41,
          date: "21/04/2025",
          vehicle: "MH 12 PQ 1958",
          particulars: "PG1 - PG2",
          amount: "4500.00",
        },
        {
          sr: 42,
          date: "22/04/2025",
          vehicle: "MH 12 PQ 1959",
          particulars: "PG3 - PG4",
          amount: "4600.00",
        },
        {
          sr: 43,
          date: "22/04/2025",
          vehicle: "MH 12 PQ 1960",
          particulars: "Amber - HORA",
          amount: "4700.00",
        },
        {
          sr: 44,
          date: "23/04/2025",
          vehicle: "MH 12 PQ 1961",
          particulars: "EML - PG1",
          amount: "4800.00",
        },
        {
          sr: 45,
          date: "23/04/2025",
          vehicle: "MH 12 PQ 1962",
          particulars: "PG2 - PG3",
          amount: "4900.00",
        },
        {
          sr: 46,
          date: "24/04/2025",
          vehicle: "MH 12 PQ 1963",
          particulars: "PG4 - Amber",
          amount: "5000.00",
        },
        {
          sr: 53,
          date: "27/04/2025",
          vehicle: "MH 12 PQ 1970",
          particulars: "PG4 - Amber",
          amount: "5700.00",
        },
      ],
      totals: {
        subtotal: "107000.00",
        cgst: "6420.00",
        sgst: "6420.00",
        grand: "119840.00",
        inWords:
          "One Lakh Nineteen Thousand Eight Hundred Forty Four Rupees Only",
      },
      business: {
        name: "PayInvoFlow",
        email: "payinvoflow@gmail.com",
        contact: "+91 7507456876",
        logo: businessLogoBase64,
      },
    };
  }
}
