// src/helpers/seedHelper.ts
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { BusinessModel } from "../models/business.model";
import { ClientModel } from "../models/client.model";
import { CompanyModel } from "../models/company.model";
import { InvoiceModel } from "../models/invoice.model";
import { InvoiceAmountModel } from "../models/invoiceamount.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { amountToWords } from "./numberToWords";

export class SeedHelper {
  static async run() {
    // Convert logo.png (Company Logo)
    const logoPath = path.join(__dirname, "../../public/images/logo.png");
    const logoBuffer = await fs.promises.readFile(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    // Convert payinvoflow.png (Business Logo)
    const businessLogoPath = path.join(
      __dirname,
      "../../public/images/payinvoflow.png"
    );
    const businessLogoBuffer = await fs.promises.readFile(businessLogoPath);
    const businessLogoBase64 = `data:image/png;base64,${businessLogoBuffer.toString(
      "base64"
    )}`;

    try {
      // Clear collections first (optional)
      await Promise.all([
        BusinessModel.deleteMany({}),
        ClientModel.deleteMany({}),
        CompanyModel.deleteMany({}),
        InvoiceModel.deleteMany({}),
        InvoiceItemModel.deleteMany({}),
        InvoiceAmountModel.deleteMany({}),
      ]);

      //   // Insert Business
      const business = await BusinessModel.create({
        name: "PayInvoFlow",
        email: "payinvoflow@gmail.com",
        ownerName: "Mangesh Kanawade",
        contact: "+91-9876543210",
        description:
          "PayInvoFlow is a smart Payment Invoice Generator designed to simplify and automate invoice management for your business.",
        logo: businessLogoBase64,
      });

      // Insert Client
      const client = await ClientModel.create({
        name: "HORA Industries",
        address: "123 Market Street, Pune",
        email: "contact@horaindustries.com",
        phone: "+91-9123456780",
        gstin: "27ABCDE1234F1Z5",
        state: "Maharashtra",
        stateCode: "27",
      });

      // Insert Company
      const company = await CompanyModel.create({
        companyName: "Ansh Enterpries",
        address: "Karegaon, Pune Maharashtra",
        email: "anshenterpries@gmail.com",
        phone: "+91-9988776655",
        gstin: "27XYZAB1234C1Z6",
        state: "Maharashtra",
        stateCode: "27",
        bankName: "State Bank of India",
        bankBranch: "Pune",
        accountNumber: "123456789012",
        ifscCode: "SBIN0001234",
        logo: logoBase64,
      });

      // Insert Invoice
      const invoice = await InvoiceModel.create({
        invoiceNumber: "INV-2025-001",
        invoiceDate: new Date("2025-09-05"),
        client: client._id,
        company: company._id,
        cgstRate: 6.0,
        sgstRate: 6.0,
        status: "Draft",
      });

      // Insert InvoiceItems
      const items = await InvoiceItemModel.insertMany([
        {
          invoice: invoice._id,
          date: new Date("2025-09-01"),
          particulars: "Transportation of goods from Pune to Mumbai",
          vehicleNo: "MH12AB1234",
          invoiceNo: "TR-2025-001",
          quantity: 10,
          rate: 5000,
          amount: 50000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-02"),
          particulars: "Loading & Unloading Charges",
          vehicleNo: "MH12AB5678",
          invoiceNo: "TR-2025-002",
          quantity: 1,
          rate: 6000,
          amount: 6000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-03"),
          particulars: "Transportation of steel coils from Nashik to Pune",
          vehicleNo: "MH14CD4321",
          invoiceNo: "TR-2025-003",
          quantity: 8,
          rate: 4500,
          amount: 36000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-04"),
          particulars: "Driver Night Halt Charges",
          vehicleNo: "MH12XY9876",
          invoiceNo: "TR-2025-004",
          quantity: 1,
          rate: 2000,
          amount: 2000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-05"),
          particulars: "Transportation of machinery from Aurangabad to Pune",
          vehicleNo: "MH20ZZ1111",
          invoiceNo: "TR-2025-005",
          quantity: 12,
          rate: 5200,
          amount: 62400,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-06"),
          particulars: "Packing and Handling Services",
          vehicleNo: "MH21TT2233",
          invoiceNo: "TR-2025-006",
          quantity: 1,
          rate: 4500,
          amount: 4500,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-07"),
          particulars: "Transportation of furniture from Pune to Bangalore",
          vehicleNo: "KA01MN8899",
          invoiceNo: "TR-2025-007",
          quantity: 15,
          rate: 4800,
          amount: 72000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-08"),
          particulars: "Toll Charges",
          vehicleNo: "MH12KL5566",
          invoiceNo: "TR-2025-008",
          quantity: 1,
          rate: 1200,
          amount: 1200,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-09"),
          particulars: "Courier & Documentation Services",
          vehicleNo: "MH12GH3344",
          invoiceNo: "TR-2025-009",
          quantity: 1,
          rate: 900,
          amount: 900,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-10"),
          particulars: "Transportation of chemicals from Pune to Hyderabad",
          vehicleNo: "TS09YY7654",
          invoiceNo: "TR-2025-010",
          quantity: 20,
          rate: 5500,
          amount: 110000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-11"),
          particulars: "Container Transportation Charges",
          vehicleNo: "MH12CC9988",
          invoiceNo: "TR-2025-011",
          quantity: 2,
          rate: 15000,
          amount: 30000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-12"),
          particulars: "Transportation of textile goods from Surat to Pune",
          vehicleNo: "GJ01HH4455",
          invoiceNo: "TR-2025-012",
          quantity: 18,
          rate: 4000,
          amount: 72000,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-13"),
          particulars: "Insurance Charges for Shipment",
          vehicleNo: "MH12PP7788",
          invoiceNo: "TR-2025-013",
          quantity: 1,
          rate: 3500,
          amount: 3500,
        },
        {
          invoice: invoice._id,
          date: new Date("2025-09-14"),
          particulars: "Transportation of electronics from Pune to Chennai",
          vehicleNo: "TN09UU1122",
          invoiceNo: "TR-2025-014",
          quantity: 25,
          rate: 6000,
          amount: 150000,
        },
      ]);

      // Calculate totals
      const subtotal = items.reduce((sum, i) => sum + (i.amount || 0), 0);
      const cgstAmount = (subtotal * (invoice.cgstRate || 0)) / 100;
      const sgstAmount = (subtotal * (invoice.sgstRate || 0)) / 100;
      const grandTotal = subtotal + cgstAmount + sgstAmount;

      // Insert InvoiceAmount
      await InvoiceAmountModel.create({
        invoice: invoice._id,
        subtotal,
        cgstAmount,
        sgstAmount,
        grandTotal,
        amountInWords: amountToWords(grandTotal),
      });

      console.log("✅ Seeding completed successfully!");
    } catch (err) {
      console.error("❌ Seeding failed:", err);
    } finally {
      mongoose.connection.close();
    }
  }
}
