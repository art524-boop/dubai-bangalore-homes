import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import heroBuy from "@/assets/hero-buy.jpg";
import heroBuild from "@/assets/hero-build.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Concrest Group — International Property & Construction" },
      {
        name: "description",
        content:
          "Discover property across India, Australia, the UAE, the UK and Bali, with custom construction in India and Australia.",
      },
      { property: "og:title", content: "Concrest Group — International Property & Construction" },
      {
        property: "og:description",
        content:
          "International property and land, with custom construction in India and Australia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const CREDIBILITY = [
  "RERA Certified",
  "ISO Certified",
  "Bank Loan Partners",
  "10-Year Structural Warranty",
  "FEMA-Compliant Transactions",
  "Dedicated NRI Desk",
];

function Home() {
  const scroller = useRef<HTMLDivElement>(null);
  const {
    data: showcase,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data.length) return { label: "Featured", items: data as Project[] };
      const latest = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (latest.error) throw latest.error;
      return { label: "Latest", items: latest.data as Project[] };
    },
  });
  const featured = showcase?.items ?? [];
  const hideSection = !isLoading && !isError && featured.length === 0;

  function scrollBy(dir: number) {
    scroller.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  }

  return (
    <div>
      <section className="grid md:grid-cols-2">
        {[
          {
            img: heroBuy,
            eyebrow: "Real Estate Catalogue",
            title: "Find Your Dream Home",
             sub: "India · Australia · UAE · UK · Bali",
            body: "A curated catalogue of ready and under-construction residences from developers we have vetted ourselves.",
            to: "/projects" as const,
            cta: "Browse Properties",
          },
          {
            img: heroBuild,
            eyebrow: "Turnkey Construction",
            title: "Build Your Dream Home",
             sub: "Custom Construction in India & Australia",
            body: "Design, approvals, costing and build — delivered under one accountable contract with a 10-year structural warranty.",
            to: "/construction" as const,
            cta: "Start Building",
          },
        ].map((panel, i) => (
          <div key={panel.title} className="relative min-h-[70vh] overflow-hidden md:min-h-[86vh]">
            <img
              src={panel.img}
              alt={panel.title}
              width={1280}
              height={1600}
              {...(i === 1 ? { loading: "lazy" as const } : {})}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.208_0.042_265.755/0.92)] via-[oklch(0.208_0.042_265.755/0.55)] to-[oklch(0.208_0.042_265.755/0.25)]" />
            <div className="relative flex h-full flex-col justify-end gap-4 p-8 text-primary-foreground lg:p-14">
              <p className="eyebrow text-accent">{panel.eyebrow}</p>
              <h1 className="max-w-md text-5xl leading-[1.05] lg:text-6xl">{panel.title}</h1>
              <p className="font-display text-xl text-primary-foreground/80">{panel.sub}</p>
              <p className="max-w-sm text-sm text-primary-foreground/70">{panel.body}</p>
              <div>
                <Link to={panel.to} className="btn-gold mt-2">
                  {panel.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6">
          {CREDIBILITY.map((c) => (
            <span key={c} className="eyebrow text-secondary">
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="shell py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="mt-2 text-4xl lg:text-5xl">Signature residences</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scrollBy(-1)} className="btn-outline px-4 py-2" type="button">
              ←
            </button>
            <button onClick={() => scrollBy(1)} className="btn-outline px-4 py-2" type="button">
              →
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none]"
        >
          {featured.map((p) => (
            <div key={p.id} className="w-[85%] shrink-0 snap-start sm:w-[420px]">
              <ProjectCard project={p} />
            </div>
          ))}
          {featured.length === 0 && (
            <p className="text-sm text-muted-foreground">Featured listings are being updated.</p>
          )}
        </div>

        <div className="mt-8">
          <Link to="/projects" className="btn-ink">
            View Full Catalogue
          </Link>
        </div>
      </section>

      <section className="shell grid gap-10 pb-24 md:grid-cols-3">
        {[
          {
            t: "Advisory, not brokerage",
            d: "We shortlist by build quality, title clarity and rental depth — then walk you through the trade-offs honestly.",
          },
          {
             t: "One team, global perspective",
             d: "Our market specialists share one client brief, so cross-border buyers never repeat themselves.",
          },
          {
            t: "Offline, documented deals",
            d: "No online payments. Every transaction is executed with signed documentation and your banker in the loop.",
          },
        ].map((b) => (
          <div key={b.t} className="border-t border-border pt-6">
            <h3 className="text-2xl">{b.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
