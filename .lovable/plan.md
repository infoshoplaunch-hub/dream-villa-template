## Mobile Hero Buttons — Unified Glassmorphism Style

### Goal
On mobile viewports only, make all three hero CTA buttons share the same visual style as the current "Επικοινωνία μέσω Viber" button: pill-shaped, semi-transparent (`bg-white/10`), subtle white border (`border-white/25`), backdrop blur, full width, stacked vertically. Desktop styling remains unchanged.

### Scope
Only `src/routes/index.tsx`, specifically the Hero CTA button group.

### Changes
1. Convert the button container from `flex flex-wrap gap-4` to `flex flex-col gap-3` on mobile (`md:flex-row md:flex-wrap md:gap-4` on desktop).
2. "Κάντε Κράτηση" button:
   - Mobile: remove solid accent background, shadow, and `btn-lux-primary`; apply glassmorphism (`bg-white/10`, `border-white/25`, `backdrop-blur-md`, `w-full`).
   - Desktop: keep exactly as it is now (`bg-accent`, shadow, `btn-lux-primary`).
3. "Δείτε τη Βίλα" button:
   - Mobile: adjust to match glassmorphism style (`bg-white/10`, `border-white/25`, `w-full`).
   - Desktop: keep exactly as it is now (`bg-white/5`, `border-white/50`).
4. Move the Viber button into the same flex container so all three stack together on mobile. Keep it hidden on desktop (`md:hidden`).
5. Keep helper text below the Viber button as-is.
6. Preserve all animations, `data-magnetic`, and hover effects.

### No changes to
- Desktop layout or styles
- Booking widget
- Navigation
- Any other section
