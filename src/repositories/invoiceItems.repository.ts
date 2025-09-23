import { IInvoiceItem, InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseRepository } from "./base.repository";

export class InvoiceItemsRepository extends BaseRepository<IInvoiceItem> {
  constructor() {
    super(InvoiceItemModel);
  }

  async deleteByInvoice(invoiceId: string) {
    return InvoiceItemModel.deleteMany({ invoice: invoiceId });
  }
}
