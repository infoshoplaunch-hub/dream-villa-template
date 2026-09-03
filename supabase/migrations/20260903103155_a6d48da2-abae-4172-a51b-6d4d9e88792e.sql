-- Make views run as the querying user (no SECURITY DEFINER behaviour)
ALTER VIEW public.public_blocked_dates SET (security_invoker = on);
ALTER VIEW public.public_reviews SET (security_invoker = on);

-- blocked_dates: anon may read only the date column, admins read everything
REVOKE SELECT ON public.blocked_dates FROM anon;
GRANT SELECT (date) ON public.blocked_dates TO anon;
GRANT SELECT ON public.blocked_dates TO authenticated;

DROP POLICY IF EXISTS "Public can read blocked dates" ON public.blocked_dates;
CREATE POLICY "Anon can read blocked dates"
  ON public.blocked_dates FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Admins can read blocked dates" ON public.blocked_dates;
CREATE POLICY "Admins can read blocked dates"
  ON public.blocked_dates FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- reviews: anon may read approved rows, excluding the email column
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, guest_name, location, country, stay_date, title, rating, comment, status, created_at, updated_at)
  ON public.reviews TO anon;

DROP POLICY IF EXISTS "Anon can read approved reviews" ON public.reviews;
CREATE POLICY "Anon can read approved reviews"
  ON public.reviews FOR SELECT TO anon
  USING (status = 'approved'::review_status);

-- views themselves must stay readable
GRANT SELECT ON public.public_blocked_dates TO anon, authenticated;
GRANT SELECT ON public.public_reviews TO anon, authenticated;