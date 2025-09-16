import multer from "multer";

// Memory storage keeps file in RAM (good for small files)
export const upload = multer({ storage: multer.memoryStorage() });
