import { RequestHandler } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

// Create uploads folder if it doesn't exist
const UPLOAD_FOLDER = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_FOLDER))
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });

// Generic Multer middleware
export const upload = (
  fieldName: string,
  destFolder = UPLOAD_FOLDER
): RequestHandler => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destFolder),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = file.originalname.replace(ext, "");
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  });

  return multer({ storage }).single(fieldName);
};
