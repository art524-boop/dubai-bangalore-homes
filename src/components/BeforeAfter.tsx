import { useState } from "react";

export function BeforeAfter({
  before,
  after,
  title,
  location,
  year,
  builtUpArea,
  illustrative = false,
}: {
  before: string;
  after: string;
  title: string;
  location: string;
  year?: number | null;
  builtUpArea?: string | null;
  illustrative?: boolean;
}) {
  const [pos, setPos] = useState(50);

  return (
    <figure className="overflow-hidden rounded-sm border border-border bg-card shadow-soft">
      <div className="relative aspect-[4/3] select-none">
        <img
          src={after}
          alt={`${title} after completion`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img
            src={before}
            alt={`${title} before construction`}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ width: `${(100 / Math.max(pos, 1)) * 100}%`, maxWidth: "none" }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-accent"
          style={{ left: `${pos}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label={`Reveal before and after for ${title}`}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
        <span className="absolute bottom-3 left-3 rounded-sm bg-primary/80 px-2 py-1 text-[10px] tracking-[0.16em] uppercase text-primary-foreground">
          Before
        </span>
        <span className="absolute right-3 bottom-3 rounded-sm bg-accent px-2 py-1 text-[10px] tracking-[0.16em] uppercase text-white">
          After
        </span>
        {illustrative && (
          <span className="absolute left-3 top-3 rounded-sm bg-card/90 px-2 py-1 text-[10px] uppercase text-foreground">
            Illustrative image
          </span>
        )}
      </div>
      <figcaption className="flex items-baseline justify-between gap-3 p-5">
        <span className="font-display text-xl">{title}</span>
        <span className="text-right text-xs uppercase text-muted-foreground">
          {[location, year, builtUpArea].filter(Boolean).join(" · ")}
        </span>
      </figcaption>
    </figure>
  );
}
