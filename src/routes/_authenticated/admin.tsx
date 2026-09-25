import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { MARKETS, MARKET_CITIES, PROPERTY_TYPES, type Market } from "@/lib/prefs";

type Project = Tables<"projects">;
type Lead = Tables<"leads">;

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Concrest" },
      { name: "description", content: "Manage Concrest listings and enquiries." },
      { property: "og:title", content: "Admin Panel — Concrest" },
      { property: "og:description", content: "Manage Concrest listings and enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"projects" | "leads">("projects");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setIsAdmin(false);
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      setIsAdmin(!!data);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) return <div className="shell py-24 text-secondary">Loading…</div>;
  if (!isAdmin)
    return (
      <div className="shell py-24">
        <h1 className="font-display text-3xl text-primary">Access restricted</h1>
        <p className="mt-3 text-secondary">Your account does not have admin access.</p>
        <button className="btn-outline mt-6" onClick={signOut}>Sign out</button>
      </div>
    );

  return (
    <section className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-1 font-display text-4xl text-primary">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button className={tab === "projects" ? "btn-ink" : "btn-outline"} onClick={() => setTab("projects")}>Projects</button>
          <button className={tab === "leads" ? "btn-ink" : "btn-outline"} onClick={() => setTab("leads")}>Leads</button>
          <button className="btn-outline" onClick={signOut}>Sign out</button>
        </div>
      </div>
      <div className="mt-10">{tab === "projects" ? <ProjectsAdmin /> : <LeadsAdmin />}</div>
    </section>
  );
}

/* ---------------- Projects ---------------- */

async function uploadFile(file: File, folder: string) {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const { error } = await supabase.storage.from("project-media").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage
    .from("project-media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("Could not create file link");
  return data.signedUrl;
}

function ProjectsAdmin() {
  const [rows, setRows] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  async function load() {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) alert(error.message);
    load();
  }

  if (editing) return <ProjectForm initial={editing} onDone={() => { setEditing(null); load(); }} />;

  return (
    <div>
      <button className="btn-gold" onClick={() => setEditing({})}>Add project</button>
      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-secondary">
            <tr><th className="p-3">Name</th><th className="p-3">Market</th><th className="p-3">City</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Featured</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium text-primary">{p.name}</td>
                <td className="p-3">{p.country}</td>
                <td className="p-3">{p.city}</td>
                <td className="p-3">{p.property_type}</td>
                <td className="p-3">{p.possession_status}</td>
                <td className="p-3">{p.featured ? "Yes" : "—"}</td>
                <td className="whitespace-nowrap p-3 text-right">
                  <button className="mr-3 underline" onClick={() => setEditing(p)}>Edit</button>
                  <button className="text-destructive underline" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ProjectForm({ initial, onDone }: { initial: Partial<Project>; onDone: () => void }) {
  const [p, setP] = useState<Partial<Project>>({
    country: "India", city: "Bangalore", property_type: "Apartment", possession_status: "Under Construction",
    gallery_urls: [], amenities: [], featured: false, ...initial,
  });
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const set = (k: keyof Project, v: unknown) => setP((o) => ({ ...o, [k]: v }));

  async function onUpload(k: "cover_image_url" | "floor_plan_url" | "brochure_url", f?: File) {
    if (!f) return;
    setBusy(k); setErr("");
    try { set(k, await uploadFile(f, k)); } catch (e) { setErr((e as Error).message); }
    setBusy("");
  }
  async function onGallery(files: FileList | null) {
    if (!files?.length) return;
    setBusy("gallery"); setErr("");
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadFile(f, "gallery")));
      setP((o) => ({ ...o, gallery_urls: [...(o.gallery_urls ?? []), ...urls] }));
    } catch (e) { setErr((e as Error).message); }
    setBusy("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!p.name || !p.country || !p.city) return setErr("Name, country and city are required.");
    const payload = {
      slug: p.slug || slugify(p.name), name: p.name, country: p.country, city: p.city,
      property_type: p.property_type || "Apartment", bhk: p.bhk || null,
      price_inr: p.price_inr ?? null, price_aed: p.price_aed ?? null,
      price_aud: p.price_aud ?? null, price_gbp: p.price_gbp ?? null, price_idr: p.price_idr ?? null,
      possession_status: p.possession_status || "Under Construction",
      developer: p.developer || null, rera_dld_number: p.rera_dld_number || null,
      cover_image_url: p.cover_image_url || null, gallery_urls: p.gallery_urls ?? [],
      amenities: p.amenities ?? [], floor_plan_url: p.floor_plan_url || null,
      brochure_url: p.brochure_url || null, map_lat: p.map_lat ?? null, map_lng: p.map_lng ?? null,
      description: p.description || null, featured: !!p.featured,
    };
    setBusy("save");
    const { error } = p.id
      ? await supabase.from("projects").update(payload).eq("id", p.id)
      : await supabase.from("projects").insert(payload);
    setBusy("");
    if (error) return setErr(error.message);
    onDone();
  }

  const text = (k: keyof Project, label: string, type = "text") => (
    <div>
      <label className="label-xs">{label}</label>
      <input
        type={type}
        className="field"
        value={(p[k] as string | number | null) ?? ""}
        onChange={(e) => set(k, type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
      />
    </div>
  );

  return (
    <form onSubmit={save} className="space-y-6">
      <h2 className="font-display text-3xl text-primary">{p.id ? "Edit project" : "New project"}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {text("name", "Name")}
        {text("slug", "Slug (auto if blank)")}
        <div>
          <label className="label-xs">Country / market</label>
          <select className="field" value={p.country ?? "India"} onChange={(e) => {
            const country = e.target.value as Market;
            const [city = ""] = MARKET_CITIES[country];
            setP((current) => ({ ...current, country, city }));
          }}>
            {MARKETS.map((country) => <option key={country}>{country}</option>)}
          </select>
        </div>
        <div>
          <label className="label-xs">City</label>
          <select className="field" value={p.city ?? ""} onChange={(e) => set("city", e.target.value)}>
            {(MARKET_CITIES[(p.country as Market) ?? "India"] ?? []).map((city) => <option key={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label className="label-xs">Property type</label>
          <select className="field" value={p.property_type ?? "Apartment"} onChange={(e) => set("property_type", e.target.value)}>
            {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        {text("bhk", "BHK")}
        {text("developer", "Developer")}
        {text("price_inr", "Price (INR)", "number")}
        {text("price_aed", "Price (AED)", "number")}
        {text("price_aud", "Price (AUD)", "number")}
        {text("price_gbp", "Price (GBP)", "number")}
        {text("price_idr", "Price (IDR)", "number")}
        {text("possession_status", "Possession status")}
        {text("rera_dld_number", "RERA / DLD number")}
        {text("map_lat", "Map latitude", "number")}
        {text("map_lng", "Map longitude", "number")}
      </div>
      <div>
        <label className="label-xs">Amenities (comma separated)</label>
        <input className="field" value={(p.amenities ?? []).join(", ")}
          onChange={(e) => set("amenities", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </div>
      <div>
        <label className="label-xs">Description</label>
        <textarea className="field" rows={4} value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on home page
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label-xs">Cover image</label>
          {p.cover_image_url && <img src={p.cover_image_url} alt="" className="mb-2 h-32 w-full object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => onUpload("cover_image_url", e.target.files?.[0])} />
          {busy === "cover_image_url" && <p className="text-xs text-secondary">Uploading…</p>}
        </div>
        <div>
          <label className="label-xs">Gallery images</label>
          <div className="mb-2 flex flex-wrap gap-2">
            {(p.gallery_urls ?? []).map((u, i) => (
              <div key={u} className="relative">
                <img src={u} alt="" className="h-16 w-20 object-cover" />
                <button type="button" className="absolute right-0 top-0 bg-primary px-1 text-xs text-primary-foreground"
                  onClick={() => set("gallery_urls", (p.gallery_urls ?? []).filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={(e) => onGallery(e.target.files)} />
          {busy === "gallery" && <p className="text-xs text-secondary">Uploading…</p>}
        </div>
        <div>
          <label className="label-xs">Floor plan (PDF)</label>
          {p.floor_plan_url && <a href={p.floor_plan_url} target="_blank" rel="noreferrer" className="mb-2 block text-sm underline">Current file</a>}
          <input type="file" accept="application/pdf,image/*" onChange={(e) => onUpload("floor_plan_url", e.target.files?.[0])} />
          {busy === "floor_plan_url" && <p className="text-xs text-secondary">Uploading…</p>}
        </div>
        <div>
          <label className="label-xs">Brochure (PDF)</label>
          {p.brochure_url && <a href={p.brochure_url} target="_blank" rel="noreferrer" className="mb-2 block text-sm underline">Current file</a>}
          <input type="file" accept="application/pdf" onChange={(e) => onUpload("brochure_url", e.target.files?.[0])} />
          {busy === "brochure_url" && <p className="text-xs text-secondary">Uploading…</p>}
        </div>
      </div>

      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-3">
        <button className="btn-gold" disabled={!!busy}>{busy === "save" ? "Saving…" : "Save project"}</button>
        <button type="button" className="btn-outline" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

/* ---------------- Leads ---------------- */

function LeadsAdmin() {
  const [rows, setRows] = useState<(Lead & { projects: { name: string } | null })[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [src, setSrc] = useState("");
  const [nri, setNri] = useState("");

  useEffect(() => {
    supabase.from("leads").select("*, projects(name)").order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as never) ?? []));
  }, []);

  const sources = useMemo(() => Array.from(new Set(rows.map((r) => r.source_cta))).sort(), [rows]);
  const filtered = rows.filter((r) => {
    const d = r.created_at.slice(0, 10);
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (src && r.source_cta !== src) return false;
    if (nri && String(r.is_nri) !== nri) return false;
    return true;
  });

  function exportCsv() {
    const head = ["Date", "Name", "Phone", "Email", "Country", "NRI", "Project", "Source", "Message"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = filtered.map((r) =>
      [new Date(r.created_at).toISOString(), r.name, r.phone, r.email, r.country, r.is_nri ? "Yes" : "No", r.projects?.name, r.source_cta, r.message].map(esc).join(","),
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `concrest-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        <div><label className="label-xs">From</label><input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="label-xs">To</label><input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div>
          <label className="label-xs">Source</label>
          <select className="field" value={src} onChange={(e) => setSrc(e.target.value)}>
            <option value="">All</option>{sources.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label-xs">Buyer</label>
          <select className="field" value={nri} onChange={(e) => setNri(e.target.value)}>
            <option value="">All</option><option value="true">NRI</option><option value="false">Resident</option>
          </select>
        </div>
        <button className="btn-gold" onClick={exportCsv}>Export CSV ({filtered.length})</button>
      </div>
      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-secondary">
            <tr><th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">NRI</th><th className="p-3">Project</th><th className="p-3">Source</th><th className="p-3">Message</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="whitespace-nowrap p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3 font-medium text-primary">{r.name}<div className="text-xs text-secondary">{r.country}</div></td>
                <td className="p-3">{r.phone}<div className="text-xs text-secondary">{r.email}</div></td>
                <td className="p-3">{r.is_nri ? "Yes" : "—"}</td>
                <td className="p-3">{r.projects?.name ?? "—"}</td>
                <td className="p-3">{r.source_cta}</td>
                <td className="max-w-xs p-3 text-secondary">{r.message}</td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={7} className="p-6 text-center text-secondary">No leads match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
