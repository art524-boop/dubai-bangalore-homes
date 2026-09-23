CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  city text NOT NULL,
  property_type text NOT NULL DEFAULT 'Apartment',
  bhk text,
  price_inr numeric,
  price_aed numeric,
  possession_status text NOT NULL DEFAULT 'Under Construction',
  developer text,
  rera_dld_number text,
  cover_image_url text,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  floor_plan_url text,
  brochure_url text,
  map_lat double precision,
  map_lng double precision,
  description text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly viewable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  country text,
  is_nri boolean NOT NULL DEFAULT false,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  source_cta text NOT NULL DEFAULT 'General Enquiry',
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.projects (slug, name, city, property_type, bhk, price_inr, price_aed, possession_status, developer, rera_dld_number, cover_image_url, gallery_urls, amenities, map_lat, map_lng, description, featured) VALUES
('the-benson-residences', 'The Benson Residences', 'Bangalore', 'Apartment', '3 BHK', 32500000, 1420000, 'Under Construction', 'Prestige Group', 'PRM/KA/RERA/1251/446/PR/240115/006712', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80'], ARRAY['Infinity Pool','Sky Lounge','Concierge','EV Charging','Private Gym','Landscaped Deck'], 12.9716, 77.5946, 'A limited collection of 3 and 4 bedroom residences in central Bangalore, designed around light, cross-ventilation and long city views.', true),
('palm-jumeirah-signature-villas', 'Palm Jumeirah Signature Villas', 'Dubai', 'Villa', '5 BHK', 198000000, 8650000, 'Ready to Move', 'Nakheel', 'DLD-7126-2024', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80'], ARRAY['Private Beach','Home Cinema','Infinity Pool','Smart Home','Maid Quarters'], 25.1124, 55.1390, 'Beachfront signature villas on the Palm with uninterrupted Gulf views, private pools and direct sand access.', true),
('whitefield-atrium', 'Whitefield Atrium', 'Bangalore', 'Apartment', '2 BHK', 12800000, 560000, 'Under Construction', 'Brigade Group', 'PRM/KA/RERA/1251/309/PR/230911/005112', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1600&q=80', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80'], ARRAY['Clubhouse','Rooftop Garden','Kids Play Area','24x7 Security'], 12.9698, 77.7500, 'Efficient 2 and 3 bedroom homes minutes from the Whitefield tech corridor, built around a central landscaped atrium.', true),
('downtown-burj-vista', 'Downtown Burj Vista', 'Dubai', 'Apartment', '2 BHK', 68000000, 2970000, 'Ready to Move', 'Emaar Properties', 'DLD-4412-2023', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80', ARRAY['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80'], ARRAY['Burj Khalifa View','Sky Pool','Valet Parking','Gym & Spa'], 25.1972, 55.2744, 'Downtown residences facing the Burj Khalifa and the Dubai Fountain, finished in stone, oak and bronze.', true),
('sarjapur-courtyard-homes', 'Sarjapur Courtyard Homes', 'Bangalore', 'Villa', '4 BHK', 46000000, 2010000, 'New Launch', 'Sobha Limited', 'PRM/KA/RERA/1251/472/PR/241002/007210', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80', ARRAY['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80'], ARRAY['Private Courtyard','Solar Ready','Clubhouse','Jogging Track'], 12.9010, 77.6870, 'Courtyard-planned villas on Sarjapur Road with double-height living volumes and private landscaped decks.', false),
('dubai-hills-fairway-terraces', 'Dubai Hills Fairway Terraces', 'Dubai', 'Townhouse', '3 BHK', 89000000, 3890000, 'Under Construction', 'Emaar Properties', 'DLD-9081-2025', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80', ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80'], ARRAY['Golf Course View','Community Pool','Retail Boulevard','Parks'], 25.1000, 55.2500, 'Terraced townhouses overlooking the Dubai Hills championship fairway, with generous shaded outdoor rooms.', false);