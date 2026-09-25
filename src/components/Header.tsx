import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { MARKET_CURRENCY, type Currency, usePrefs } from "@/lib/prefs";

const NAV = [
  { to: "/projects", label: "Properties" },
  { to: "/construction", label: "Custom Construction" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About & NRI" },
  { to: "/contact", label: "Contact" },
] as const;

const CURRENCIES = Object.values(MARKET_CURRENCY);

function CurrencySelect({ value, onChange }: { value: Currency; onChange: (v: Currency) => void }) {
  return (
    <label className="relative">
      <span className="sr-only">Display currency</span>
      <select
        aria-label="Display currency"
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="rounded-sm border border-border bg-card px-3 py-2 pr-8 text-xs text-foreground outline-none focus:border-accent"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </label>
  );
}

export function Header() {
  const { currency, setCurrency } = usePrefs();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="font-display text-2xl tracking-tight">{SITE.name} Group</span>
          <span className="hidden max-w-48 text-[9px] leading-tight tracking-[0.14em] uppercase text-muted-foreground sm:inline xl:max-w-none">
            Constructions and Land Developers
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[13px] tracking-wide text-secondary transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block"><CurrencySelect value={currency} onChange={setCurrency} /></div>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-border px-3 py-2 text-xs tracking-widest uppercase lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-secondary"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-3 md:hidden"><CurrencySelect value={currency} onChange={setCurrency} /></div>
          </div>
        </div>
      )}
    </header>
  );
}
