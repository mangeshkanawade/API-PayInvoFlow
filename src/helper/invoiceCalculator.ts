import { amountToWords } from "./numberToWords";

export interface InvoiceTotals {
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  grandTotal: number;
  amountInWords: string;
}

export class InvoiceCalculator {
  /**
   * Calculate invoice totals including GST and words conversion.
   * @param subtotal Invoice Subtotal
   * @param cgstRate Central GST rate (e.g. 6)
   * @param sgstRate State GST rate (e.g. 6)
   */
  static calculateTotals(
    subtotal: number,
    cgstRate: number = 0,
    sgstRate: number = 0
  ): InvoiceTotals {
    const cgstAmount = (subtotal * (cgstRate || 0)) / 100;
    const sgstAmount = (subtotal * (sgstRate || 0)) / 100;
    const grandTotal = subtotal + cgstAmount + sgstAmount;

    return {
      subtotal,
      cgstAmount,
      sgstAmount,
      grandTotal,
      amountInWords: amountToWords(grandTotal),
    };
  }
}
