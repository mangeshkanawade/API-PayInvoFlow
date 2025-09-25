import * as fs from "fs";
import Handlebars from "handlebars";
import path from "path";

export async function htmlGenerator(data: any): Promise<string> {
  try {
    // 1. Load HTML template
    const templatePath = path.join(
      __dirname,
      "../../public/views/template.html"
    );
    const htmlTemplate = await fs.promises.readFile(templatePath, "utf-8");

    // 2. Compile template with Handlebars
    const template = Handlebars.compile(htmlTemplate);

    // 3. Render with data
    const html = template({
      ...data,
    });

    return html;
  } catch (err) {
    console.error("HTML generation failed:", err);
    throw new Error("HTML generation failed. " + err);
  }
}
