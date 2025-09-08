import { Request, Response } from "express";
import { BaseController } from "../controllers/base.controller";
import { IInvoiceItem, InvoiceItemModel } from "../models/invoiceitem.model";
import { BaseService } from "../services/base.service";

export class InvoiceItemController extends BaseController<IInvoiceItem> {
  constructor(service: BaseService<IInvoiceItem>) {
    super(service);
  }

  // Custom method: get all items for a given invoice
  getByInvoice = async (req: Request, res: Response) => {
    const { invoiceId } = req.params;
    const items = await InvoiceItemModel.find({ invoice: invoiceId });
    res.json(items);
  };
}
