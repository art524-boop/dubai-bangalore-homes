import { createFileRoute } from "@tanstack/react-router";
import { Scheduler } from "@/components/Scheduler";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Concrest & NRI Advisory" },
      {
        name: "description",
        content:
          "Meet the Concrest team and our NRI desk: cross-border investment guidance, POA-assisted purchases and virtual consultations for overseas buyers.",
      },
      { property: "og:title", content: "About Concrest & NRI Advisory" },
      {
        property: "og:description",
        content:
          "Cross-border investment guidance, POA-assisted purchases and virtual consultations for overseas buyers.",
      },
    ],
  }),
  component: About,
});

const TEAM = [
  ["Arvind Rao", "Managing Partner", "22 years across Bangalore residential development and land due diligence."],
  ["Farah Siddiqui", "Head, Dubai Desk", "Ex-developer sales lead; DLD-registered and Downtown/Palm specialist."],
  ["Nikhil Menon", "Head, Construction", "Structural engineer; 140+ custom homes delivered on private plots."],
];

function About() {
  return (
    <div>
      <section className="shell py-16">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 max-w-3xl text-5xl leading-tight lg:text-6xl">
          A property firm built like an architecture practice
        </h1>
        <p className="mt-6 max-w-2xl text-secondary">
          Concrest began as a small construction outfit in Bangalore and grew into a two-market
          advisory. We keep the same habits: measured advice, documented process, and a preference
          for saying no to the wrong deal.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {TEAM.map(([n, r, d]) => (
            <div key={n} className="border-t border-border pt-6">
              <h3 className="text-2xl">{n}</h3>
              <p className="eyebrow mt-1">{r}</p>
              <p className="mt-3 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell grid gap-12 py-20 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="eyebrow">NRI Advisory</p>
            <h2 className="mt-2 text-4xl lg:text-5xl">A desk built for buyers abroad</h2>
            <div className="mt-10 space-y-8">
              {[
                [
                  "Cross-border investment guidance",
                  "Repatriation planning, FEMA-compliant structuring, NRE/NRO routing and TDS clarity before you commit — not after.",
                ],
                [
                  "POA-assisted purchase support",
                  "Drafting, attestation and adjudication of a Power of Attorney so registration can proceed without you flying down.",
                ],
                [
                  "Documented, offline transactions",
                  "Every payment goes directly to the developer or seller through banking channels. We never collect money online.",
                ],
              ].map(([t, d]) => (
                <div key={t} className="border-t border-border pt-6">
                  <h3 className="text-2xl">{t}</h3>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-xl text-sm text-secondary">
              Overseas right now? Book a virtual consultation — pick a slot in your own timezone and
              we'll walk the shortlist with you on video.
            </p>
          </div>

          <Scheduler
            sourceCta="NRI Virtual Consultation"
            title="Book a virtual consultation"
            note="30 minutes with an advisor, scheduled in your local timezone."
          />
        </div>
      </section>
    </div>
  );
}
