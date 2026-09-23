import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Currency = "INR" | "AED";
export type Audience = "Resident" | "NRI";

type PrefsValue = {
  currency: Currency;
  audience: Audience;
  setCurrency: (c: Currency) => void;
  setAudience: (a: Audience) => void;
};

const PrefsContext = createContext<PrefsValue>({
  currency: "INR",
  audience: "Resident",
  setCurrency: () => {},
  setAudience: () => {},
});

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [audience, setAudience] = useState<Audience>("Resident");

  useEffect(() => {
    const c = localStorage.getItem("concrest.currency");
    const a = localStorage.getItem("concrest.audience");
    if (c === "INR" || c === "AED") setCurrency(c);
    if (a === "Resident" || a === "NRI") setAudience(a);
  }, []);

  useEffect(() => {
    localStorage.setItem("concrest.currency", currency);
  }, [currency]);
  useEffect(() => {
    localStorage.setItem("concrest.audience", audience);
  }, [audience]);

  return (
    <PrefsContext.Provider value={{ currency, audience, setCurrency, setAudience }}>
      {children}
    </PrefsContext.Provider>
  );
}

export const usePrefs = () => useContext(PrefsContext);

export function formatPrice(
  currency: Currency,
  priceInr: number | null | undefined,
  priceAed: number | null | undefined,
) {
  if (currency === "AED") {
    if (priceAed == null) return "Price on request";
    return `AED ${compact(priceAed)}`;
  }
  if (priceInr == null) return "Price on request";
  return `₹ ${indianCompact(priceInr)}`;
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
