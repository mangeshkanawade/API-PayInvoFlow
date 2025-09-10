import * as fs from "fs";
import path from "path";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";

import chromium from "@sparticuz/chromium";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import puppeteerCore, { LaunchOptions } from "puppeteer-core";
// import puppeteerCore from "puppeteer-core";

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

  buildInvoiceData() {
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
    try {
      // 1. Load HTML template
      const templatePath = path.join(__dirname, "../views/template.html");
      const htmlTemplate = await fs.promises.readFile(templatePath, "utf-8");

      // 2. Compile template with Handlebars
      const template = Handlebars.compile(htmlTemplate);
      const val = this.buildInvoiceData();
      const html = template({
        ...val,
      });

      // 3. Launch Puppeteer
      // const browser = await puppeteer.launch({
      //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // });
      // const page = await browser.newPage();

      // Fallback for executablePath

      // const executablePath =
      //   process.env.NODE_ENV === "production"
      //     ? (await chromium.executablePath) || "/usr/bin/chromium-browser"
      //     : puppeteer.executablePath();

      // const browser = await puppeteer.launch({
      //   args: process.env.NODE_ENV === "production" ? chromium.args : [],
      //   defaultViewport: chromium.defaultViewport,
      //   // executablePath,
      //   executablePath: await chromium.executablePath,
      //   headless: true,
      // });

      // const page = await browser.newPage();

      // 3. launch
      const isProd =
        process.env.VERCEL_ENV === "production" ||
        process.env.NODE_ENV === "production";
      const browser = isProd
        ? await puppeteerCore.launch({
            args: [...chromium.args, "--disable-gpu", "--no-sandbox"],
            defaultViewport: {
              width: 1280,
              height: 800,
              deviceScaleFactor: 1,
              isMobile: false,
              hasTouch: false,
              isLandscape: false,
            },
            executablePath: await chromium.executablePath(), // note: function call
            headless: "shell",
          } satisfies LaunchOptions)
        : await puppeteer.launch({ channel: "chrome", headless: true });

      const page = await browser.newPage();
      // 4. Set HTML content
      await page.setContent(html, { waitUntil: "load" });

      // 5. Generate PDF buffer
      const pdfBuffer = Buffer.from(
        await page.pdf({
          format: "A4",
          printBackground: true,
        })
      );

      await browser.close();

      return pdfBuffer;
    } catch (err) {
      console.error("PDF generation failed:", err);
      throw new Error("PDF generation failed. " + err);
    }
  }
}
