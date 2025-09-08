import fs from "fs";
import PDFDocument from "pdfkit";
import puppeteer from "puppeteer";

/**
 * Generate a PDF buffer from HTML content
 * @param htmlCode string containing HTML content
 * @returns Buffer of generated PDF
 */
export function pdfGenerator(htmlCode: string): Buffer {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Uint8Array[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.on("error", reject);

    // --- PDF content ---
    doc.fontSize(20).text("Generated PDF", { align: "center" });
    doc.moveDown();

    // Strip HTML tags for basic rendering
    const textContent = htmlCode.replace(/<[^>]+>/g, "");
    doc.fontSize(12).text(textContent, { align: "left" });

    doc.end();
  }) as unknown as Buffer;
}

export async function pdfGenerator_Puppeteer(
  htmlFilePath: string
): Promise<Buffer> {
  const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Cast result to Buffer to satisfy TypeScript
  const pdfBuffer = (await page.pdf({
    format: "A4",
    printBackground: true,
  })) as Buffer;

  await browser.close();
  return pdfBuffer;
}
