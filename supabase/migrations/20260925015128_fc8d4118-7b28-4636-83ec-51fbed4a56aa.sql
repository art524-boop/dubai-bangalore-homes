DROP POLICY "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT TO public
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 200
    AND (phone IS NOT NULL OR email IS NOT NULL)
    AND (phone IS NULL OR length(phone) <= 40)
    AND (email IS NULL OR (length(email) <= 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
    AND (message IS NULL OR length(message) <= 2000)
  );