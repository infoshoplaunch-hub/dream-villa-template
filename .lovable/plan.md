## Goal

Convert `/admin` into a single tabbed dashboard covering availability, booking requests, reviews, and gallery — without touching auth, calendar functionality, or the current visual style.

## Structure

`src/routes/_authenticated/admin.tsx` becomes the shell with 4 tabs. Each tab body is extracted to its own component file so the shell stays readable and state stays local per feature.

```text
src/routes/_authenticated/admin.tsx      → shell + tab nav + auth/header (existing)
src/components/admin/AvailabilityTab.tsx → current calendar UI moved as-is
src/components/admin/BookingsTab.tsx     → NEW – requests list + status control
src/components/admin/ReviewsTab.tsx      → NEW – reviews moderation
src/components/admin/GalleryTab.tsx      → gallery mgmt (from admin.gallery.tsx)
```

Tab state lives in URL search (`?tab=calendar|bookings|reviews|gallery`) so refresh/back keep the tab, and the pending-bookings pill in the header can link straight to the requests tab.

`src/routes/_authenticated/admin.gallery.tsx` is kept as a thin redirect to `/admin?tab=gallery` so old bookmarks and the current "Διαχείριση Gallery" button don't break; it holds no logic.

## Database changes (one migration)

1. `ALTER TYPE booking_status ADD VALUE 'rejected'` — needed for the "Reject" action in Bookings tab.
2. New `public.reviews` table:
   - `guest_name text`, `rating int check 1–5`, `comment text`, `location text` (optional), `status review_status` (enum `pending|approved|rejected`, default `pending`), plus `id`, `created_at`, `updated_at`.
3. Grants + RLS:
   - `TO anon SELECT` on approved rows only (public site can read published reviews).
   - `TO authenticated` full CRUD gated by `has_role(auth.uid(),'admin')`.
   - `TO service_role ALL`.
4. `updated_at` trigger reusing the standard `update_updated_at_column` pattern.

No changes to `bookings`, `blocked_dates`, or `gallery_photos` beyond the enum addition.

## Tab behaviors

**Ημερολόγιο Διαθεσιμότητας** — existing calendar, blocked list, notes, presets, and confirm dialogs moved verbatim into `AvailabilityTab`. No logic changes.

**Αιτήματα Κράτησης** — fetches `bookings` (already admin-only via RLS). Table/cards showing guest, dates, nights, guests count, contact, message, status pill. Row actions: Confirm / Reject / Set pending / Delete, wired through a single `updateStatusMutation` + `deleteMutation`. Detail view via a `Dialog` for the full message + contact. Filter chips for status; sort by check-in.

**Κριτικές Πελατών** — fetches `reviews`. Same card pattern with status pill and Approve / Reject / Delete actions. Empty state explains no submitted reviews yet. The public `#reviews` section on the homepage is updated to prefer approved DB rows when present and fall back to the existing hardcoded `t.reviews.items` otherwise, so the current design keeps working with an empty table.

**Gallery** — the exact upload + grid + caption + delete UI from `admin.gallery.tsx`, unchanged, rendered inside the tab.

## Tab nav UI

Sticky tab bar under the existing admin header, pill-style, matching the current accent/border tokens. Tabs render:

```text
[ Ημερολόγιο ] [ Αιτήματα (3) ] [ Κριτικές (2) ] [ Gallery ]
```

Pending-bookings and pending-reviews counts show as badges on their tab labels. On mobile the bar scrolls horizontally.

## Non-goals

- No change to auth flow, `_authenticated` gate, or `/auth`.
- No change to public booking form, pricing engine, or emails.
- No new public "submit a review" form (out of scope; admin manages what's there).
- No visual redesign — reuses existing card/border/shadow tokens.

## Order of execution

1. Run the migration (adds `rejected`, creates `reviews`, grants + policies).
2. After migration approval + types regen: extract calendar into `AvailabilityTab`, add `BookingsTab`, `ReviewsTab`, and `GalleryTab`, then rewrite `admin.tsx` as the tab shell.
3. Point `admin.gallery.tsx` at `/admin?tab=gallery`.
4. Wire public `#reviews` fallback.
