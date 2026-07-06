
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS stay_date text,
  ADD COLUMN IF NOT EXISTS country text;

GRANT INSERT ON public.reviews TO anon;
GRANT INSERT ON public.reviews TO authenticated;

DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.reviews;
CREATE POLICY "Public can submit pending reviews"
  ON public.reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending'::review_status);
