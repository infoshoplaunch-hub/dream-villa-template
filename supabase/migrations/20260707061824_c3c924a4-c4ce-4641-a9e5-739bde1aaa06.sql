
-- Remove the overly-permissive public SELECT policies that exposed sensitive columns
DROP POLICY IF EXISTS "Anyone can view blocked dates" ON public.blocked_dates;
DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;

-- Public-facing view for blocked dates: only the date column
CREATE OR REPLACE VIEW public.public_blocked_dates AS
SELECT date FROM public.blocked_dates;

GRANT SELECT ON public.public_blocked_dates TO anon, authenticated;

-- Public-facing view for approved reviews: excludes email PII
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT id, guest_name, location, country, stay_date, title, rating, comment, created_at
FROM public.reviews
WHERE status = 'approved';

GRANT SELECT ON public.public_reviews TO anon, authenticated;
