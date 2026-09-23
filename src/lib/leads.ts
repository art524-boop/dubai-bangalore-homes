import { supabase } from "@/integrations/supabase/client";

export type LeadInput = {
  name: string;
  phone?: string | null;
  email?: string | null;
  country?: string | null;
  is_nri?: boolean;
  project_id?: string | null;
  source_cta: string;
  message?: string | null;
};

export async function createLead(input: LeadInput) {
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new Error("Please enter your name.");
  const { error } = await supabase.from("leads").insert({
    name,
    phone: input.phone?.trim().slice(0, 30) || null,
    email: input.email?.trim().slice(0, 255) || null,
    country: input.country?.trim().slice(0, 80) || null,
    is_nri: input.is_nri ?? false,
    project_id: input.project_id ?? null,
    source_cta: input.source_cta,
    message: input.message?.trim().slice(0, 2000) || null,
  });
  if (error) throw new Error(error.message);
}
