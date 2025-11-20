import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Create uploads directory if it doesn't exist
const uploadsDir = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
} else {
  console.log(`Uploads directory exists: ${uploadsDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp_randomUUID.extension
    const ext = path.extname(file.originalname) || ".jpg"; // Default to .jpg if no extension
    const uniqueName = `${Date.now()}_${randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter - only allow images
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, GIF, WebP)"));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Helper to get the public URL for an uploaded file
export function getImageUrl(filename: string): string {
  return `/attached_assets/uploads/${filename}`;
}

// Helper to delete an uploaded file
export function deleteImage(filename: string): boolean {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

// Helper to extract filename from URL
export function extractFilenameFromUrl(url: string): string | null {
  // Extract filename from URLs like /attached_assets/uploads/filename.jpg
  const match = url.match(/\/attached_assets\/uploads\/([^/?]+)/);
  return match ? match[1] : null;
}

