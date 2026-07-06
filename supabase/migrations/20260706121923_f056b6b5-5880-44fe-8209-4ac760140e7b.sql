-- Add 'rejected' status for booking requests
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'rejected';

-- Reviews moderation
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  location text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  status review_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public reads only approved reviews
CREATE POLICY "Public can read approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Admins can read every review (regardless of status)
CREATE POLICY "Admins can read all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_set_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();