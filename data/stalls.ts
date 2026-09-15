import type { Stall } from "@/types";

const productFullPricing = { first5: 15000, last5: 20000, full10: 25000 };
const productHalfPricing = { full10: 15000 };
const foodFullPricing = { first5: 20000, last5: 30000, full10: 35000 };
const foodHalfPricing = { full10: 20000 };

export const stalls: Stall[] = [
  { id: "a1", code: "A1", size: "10x10 ft", sizeType: "full", location: "Row A — Product Stalls, Near Main Gate", category: "Product", status: "available", pricing: productFullPricing },
  { id: "a2", code: "A2", size: "10x10 ft", sizeType: "full", location: "Row A — Product Stalls, Near Main Gate", category: "Product", status: "reserved", pricing: productFullPricing },
  { id: "a3", code: "A3", size: "10x10 ft", sizeType: "full", location: "Row A — Product Stalls, Near Main Gate", category: "Product", status: "available", pricing: productFullPricing },
  { id: "a4", code: "A4", size: "5x10 ft", sizeType: "half", location: "Row A — Product Stalls, Near Main Gate", category: "Product", status: "sold-out", pricing: productHalfPricing },

  { id: "b1", code: "B1", size: "10x10 ft", sizeType: "full", location: "Row B — Product Stalls, Central Walkway", category: "Product", status: "available", pricing: productFullPricing },
  { id: "b2", code: "B2", size: "5x10 ft", sizeType: "half", location: "Row B — Product Stalls, Central Walkway", category: "Product", status: "available", pricing: productHalfPricing },
  { id: "b3", code: "B3", size: "10x10 ft", sizeType: "full", location: "Row B — Product Stalls, Central Walkway", category: "Product", status: "reserved", pricing: productFullPricing },
  { id: "b4", code: "B4", size: "10x10 ft", sizeType: "full", location: "Row B — Product Stalls, Central Walkway", category: "Product", status: "available", pricing: productFullPricing },

  { id: "c1", code: "C1", size: "10x10 ft", sizeType: "full", location: "Row C — Food Stalls, Near Stage", category: "Food", status: "available", pricing: foodFullPricing },
  { id: "c2", code: "C2", size: "5x10 ft", sizeType: "half", location: "Row C — Food Stalls, Near Stage", category: "Food", status: "sold-out", pricing: foodHalfPricing },
  { id: "c3", code: "C3", size: "10x10 ft", sizeType: "full", location: "Row C — Food Stalls, Near Stage", category: "Food", status: "available", pricing: foodFullPricing },
  { id: "c4", code: "C4", size: "10x10 ft", sizeType: "full", location: "Row C — Food Stalls, Near Stage", category: "Food", status: "reserved", pricing: foodFullPricing },

  { id: "d1", code: "D1", size: "10x10 ft", sizeType: "full", location: "Row D — Food Stalls, Exit Side", category: "Food", status: "available", pricing: foodFullPricing },
  { id: "d2", code: "D2", size: "5x10 ft", sizeType: "half", location: "Row D — Food Stalls, Exit Side", category: "Food", status: "available", pricing: foodHalfPricing },
  { id: "d3", code: "D3", size: "10x10 ft", sizeType: "full", location: "Row D — Food Stalls, Exit Side", category: "Food", status: "available", pricing: foodFullPricing },
  { id: "d4", code: "D4", size: "10x10 ft", sizeType: "full", location: "Row D — Food Stalls, Exit Side", category: "Food", status: "reserved", pricing: foodFullPricing },
];
