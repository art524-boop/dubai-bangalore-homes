import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { usePrefs } from "@/lib/prefs";

const NAV = [
  { to: "/projects", label: "Properties" },
  { to: "/construction", label: "Custom Construction" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About & NRI" },
  { to: "/contact", label: "Contact" },
] as const;

function Toggle<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      aria-label={label}
      className="inline-flex items-center rounded-sm border border-border bg-card p-0.5"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`px-2.5 py-1 text-[11px] tracking-[0.12em] uppercase transition-colors ${
            value === o
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { currency, setCurrency, audience, setAudience } = usePrefs();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight">{SITE.name}</span>
          <span className="hidden text-[10px] tracking-[0.28em] uppercase text-muted-foreground sm:inline">
            Bangalore · Dubai
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
          <div className="hidden items-center gap-2 md:flex">
            <Toggle
              label="Currency"
              options={["INR", "AED"] as const}
              value={currency}
              onChange={setCurrency}
            />
            <Toggle
              label="Buyer type"
              options={["Resident", "NRI"] as const}
              value={audience}
              onChange={setAudience}
            />
          </div>
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
            <div className="mt-3 flex gap-2 md:hidden">
              <Toggle
                label="Currency"
                options={["INR", "AED"] as const}
                value={currency}
                onChange={setCurrency}
              />
              <Toggle
                label="Buyer type"
                options={["Resident", "NRI"] as const}
                value={audience}
                onChange={setAudience}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
