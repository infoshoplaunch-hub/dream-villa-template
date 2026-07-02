
-- Booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  adults integer NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children integer NOT NULL DEFAULT 0 CHECK (children >= 0),
  message text,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (check_out > check_in),
  CHECK (adults + children <= 7)
);

CREATE INDEX bookings_dates_idx ON public.bookings (check_in, check_out) WHERE status <> 'cancelled';

-- Grants (Data API)
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a booking request; force status to 'pending' at insert.
CREATE POLICY "Anyone can submit a booking request"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- No public SELECT/UPDATE/DELETE. Admin management is out of scope for now.

-- Security-definer function to expose ONLY the booked date ranges (no PII)
CREATE OR REPLACE FUNCTION public.get_booked_ranges()
RETURNS TABLE(check_in date, check_out date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT check_in, check_out
  FROM public.bookings
  WHERE status IN ('pending', 'confirmed')
    AND check_out >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_ranges() TO anon, authenticated;
