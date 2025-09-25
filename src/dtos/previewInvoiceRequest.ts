export interface PreviewInvoiceRequest {
  company: string;
  client: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  date: Date;
  particulars: string;
  vehicleNo: string;
  quantity: number;
  rate: number;
  amount: number;
}
