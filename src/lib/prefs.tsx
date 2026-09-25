import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Market = "India" | "Australia" | "UAE" | "UK" | "Bali";
export type Currency = "INR" | "AUD" | "AED" | "GBP" | "IDR";

export const MARKETS: readonly Market[] = ["India", "Australia", "UAE", "UK", "Bali"];
export const MARKET_CURRENCY: Record<Market, Currency> = {
  India: "INR",
  Australia: "AUD",
  UAE: "AED",
  UK: "GBP",
  Bali: "IDR",
};

export const MARKET_CITIES: Record<Market, readonly string[]> = {
  India: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", "Pune", "Goa"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"],
  UK: ["London", "Manchester", "Birmingham", "Edinburgh"],
  Bali: ["Canggu", "Seminyak", "Ubud", "Uluwatu", "Sanur"],
};

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Plot",
  "Land",
  "Commercial",
  "Farm Land",
] as const;

type PrefsValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const PrefsContext = createContext<PrefsValue>({
  currency: "INR",
  setCurrency: () => {},
});

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("concrest.currency");
    if (Object.values(MARKET_CURRENCY).includes(saved as Currency)) setCurrency(saved as Currency);
  }, []);

  useEffect(() => {
    localStorage.setItem("concrest.currency", currency);
  }, [currency]);

  return (
    <PrefsContext.Provider value={{ currency, setCurrency }}>
      {children}
    </PrefsContext.Provider>
  );
}

export const usePrefs = () => useContext(PrefsContext);

export function formatPrice(
  currency: Currency,
  prices: Partial<Record<Currency, number | null | undefined>>,
) {
  const value = prices[currency];
  if (value == null) return "Price on request";
  if (currency === "INR") return `₹ ${indianCompact(value)}`;
  if (currency === "IDR") return `Rp ${compact(value)}`;
  const symbol = currency === "GBP" ? "£" : currency;
  return `${symbol} ${compact(value)}`;
}

function indianCompact(value: number) {
  if (value >= 10000000) return `${trim(value / 10000000)} Cr`;
  if (value >= 100000) return `${trim(value / 100000)} L`;
  return value.toLocaleString("en-IN");
}

function compact(value: number) {
  if (value >= 1000000) return `${trim(value / 1000000)} M`;
  if (value >= 1000) return `${trim(value / 1000)} K`;
  return value.toLocaleString("en-US");
}

function trim(n: number) {
  return n.toFixed(2).replace(/\.00$/, "").replace(/0$/, "").replace(/\.$/, "");
}
