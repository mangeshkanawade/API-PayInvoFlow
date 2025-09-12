import { IInvoice, InvoiceModel } from "../models/invoice.model";
import { BaseRepository } from "./base.repository";

export class InvoiceRepository extends BaseRepository<IInvoice> {
  constructor() {
    super(InvoiceModel);
  }
}
