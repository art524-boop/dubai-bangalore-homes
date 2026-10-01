export const SITE = {
  name: "Concrest",
  tagline: "Constructions and Land Developers · International Property",
  whatsappNumber: "919999999999",
  email: "hello@concrest.com",
  phoneIndia: "+91 99999 99999",
  /** Set this to your Cal.com link (e.g. "https://cal.com/concrest/consult") to
   * show the self-scheduling widget instead of the request form. */
  calLink: "",
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const TZ_LABELS: Record<string, string> = {
  "Asia/Kolkata": "IST",
  "Australia/Sydney": "AET",
};

export type Office = {
  city: string;
  country: string;
  address: string;
  days: string;
  open: string; // "HH:MM" in office timezone
  close: string;
  timeZone: string;
  lat: number;
  lng: number;
};

export const OFFICES: Office[] = [
  {
    city: "Bangalore",
    country: "India",
    address: "Level 7, Prestige Atrium, Central Street, Bangalore 560001",
    days: "Mon–Sat",
    open: "09:30",
    close: "19:00",
    timeZone: "Asia/Kolkata",
    lat: 12.9716,
    lng: 77.5946,
  },
];

/** Offset of `timeZone` from UTC in minutes at instant `at`. */
function tzOffsetMinutes(timeZone: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"), g("second"));
  return Math.round((asUtc - at.getTime()) / 60000);
}

/** Convert "HH:MM" wall time in `fromTz` (today) to a UTC Date. */
function wallTimeToDate(hhmm: string, fromTz: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const guess = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m);
  return new Date(guess - tzOffsetMinutes(fromTz, new Date(guess)) * 60000);
}

function fmtTime(d: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(d);
}

export function officeHours(office: Office, displayTz: string = office.timeZone) {
  const label = TZ_LABELS[displayTz] ?? displayTz;
  const o = wallTimeToDate(office.open, office.timeZone);
  const c = wallTimeToDate(office.close, office.timeZone);
  return `${fmtTime(o, displayTz)} – ${fmtTime(c, displayTz)} ${label}`;
}

export function secondaryTz(office: Office) {
  return office.timeZone === "Asia/Kolkata" ? "Australia/Sydney" : "Asia/Kolkata";
}
