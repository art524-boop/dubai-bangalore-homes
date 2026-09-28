import { useEffect, useMemo, useState } from "react";
import { format, startOfDay, addDays, isSunday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { SITE } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

function slotLabel(s: string) {
  const [h, m] = s.split(":").map(Number);
  return format(new Date(2000, 0, 1, h, m), "h:mm a");
}

export function Scheduler({
  sourceCta,
  title,
  note,
}: {
  sourceCta: string;
  title: string;
  note: string;
}) {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState("");
  const [tz, setTz] = useState("UTC");
  const [done, setDone] = useState(false);
  const [zones, setZones] = useState<string[]>(["UTC"]);

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setTz(detected);
    const all =
      typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
    setZones(Array.from(new Set([detected, "UTC", ...all])));
  }, []);

  const today = useMemo(() => startOfDay(new Date()), []);
  const summary = date && slot ? `${format(date, "EEEE, d MMMM yyyy")} at ${slotLabel(slot)} (${tz})` : "";

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
        ) : done ? (
          <div className="rounded-sm border border-accent/40 bg-accent/10 p-6 text-sm text-secondary">
            <p className="font-display text-2xl text-primary">Request confirmed</p>
            <p className="mt-2">
              We've received your request for <strong>{summary}</strong>. An advisor will email or
              WhatsApp you a confirmation with the video link shortly.
            </p>
          </div>
        ) : (
          <LeadForm
            sourceCta={sourceCta}
            submitLabel="Request this Time"
            showMessage
            validate={() => (!date ? "Please choose a date." : !slot ? "Please choose a time slot." : null)}
            buildMessage={(m) => `Requested slot: ${summary}${m.trim() ? `\n\n${m}` : ""}`}
            onSuccess={() => setDone(true)}
            extra={
              <div className="space-y-4">
                <div>
                  <span className="label-xs">Preferred date</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn("field flex items-center gap-2 text-left", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < addDays(today, 1) || isSunday(d) || d > addDays(today, 90)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <span className="label-xs">Time slot (in your timezone)</span>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    {SLOTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlot(s)}
                        aria-pressed={slot === s}
                        className={cn(
                          "rounded-sm border px-2 py-2 text-xs transition-colors",
                          slot === s
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border hover:border-accent",
                        )}
                      >
                        {slotLabel(s)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label-xs" htmlFor={`${sourceCta}-tz`}>
                    Your timezone
                  </label>
                  <select
                    id={`${sourceCta}-tz`}
                    className="field"
                    value={tz}
                    onChange={(e) => setTz(e.target.value)}
                  >
                    {zones.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
