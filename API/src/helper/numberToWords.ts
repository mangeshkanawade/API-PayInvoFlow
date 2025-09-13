import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: "en-IN", // Indian English formatting
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false, // Adds "Only" at the end
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

/**
 * Convert a numeric amount into words (Indian Rupees format).
 * @param amount number value (e.g. 62400.50)
 * @returns formatted words string
 */
export function amountToWords(amount: number): string {
  if (isNaN(amount)) {
    return amount.toString();
  }
  return toWords.convert(amount);
}
