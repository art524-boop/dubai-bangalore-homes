import { SITE } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";

export function Scheduler({
  sourceCta,
  title,
  note,
}: {
  sourceCta: string;
  title: string;
  note: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-card p-8 shadow-soft">
      <p className="eyebrow">Scheduling</p>
      <h3 className="mt-2 text-3xl">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{note}</p>
      <div className="mt-6">
        {SITE.calLink ? (
          <iframe
            title={title}
            src={SITE.calLink}
            loading="lazy"
            className="h-[640px] w-full rounded-sm border border-border"
          />
        ) : (
          <LeadForm
            sourceCta={sourceCta}
            submitLabel="Request a Time"
            successNote="Request received — we'll send you a confirmed slot in your timezone."
          />
        )}
      </div>
    </div>
  );
}
