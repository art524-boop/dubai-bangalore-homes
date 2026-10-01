import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Market = "India" | "Australia";
export type Currency = "INR" | "AUD";

export const MARKETS: readonly Market[] = ["India", "Australia"];
export const MARKET_CURRENCY: Record<Market, Currency> = {
  India: "INR",
  Australia: "AUD",
};

export const MARKET_CITIES: Record<Market, readonly string[]> = {
  India: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", "Pune", "Goa"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast"],
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
  const value = getPriceValue(currency, prices);
  if (value == null) return "Price on request";
  if (currency === "INR") return `₹ ${indianCompact(value)}`;
  return `${currency} ${compact(value)}`;
}

const INR_PER_UNIT: Record<Currency, number> = {
  INR: 1,
  AUD: 55,
};

export function getPriceValue(
  currency: Currency,
  prices: Partial<Record<Currency, number | null | undefined>>,
) {
  const exact = prices[currency];
  if (exact != null) return exact;

  const source = (Object.entries(prices) as [Currency, number | null | undefined][])
    .find(([, value]) => value != null);
  if (!source || source[1] == null) return null;
  const [sourceCurrency, sourceValue] = source;
  return Math.round((sourceValue * INR_PER_UNIT[sourceCurrency]) / INR_PER_UNIT[currency]);
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
