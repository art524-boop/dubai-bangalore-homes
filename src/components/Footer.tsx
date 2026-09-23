import { Link } from "@tanstack/react-router";
import { SITE, OFFICES } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="shell grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">{SITE.name}</p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
            Curated residences across Bangalore and Dubai, and turnkey custom construction for
            families building once and building well.
          </p>
        </div>
        <div>
          <p className="eyebrow text-primary-foreground/60">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/80">
            <Link to="/projects">Properties</Link>
            <Link to="/construction">Custom Construction</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/about">About & NRI Advisory</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-primary-foreground/60">Offices</p>
          <div className="mt-4 space-y-4 text-sm text-primary-foreground/80">
            {OFFICES.map((o) => (
              <div key={o.city}>
                <p className="text-primary-foreground">{o.city}</p>
                <p className="text-primary-foreground/60">{o.address}</p>
              </div>
            ))}
            <p className="text-primary-foreground/60">{SITE.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-6 text-xs text-primary-foreground/50">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All transactions handled offline with our
            advisory team.
          </span>
          <Link to="/admin" className="hover:text-primary-foreground/80">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
