import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type BookedRange = { from: Date; to: Date };

export async function fetchBookedRanges(): Promise<BookedRange[]> {
  const { data, error } = await supabase.rpc("get_booked_ranges");
  if (error) {
    console.error("Failed to load booked ranges", error);
    return [];
  }
  return (data ?? []).map((r: { check_in: string; check_out: string }) => ({
    from: new Date(r.check_in + "T00:00:00"),
    to: new Date(r.check_out + "T00:00:00"),
  }));
}

export function rangeOverlaps(
  from: Date,
  to: Date,
  ranges: BookedRange[],
): boolean {
  return ranges.some((r) => from < r.to && to > r.from);
}

export function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseIsoDate(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(s + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export const MAX_GUESTS = 7;

export const bookingFormSchema = z.object({
  guest_name: z.string().trim().min(2, "required").max(100),
  email: z.string().trim().email("email").max(255),
  phone: z.string().trim().min(5, "required").max(50),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
