import { format, toZonedTime } from "date-fns-tz";

export function formatDate(date: any): string {
  if (!date) return "";

  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);

  return format(zonedDate, "dd-MM-yyyy");
}
