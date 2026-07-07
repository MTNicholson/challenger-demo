import "server-only";

import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export const BRAND_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export function getImageFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

export function validateBrandImage(file: File, label: string) {
  if (!allowedImageTypes.has(file.type)) {
    return `${label}: загрузите изображение JPG, PNG или WebP.`;
  }

  if (file.size > BRAND_IMAGE_MAX_SIZE) {
    return `${label}: файл должен быть не больше 5 МБ.`;
  }

  return null;
}

export async function saveBrandImage(file: File, prefix: string) {
  const extension = allowedImageTypes.get(file.type);
  if (!extension) return null;

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "brands");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${prefix}-${Date.now()}-${randomBytes(8).toString("hex")}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  return `/uploads/brands/${filename}`;
}
