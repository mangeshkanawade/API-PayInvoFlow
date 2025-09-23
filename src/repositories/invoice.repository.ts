import { BusinessModel } from "../models/business.model";
import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { InvoiceAmountModel } from "../models/invoiceamount.model";
import { InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "./base.repository";

export class InvoiceRepository extends BaseRepository<IInvoice> {
  constructor() {
    super(InvoiceModel);
  }

  override async findById(id: string): Promise<IInvoice | null> {
    const [invoice, items, business, invoiceAmounts] = (await Promise.all([
      InvoiceModel.findById(id)
        .populate("client")
        .populate("company")
        .lean()
        .exec(),
      InvoiceItemModel.find({ invoice: id }).lean().exec(),
      BusinessModel.findOne({ email: "payinvoflow@gmail.com" }).lean().exec(),
      InvoiceAmountModel.findOne({ invoice: id }).lean().exec(),
    ])) as any;

    if (!invoice) {
      return null;
    }

    return {
      ...invoice,
      items,
      business,
      invoiceAmounts,
    };
  }
}
