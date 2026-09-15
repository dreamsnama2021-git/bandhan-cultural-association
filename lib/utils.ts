import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

let counter = 0;

export function generateId(prefix: string): string {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}${counter}-${rand}`;
}

export function generateMemberId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BCA-${new Date().getFullYear()}-${rand}`;
}

export function generateOrderId(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ORD${rand}`;
}

export function generateTransactionId(): string {
  const rand = Math.floor(100000000 + Math.random() * 900000000);
  return `TXN${rand}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10));
}

export function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
