import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Concrest" },
      { name: "description", content: "Sign in to the Concrest admin panel." },
      { property: "og:title", content: "Admin Sign In — Concrest" },
      { property: "og:description", content: "Sign in to the Concrest admin panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setBusy(true);
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      setMsg(error ? error.message : "Check your email to confirm your account.");
    }
  }

  return (
    <section className="shell flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Concrest Admin</p>
        <h1 className="mt-2 font-display text-4xl text-primary">
          {mode === "in" ? "Sign in" : "Create account"}
        </h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label-xs" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="field" />
          </div>
          <div>
            <label className="label-xs" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required minLength={8} className="field" />
          </div>
          {msg && <p className="text-sm text-secondary">{msg}</p>}
          <button className="btn-gold w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button
          className="mt-4 text-sm text-secondary underline"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}
