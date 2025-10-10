import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeFileSize(file: File) {
  switch (true) {
    case file.size < 1024: // Less than 1KB
      return `${file.size.toFixed(2)} B`;
    case file.size < 1024 * 1024: // Less than 1MB
      return `${(file.size / 1024).toFixed(2)} KB`;
    case file.size < 1024 * 1024 * 1024: // Less than 1GB
      return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    default:
      return `${(file.size / 1024).toFixed(2)} KB`;
  }
}

export const serverUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/v1";
