import { useState, type ReactNode } from "react";
import { createLead } from "@/lib/leads";

export function LeadForm({
  sourceCta,
  projectId,
  showNri = true,
  showMessage = true,
  submitLabel = "Submit Enquiry",
  successNote = "Thank you. An advisor will contact you shortly.",
  extra,
  compact = false,
  buildMessage,
}: {
  sourceCta: string;
  projectId?: string | null;
  showNri?: boolean;
  showMessage?: boolean;
  submitLabel?: string;
  successNote?: string;
  extra?: ReactNode;
  compact?: boolean;
  buildMessage?: (message: string) => string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [isNri, setIsNri] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const raw = String(form.get("message") ?? "");
      await createLead({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        country: String(form.get("country") ?? ""),
        is_nri: showNri ? isNri : false,
        project_id: projectId ?? null,
        source_cta: sourceCta,
        message: buildMessage ? buildMessage(raw) : raw,
      });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm border border-accent/40 bg-accent/10 p-6 text-sm text-secondary">
        {successNote}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className="label-xs" htmlFor={`${sourceCta}-name`}>
            Full name
          </label>
          <input id={`${sourceCta}-name`} name="name" required maxLength={100} className="field" />
        </div>
        <div>
          <label className="label-xs" htmlFor={`${sourceCta}-phone`}>
            Phone
          </label>
          <input
            id={`${sourceCta}-phone`}
            name="phone"
            required
            maxLength={30}
            className="field"
            placeholder="+91 / +971"
          />
        </div>
        <div>
          <label className="label-xs" htmlFor={`${sourceCta}-email`}>
            Email
          </label>
          <input
            id={`${sourceCta}-email`}
            name="email"
            type="email"
            maxLength={255}
            className="field"
          />
        </div>
        <div>
          <label className="label-xs" htmlFor={`${sourceCta}-country`}>
            Country of residence
          </label>
          <input
            id={`${sourceCta}-country`}
            name="country"
            maxLength={80}
            className="field"
            placeholder="India, UAE, UK…"
          />
        </div>
      </div>

      {extra}

      {showMessage && (
        <div>
          <label className="label-xs" htmlFor={`${sourceCta}-message`}>
            Message
          </label>
          <textarea
            id={`${sourceCta}-message`}
            name="message"
            rows={3}
            maxLength={2000}
            className="field resize-none"
          />
        </div>
      )}

      {showNri && (
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            checked={isNri}
            onChange={(e) => setIsNri(e.target.checked)}
            className="h-4 w-4 accent-[oklch(0.666_0.155_58.5)]"
          />
          I am an NRI / overseas buyer
        </label>
      )}

      {status === "error" && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" className="btn-gold w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
