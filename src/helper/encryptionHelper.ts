// Backend
import CryptoJS from "crypto-js";
import { ENV } from "../config/env";

const SECRET_KEY = ENV.ENCRYPTION_KEY ?? "";

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
