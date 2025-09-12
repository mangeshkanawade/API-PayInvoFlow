import * as fs from "fs";
import path from "path";

import chromium from "@sparticuz/chromium";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import puppeteerCore, { LaunchOptions } from "puppeteer-core";
import { ENV } from "../config/env";

export async function pdfGenerator(data: any): Promise<Buffer> {
  try {
    // 1. Load HTML template
    const templatePath = path.join(__dirname, "../public/views/template.html");
    const htmlTemplate = await fs.promises.readFile(templatePath, "utf-8");

    // 2. Compile template with Handlebars
    const template = Handlebars.compile(htmlTemplate);
    const html = template({
      ...data,
    });

    // 3. launch
    const isProd = ENV.NODE_ENV === "production";
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
        margin: { top: "10mm", bottom: "10mm" },
      })
    );

    await browser.close();

    return pdfBuffer;
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw new Error("PDF generation failed. " + err);
  }
}
