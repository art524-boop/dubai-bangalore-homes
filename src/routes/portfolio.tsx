import { createFileRoute, Link } from "@tanstack/react-router";
import { BeforeAfter } from "@/components/BeforeAfter";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Construction Portfolio — Completed Villas & Homes | Concrest" },
      {
        name: "description",
        content:
          "Before and after views of custom villas and homes delivered by Concrest across Bangalore.",
      },
      { property: "og:title", content: "Construction Portfolio | Concrest" },
      {
        property: "og:description",
        content: "Before and after views of custom villas and homes delivered across Bangalore.",
      },
    ],
  }),
  component: Portfolio,
});

const WORKS = [
  {
    title: "Courtyard House",
    location: "Sarjapur Road",
    before:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80",
    after:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  },
  {
    title: "The Grey Villa",
    location: "Whitefield",
    before:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400&q=80",
    after:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80",
  },
  {
    title: "Banyan Residence",
    location: "Hebbal",
    before:
      "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=1400&q=80",
    after:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
  },
  {
    title: "Stone & Teak House",
    location: "Kanakapura Road",
    before:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1400&q=80",
    after:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=80",
  },
];

function Portfolio() {
  return (
    <div className="shell py-16">
      <p className="eyebrow">Portfolio</p>
      <h1 className="mt-3 max-w-3xl text-5xl leading-tight lg:text-6xl">
        From bare plot to finished home
      </h1>
      <p className="mt-6 max-w-xl text-sm text-muted-foreground">
        Drag each image to move between the site as we found it and the home we handed over.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {WORKS.map((w) => (
          <BeforeAfter key={w.title} {...w} />
        ))}
      </div>

      <div className="mt-16 rounded-sm border border-border bg-card p-10 text-center shadow-soft">
        <h2 className="text-3xl">Have a plot in Bangalore?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Get an indicative cost in under a minute, then talk it through with our construction team.
        </p>
        <Link to="/construction" className="btn-gold mt-6">
          Get a Free Estimate
        </Link>
      </div>
    </div>
  );
}
