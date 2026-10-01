import { Link } from "@tanstack/react-router";
import { formatPrice, usePrefs } from "@/lib/prefs";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;

export function ProjectCard({ project }: { project: Project }) {
  const { currency } = usePrefs();

  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {project.cover_image_url && (
          <img
            src={project.cover_image_url}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">
            {project.developer ?? "Concrest"} · {project.city}
          </p>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
            {project.possession_status}
          </span>
        </div>
        <h3 className="text-2xl leading-tight">{project.name}</h3>
        <p className="text-sm text-muted-foreground">
          {[project.property_type, project.bhk].filter(Boolean).join(" · ")}
        </p>
        <div className="flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
              Starting
            </p>
            <p className="font-display text-2xl text-accent">
              {formatPrice(currency, {
                INR: project.price_inr,
                AUD: project.price_aud,
              })}
            </p>
          </div>
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="btn-outline px-4 py-2"
          >
            View Project
          </Link>
        </div>
      </div>
    </article>
  );
}
