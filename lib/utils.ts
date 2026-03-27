import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefix: string, length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' //-- without confusing chars
  let result = prefix.toUpperCase()
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateCode(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz"; //-- without confusing chars
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function shortenText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export function toSentenceCase(text: string) {
  const str = text.replaceAll("_", " ").toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDayMonth_fromDate(date: Date) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}-${d.toLocaleString("en-US", { month: "short" })}`;
}

export function formatDayMonth(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    .replace(" ", "/");
}

export function formatDateFull(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}