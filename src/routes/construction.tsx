import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createLead } from "@/lib/leads";

export const Route = createFileRoute("/construction")({
  head: () => ({
    meta: [
      { title: "Custom Home Construction in Bangalore | Concrest" },
      {
        name: "description",
        content:
          "Turnkey custom home construction in Bangalore: design and approvals, transparent costing, quality checks and handover with a 10-year structural warranty.",
      },
      { property: "og:title", content: "Custom Home Construction in Bangalore | Concrest" },
      {
        property: "og:description",
        content: "Turnkey design, approvals, costing, construction, quality checks and handover.",
      },
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

const TIERS = [
  {
    name: "Basic",
    rate: 2100,
    blurb: "Solid, efficient homes with dependable specifications.",
    items: ["Standard vitrified flooring", "Branded CP & sanitary (entry)", "Emulsion paint", "Basic modular kitchen"],
  },
  {
    name: "Premium",
    rate: 2750,
    blurb: "Our most chosen tier — balanced finishes and detailing.",
    items: ["Large-format tiles / engineered wood", "Mid-tier CP & sanitary", "Designer false ceiling", "Full modular kitchen"],
  },
  {
    name: "Luxury",
    rate: 3600,
    blurb: "Architect-led detailing with imported finishes.",
    items: ["Imported marble & veneer", "Premium CP fittings", "Home automation ready", "Custom joinery throughout"],
  },
];

function Construction() {
  const [plot, setPlot] = useState(2400);
  const [floors, setFloors] = useState(2);
  const [tier, setTier] = useState("Premium");
  const [city, setCity] = useState("Bangalore");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const rate = TIERS.find((t) => t.name === tier)?.rate ?? 2750;
  const builtUp = plot * 0.75 * floors;
  const low = Math.round((builtUp * rate) / 100000);
  const high = Math.round((builtUp * rate * 1.12) / 100000);

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
        country: city === "Bangalore" ? "India" : city,
        source_cta: "Free Estimate",
        message: `Plot ${plot} sq ft · ${floors} floor(s) · ${tier} tier · ${city}. Estimated ₹${low}–${high} L (approx ${Math.round(builtUp)} sq ft built-up).`,
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
        <p className="eyebrow">Custom Construction · Bangalore</p>
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

      <section className="shell py-20">
        <p className="eyebrow">Packages</p>
        <h2 className="mt-2 text-4xl lg:text-5xl">Three levels of finish</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-sm border bg-card p-8 ${
                t.name === "Premium" ? "border-accent shadow-lift" : "border-border shadow-soft"
              }`}
            >
              <p className="eyebrow">{t.name}</p>
              <p className="mt-3 font-display text-4xl">
                ₹{t.rate.toLocaleString("en-IN")}
                <span className="text-base text-muted-foreground"> / sq ft</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm text-secondary">
                {t.items.map((i) => (
                  <li key={i} className="border-t border-border pt-2">
                    {i}
                  </li>
                ))}
              </ul>
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
              <div className="grid gap-4 sm:grid-cols-3">
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
                  <label className="label-xs" htmlFor="tier">
                    Tier
                  </label>
                  <select
                    id="tier"
                    className="field"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                  >
                    {TIERS.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-xs" htmlFor="city">
                    City
                  </label>
                  <select
                    id="city"
                    className="field"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option>Bangalore</option>
                    <option>Bangalore Outskirts</option>
                  </select>
                </div>
              </div>

              <div className="rounded-sm border border-accent/40 bg-accent/10 p-6">
                <p className="eyebrow">Estimated cost</p>
                <p className="mt-2 font-display text-4xl text-accent">
                  ₹{low} L – ₹{high} L
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Approx. {Math.round(builtUp).toLocaleString("en-IN")} sq ft built-up at ₹
                  {rate.toLocaleString("en-IN")}/sq ft.
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
