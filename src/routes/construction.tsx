import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createLead } from "@/lib/leads";

export const Route = createFileRoute("/construction")({
  head: () => ({
    meta: [
      { title: "Custom Home Construction in India & Australia | Concrest" },
      {
        name: "description",
        content:
          "Turnkey custom home construction in India and Australia, with transparent costing, quality checks and a 10-year structural warranty.",
      },
      { property: "og:title", content: "Custom Home Construction in India & Australia | Concrest" },
      {
        property: "og:description",
        content: "Turnkey design, approvals, costing, construction, quality checks and handover.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Construction,
});

const STEPS = [
  ["Consultation", "Site visit, brief, feasibility and an honest budget conversation."],
  ["Design & Approval", "Architectural drawings, structural design, BBMP/BDA approvals."],
  ["Costing", "Line-item BOQ with brand-level specifications. No hidden allowances."],
  ["Construction", "Single accountable site team, weekly photo and spend reporting."],
  ["Quality Checks", "Third-party structural, waterproofing and MEP inspections at each stage."],
  ["Handover", "Snag closure, documentation, and a 10-year structural warranty."],
];

const CONSTRUCTION_LOCATIONS = [
  { country: "India", city: "Bangalore", available: true },
  { country: "India", city: "Bangalore Outskirts", available: true },
  { country: "Australia", city: "Sydney", available: true },
  { country: "Australia", city: "Melbourne", available: true },
  { country: "Australia", city: "Brisbane", available: true },
  { country: "UAE", city: "Coming soon", available: false },
  { country: "UK", city: "Coming soon", available: false },
  { country: "Bali", city: "Coming soon", available: false },
] as const;

function Construction() {
  const [plot, setPlot] = useState(2400);
  const [floors, setFloors] = useState(2);
  const [location, setLocation] = useState("India|Bangalore");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const [country, city] = location.split("|");
  const isAustralia = country === "Australia";
  const rate = isAustralia ? 220 : 2750;
  const builtUp = plot * 0.75 * floors;
  const low = Math.round(builtUp * rate);
  const high = Math.round(builtUp * rate * 1.12);
  const money = (value: number) => isAustralia
    ? `AUD ${value.toLocaleString("en-AU")}`
    : `₹ ${value >= 10000000 ? `${(value / 10000000).toFixed(2)} Cr` : `${(value / 100000).toFixed(1)} L`}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      await createLead({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        country,
        source_cta: "Free Estimate",
        message: `Plot ${plot} sq ft · ${floors} floor(s) · ${city}, ${country}. Estimated ${money(low)}–${money(high)} (approx ${Math.round(builtUp)} sq ft built-up).`,
      });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div>
      <section className="shell py-16">
        <p className="eyebrow">Custom Construction · India & Australia</p>
        <h1 className="mt-3 max-w-3xl text-5xl leading-tight lg:text-6xl">
          Build once. Build properly.
        </h1>
        <p className="mt-6 max-w-2xl text-secondary">
          Concrest delivers turnkey homes on your plot — architecture, approvals, structure,
          finishes and handover under one contract, one price and one team you can call.
        </p>
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell grid gap-px py-0 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="border-b border-border py-8 pr-8 md:border-b-0">
              <p className="font-display text-4xl text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="shell grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Calculator</p>
            <h2 className="mt-2 text-4xl">Get a free estimate</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Indicative only — final costing follows a site visit and a line-item BOQ.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="label-xs" htmlFor="plot">
                  Plot size (sq ft)
                </label>
                <input
                  id="plot"
                  type="number"
                  min={600}
                  max={50000}
                  value={plot}
                  onChange={(e) => setPlot(Number(e.target.value) || 0)}
                  className="field"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-xs" htmlFor="floors">
                    Floors
                  </label>
                  <select
                    id="floors"
                    className="field"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-xs" htmlFor="location">
                    Construction location
                  </label>
                  <select
                    id="location"
                    className="field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {CONSTRUCTION_LOCATIONS.map((item) => (
                      <option
                        key={`${item.country}-${item.city}`}
                        value={`${item.country}|${item.city}`}
                        disabled={!item.available}
                      >
                        {item.available ? `${item.country} · ${item.city}` : `${item.country} · Coming soon`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-sm border border-accent/40 bg-accent/10 p-6">
                <p className="eyebrow">Estimated cost</p>
                <p className="mt-2 font-display text-4xl text-accent">
                   {money(low)} – {money(high)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                   Approx. {Math.round(builtUp).toLocaleString(isAustralia ? "en-AU" : "en-IN")} sq ft built-up at {isAustralia ? "AUD " : "₹"}
                   {rate.toLocaleString(isAustralia ? "en-AU" : "en-IN")}/sq ft.
                </p>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-sm border border-border bg-background p-8 shadow-soft">
            <p className="eyebrow">Send me this estimate</p>
            {status === "done" ? (
              <p className="mt-4 text-sm text-secondary">
                Estimate sent to our team — we'll call you to schedule a site visit.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                  <label className="label-xs" htmlFor="est-name">
                    Full name
                  </label>
                  <input id="est-name" name="name" required className="field" />
                </div>
                <div>
                  <label className="label-xs" htmlFor="est-phone">
                    Phone
                  </label>
                  <input id="est-phone" name="phone" required className="field" />
                </div>
                <div>
                  <label className="label-xs" htmlFor="est-email">
                    Email
                  </label>
                  <input id="est-email" name="email" type="email" className="field" />
                </div>
                {status === "error" && <p className="text-sm text-destructive">{error}</p>}
                <button className="btn-gold w-full" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Get a Free Estimate"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
