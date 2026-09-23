import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, usePrefs } from "@/lib/prefs";
import { MapEmbed } from "@/components/MapEmbed";
import { LeadForm } from "@/components/LeadForm";
import { createLead } from "@/lib/leads";
import { whatsappUrl } from "@/lib/site";
import type { Project } from "@/components/ProjectCard";

export const Route = createFileRoute("/projects/$slug")({
  head: () => ({
    meta: [
      { title: "Property Details | Concrest" },
      {
        name: "description",
        content:
          "Gallery, RERA/DLD registration, amenities, floor plans, brochure and location for this Concrest listing.",
      },
      { property: "og:title", content: "Property Details | Concrest" },
      {
        property: "og:description",
        content: "Gallery, registration details, amenities, floor plans and location.",
      },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { currency } = usePrefs();
  const [active, setActive] = useState(0);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [quickNote, setQuickNote] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Project | null;
    },
  });

  if (isLoading) {
    return <div className="shell py-24 text-sm text-muted-foreground">Loading property…</div>;
  }

  if (!project) {
    return (
      <div className="shell py-24">
        <h1 className="text-4xl">Property not found</h1>
        <Link to="/projects" className="btn-outline mt-6">
          Back to catalogue
        </Link>
      </div>
    );
  }

  const images = [project.cover_image_url, ...(project.gallery_urls ?? [])].filter(
    (u): u is string => !!u,
  );

  async function quickLead(cta: string, then?: () => void) {
    if (!project) return;
    try {
      await createLead({
        name: "Website visitor",
        source_cta: cta,
        project_id: project.id,
        message: `${cta} requested for ${project.name}.`,
      });
      setQuickNote(`${cta} logged — our advisor will follow up.`);
    } catch {
      setQuickNote("We couldn't log that request, please use the enquiry form.");
    }
    then?.();
  }

  return (
    <div className="shell py-12">
      <Link to="/projects" className="eyebrow hover:text-accent">
        ← Back to catalogue
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          <div>
            <div className="aspect-[16/10] overflow-hidden rounded-sm bg-muted">
              {images[active] && (
                <img
                  src={images[active]}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-sm border ${
                      i === active ? "border-accent" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow">
              {project.developer ?? "Concrest"} · {project.city}
            </p>
            <h1 className="mt-2 text-5xl leading-tight">{project.name}</h1>
            <p className="mt-4 font-display text-3xl text-accent">
              {formatPrice(currency, project.price_inr, project.price_aed)}
            </p>
            <dl className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {[
                ["Type", project.property_type],
                ["Configuration", project.bhk ?? "—"],
                ["Possession", project.possession_status],
                ["RERA / DLD", project.rera_dld_number ?? "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-1 text-sm text-secondary">{v}</dd>
                </div>
              ))}
            </dl>
            {project.description && (
              <p className="mt-8 max-w-2xl leading-relaxed text-secondary">{project.description}</p>
            )}
          </div>

          {project.amenities?.length > 0 && (
            <div>
              <h2 className="text-3xl">Amenities</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {project.amenities.map((a) => (
                  <li key={a} className="border-t border-border pt-3 text-sm text-secondary">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.map_lat != null && project.map_lng != null && (
            <div>
              <h2 className="text-3xl">Location</h2>
              <div className="mt-6">
                <MapEmbed lat={project.map_lat} lng={project.map_lng} title={project.name} />
              </div>
            </div>
          )}

          {(project.floor_plan_url || project.brochure_url) && (
            <div>
              <h2 className="text-3xl">Documents</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.floor_plan_url && (
                  <a
                    href={project.floor_plan_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    onClick={() => quickLead("Download Floor Plan")}
                  >
                    Download Floor Plan
                  </a>
                )}
                {project.brochure_url && (
                  <a
                    href={project.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    onClick={() => quickLead("Download Brochure")}
                  >
                    Download Brochure
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-3 rounded-sm border border-border bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <p className="eyebrow">Speak to an advisor</p>
          <p className="font-display text-2xl">{project.name}</p>

          <button
            type="button"
            className="btn-gold w-full"
            onClick={() => setShowForm(showForm === "Enquire Now" ? null : "Enquire Now")}
          >
            Enquire Now
          </button>
          <a
            href={whatsappUrl(`Hello Concrest, I'm interested in ${project.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ink w-full"
            onClick={() => quickLead("WhatsApp Chat")}
          >
            WhatsApp Chat
          </a>
          {project.brochure_url ? (
            <a
              href={project.brochure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full"
              onClick={() => quickLead("Download Brochure")}
            >
              Download Brochure
            </a>
          ) : (
            <button
              type="button"
              className="btn-outline w-full"
              onClick={() => setShowForm("Download Brochure")}
            >
              Download Brochure
            </button>
          )}
          <button
            type="button"
            className="btn-outline w-full"
            onClick={() =>
              setShowForm(showForm === "Schedule Site Visit" ? null : "Schedule Site Visit")
            }
          >
            Schedule Site Visit
          </button>

          {quickNote && <p className="pt-2 text-xs text-accent">{quickNote}</p>}

          {showForm && (
            <div className="border-t border-border pt-5">
              <p className="eyebrow mb-3">{showForm}</p>
              <LeadForm
                key={showForm}
                sourceCta={showForm}
                projectId={project.id}
                compact
                submitLabel="Send Request"
                successNote="Received. Our advisor will reach out within one business day."
                buildMessage={(m) => `${showForm} — ${project.name}. ${m}`.trim()}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
