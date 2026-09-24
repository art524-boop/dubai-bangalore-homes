ALTER TABLE public.projects
  ADD COLUMN country text NOT NULL DEFAULT 'India',
  ADD COLUMN price_aud numeric,
  ADD COLUMN price_gbp numeric,
  ADD COLUMN price_idr numeric;

UPDATE public.projects
SET country = CASE
  WHEN lower(city) = 'dubai' THEN 'UAE'
  ELSE 'India'
END;