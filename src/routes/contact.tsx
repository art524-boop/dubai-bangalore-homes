import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/LeadForm";
import { Scheduler } from "@/components/Scheduler";
import { MapEmbed } from "@/components/MapEmbed";
import { OFFICES, SITE, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Concrest — Bangalore & Dubai Offices" },
      {
        name: "description",
        content:
          "Talk to the Concrest team in Bangalore or Dubai, send an enquiry, or book a virtual site visit in your own timezone.",
      },
      { property: "og:title", content: "Contact Concrest — Bangalore & Dubai Offices" },
      {
        property: "og:description",
        content: "Enquire, visit an office, or book a virtual site visit in your own timezone.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="shell py-16">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 max-w-2xl text-5xl leading-tight lg:text-6xl">Let's talk</h1>
      <p className="mt-6 max-w-xl text-sm text-muted-foreground">
        Call {SITE.phoneIndia} (India) or {SITE.phoneUae} (UAE), message us on{" "}
        <a
          href={whatsappUrl("Hello Concrest.")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          WhatsApp
        </a>
        , or write to {SITE.email}.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="rounded-sm border border-border bg-card p-8 shadow-soft">
          <p className="eyebrow">General enquiry</p>
          <h2 className="mt-2 text-3xl">Send us a note</h2>
          <div className="mt-6">
            <LeadForm sourceCta="General Enquiry" />
          </div>
        </div>

        <Scheduler
          sourceCta="Virtual Site Visit"
          title="Book a virtual site visit"
          note="Pick a slot in your own timezone — we'll walk the property on video."
        />
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {OFFICES.map((o) => (
          <div key={o.city} className="rounded-sm border border-border bg-card p-8 shadow-soft">
            <p className="eyebrow">
              {o.city} · {o.country}
            </p>
            <h3 className="mt-2 text-3xl">{o.city} office</h3>
            <p className="mt-3 text-sm text-secondary">{o.address}</p>
            <p className="mt-4 text-sm text-secondary">{o.hoursLocal}</p>
            <p className="text-sm text-muted-foreground">{o.hoursOther}</p>
            <div className="mt-6">
              <MapEmbed lat={o.lat} lng={o.lng} title={`${o.city} office`} className="h-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
