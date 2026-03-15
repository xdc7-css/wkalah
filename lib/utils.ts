import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArabicDigits(num: string | number | null | undefined): string {
  if (num === null || num === undefined) return "";
  const str = String(num);
  const map: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
  };
  return str.replace(/[0-9]/g, (w) => map[w]);
}

export function toWesternDigits(num: string | number | null | undefined): string {
  if (num === null || num === undefined) return "";
  const str = String(num);
  const map: Record<string, string> = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  return str.replace(/[٠-٩]/g, (w) => map[w]);
}

export function formatNumber(value: number | string | null | undefined, useArabicDigits = false) {
  const num = Number(value ?? 0);
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num);
  
  return useArabicDigits ? toArabicDigits(formatted) : formatted;
}

export function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export const monthOptions = [
  "1 — كانون الثاني",
  "2 — شباط",
  "3 — آذار",
  "4 — نيسان",
  "5 — أيار",
  "6 — حزيران",
  "7 — تموز",
  "8 — آب",
  "9 — أيلول",
  "10 — تشرين الأول",
  "11 — تشرين الثاني",
  "12 — كانون الأول",
];