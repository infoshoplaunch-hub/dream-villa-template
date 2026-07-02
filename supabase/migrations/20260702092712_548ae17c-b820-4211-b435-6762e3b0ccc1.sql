-- Drop unused SECURITY DEFINER function (booking UI removed)
DROP FUNCTION IF EXISTS public.get_booked_ranges();

-- Explicit restrictive SELECT policy on bookings: no one can read via the API.
-- Booking rows contain PII (name, email, phone) and must remain inaccessible
-- through PostgREST. Admin access should go through the service role only.
CREATE POLICY "No client read access to bookings"
  ON public.bookings
  AS RESTRICTIVE
  FOR SELECT
  TO anon, authenticated
  USING (false);