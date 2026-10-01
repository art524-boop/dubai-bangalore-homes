CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  location text NOT NULL,
  project_year integer,
  built_up_area text,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  is_illustrative boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_projects_year_check CHECK (project_year IS NULL OR project_year BETWEEN 1900 AND 2200)
);
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio projects are publicly viewable" ON public.portfolio_projects FOR SELECT TO public USING (true);
CREATE POLICY "Admins can add portfolio projects" ON public.portfolio_projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio projects" ON public.portfolio_projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio projects" ON public.portfolio_projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.portfolio_projects (project_name, location, project_year, built_up_area, before_image_url, after_image_url, is_illustrative, display_order) VALUES
('Courtyard House', 'Sarjapur Road, India', 2024, '3,800 sq ft', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80', true, 1),
('The Grey Villa', 'Whitefield, India', 2023, '4,200 sq ft', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80', true, 2),
('Banyan Residence', 'Hebbal, India', 2024, '3,600 sq ft', 'https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=1400&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80', true, 3),
('Stone & Teak House', 'Kanakapura Road, India', 2022, '4,800 sq ft', 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1400&q=80', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=80', true, 4);