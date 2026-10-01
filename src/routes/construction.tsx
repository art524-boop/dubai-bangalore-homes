import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/construction")({
  head: () => ({
    meta: [
      { title: "Custom Home Construction in India & Australia | Concrest" },
      {
        name: "description",
        content:
          "Property advisory and custom construction across India and Australia, with transparent costing and documented quality checks.",
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
  ["Handover", "Snag closure, completion records and a structured handover process."],
];

function Construction() {
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

    </div>
  );
}
