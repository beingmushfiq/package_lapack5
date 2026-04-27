import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(price).replace("BDT", "৳");
}
export function getImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:8000${path}`;
}
