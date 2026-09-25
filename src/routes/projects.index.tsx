import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import { MARKETS, MARKET_CITIES, PROPERTY_TYPES, usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "International Property Catalogue | Concrest" },
      {
        name: "description",
        content:
          "Browse vetted homes, plots, land and commercial property across India, Australia, the UAE, the UK and Bali.",
      },
      { property: "og:title", content: "International Property Catalogue | Concrest" },
      {
        property: "og:description",
        content: "Vetted homes, plots, land and commercial property across five international markets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Catalogue,
});

type Filters = {
  country: string;
  city: string;
  property_type: string;
  bhk: string;
  possession_status: string;
  developer: string;
  maxPrice: number;
};

const EMPTY: Filters = {
  country: "",
  city: "",
  property_type: "",
  bhk: "",
  possession_status: "",
  developer: "",
  maxPrice: 0,
};

function Catalogue() {
  const { currency } = usePrefs();
  const [filters, setFilters] = useState<Filters>(EMPTY);

  useEffect(() => {
    setFilters((current) => ({ ...current, maxPrice: 0 }));
  }, [currency]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const options = useMemo(() => {
    const uniq = (vals: (string | null)[]) =>
      Array.from(new Set(vals.filter((v): v is string => !!v))).sort();
    return {
      country: uniq(projects.map((p) => p.country)),
      city: uniq(projects.map((p) => p.city)),
      property_type: Array.from(new Set([...PROPERTY_TYPES, ...uniq(projects.map((p) => p.property_type))])),
      bhk: uniq(projects.map((p) => p.bhk)),
      possession_status: uniq(projects.map((p) => p.possession_status)),
      developer: uniq(projects.map((p) => p.developer)),
    };
  }, [projects]);

  const priceOf = (p: Project) => ({
    INR: p.price_inr, AUD: p.price_aud, AED: p.price_aed, GBP: p.price_gbp, IDR: p.price_idr,
  })[currency] ?? 0;
  const maxAvailable = Math.max(1, ...projects.map(priceOf));

  const results = projects.filter((p) => {
    if (filters.country && p.country !== filters.country) return false;
    if (filters.city && p.city !== filters.city) return false;
    if (filters.property_type && p.property_type !== filters.property_type) return false;
    if (filters.bhk && p.bhk !== filters.bhk) return false;
    if (filters.possession_status && p.possession_status !== filters.possession_status)
      return false;
    if (filters.developer && p.developer !== filters.developer) return false;
    if (filters.maxPrice && priceOf(p) > filters.maxPrice) return false;
    return true;
  });

  const cityValues = filters.country
    ? Array.from(new Set([...(MARKET_CITIES[filters.country as keyof typeof MARKET_CITIES] ?? []), ...options.city.filter((city) => projects.some((p) => p.country === filters.country && p.city === city))]))
    : options.city;
  const selects: { key: keyof Filters; label: string; values: readonly string[] }[] = [
    { key: "country", label: "Country / market", values: MARKETS },
    { key: "city", label: "City", values: cityValues },
    { key: "property_type", label: "Property type", values: options.property_type },
    { key: "bhk", label: "Configuration", values: options.bhk },
    { key: "possession_status", label: "Possession", values: options.possession_status },
    { key: "developer", label: "Developer", values: options.developer },
  ];

  return (
    <div className="shell py-14">
      <p className="eyebrow">Catalogue</p>
      <h1 className="mt-2 max-w-2xl text-5xl leading-tight lg:text-6xl">
        Property across five global markets
      </h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Choose a country to filter listings. Use the header currency selector to view prices in {currency}.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-5 rounded-sm border border-border bg-card p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Filters</p>
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="text-xs text-accent hover:underline"
            >
              Reset
            </button>
          </div>

          {selects.map((s) => (
            <div key={s.key}>
              <label className="label-xs" htmlFor={`f-${s.key}`}>
                {s.label}
              </label>
              <select
                id={`f-${s.key}`}
                className="field"
                value={String(filters[s.key])}
                onChange={(e) => setFilters((f) => ({
                  ...f,
                  [s.key]: e.target.value,
                  ...(s.key === "country" ? { city: "" } : {}),
                }))}
              >
                <option value="">All</option>
                {s.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="label-xs" htmlFor="f-price">
              Max price ({currency})
            </label>
            <input
              id="f-price"
              type="range"
              min={0}
              max={maxAvailable}
              step={Math.max(1, Math.round(maxAvailable / 100))}
              value={filters.maxPrice || maxAvailable}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
              className="w-full accent-[oklch(0.666_0.155_58.5)]"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Up to{" "}
              {(filters.maxPrice || maxAvailable).toLocaleString(
                currency === "INR" ? "en-IN" : currency === "AUD" ? "en-AU" : currency === "GBP" ? "en-GB" : currency === "IDR" ? "id-ID" : "en-AE",
              )}
            </p>
          </div>
        </aside>

        <div>
          <p className="mb-6 text-xs tracking-[0.14em] uppercase text-muted-foreground">
            {isLoading ? "Loading…" : `${results.length} properties`}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {!isLoading && results.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No properties match these filters yet. Try widening your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
