import { formatDate } from "../helper/dateFormator";
import { IBusiness } from "../models/business.model";
import { IClient } from "../models/client.model";
import { ICompany } from "../models/company.model";

export function generateInvoiceEmailTemplate(
  company: ICompany,
  client: IClient,
  invoiceNumber: string,
  invoiceDate: string,
  dueDate: string,
  amount: number,
  business: IBusiness
): string {
  return `
  <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">

    <!-- General Message (Always Visible) -->
    <p>Dear <b>${client.name}</b>,</p>
    <p>
      Please find attached your invoice <b>#${invoiceNumber}</b> 
      dated <b>${formatDate(
        new Date(invoiceDate)
      )}</b> with a due date of <b>${formatDate(
    new Date(dueDate)
  )}) dueDate}</b>.
    </p>
    <p><b>Total Amount:</b> ₹${amount.toFixed(2)}</p>
    <p>If payment is already made, kindly ignore this email.</p>

    <!-- Company Info -->
    <p style="margin-top:20px;">Best regards,</p>
    <p><b>${company.name}</b><br/>
    ${company.email} | ${company.phone}</p>

    <!-- Business Promotion -->
    <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;"/>
    <p style="font-size:13px; color:#555;">
      ✨ This invoice is powered by <b>${business.name}</b>  
      ${business.description ? `– ${business.description}` : ""}
    </p>

    <!-- Footer -->
    <p style="font-size:11px; color:#777; margin-top:20px;">
      This is an automated email. Please do not reply.
    </p>
  </div>
  `;
}
