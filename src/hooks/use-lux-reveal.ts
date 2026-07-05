import { useEffect } from "react";

/**
 * Global luxury scroll-reveal orchestrator.
 *
 * Watches:
 *   - every `<section>` inside `<main>` — adds `data-lux-section` + `.lux-in` on entry
 *   - every element with `[data-lux-reveal]` — adds `.lux-in` on entry
 *   - every element with `[data-lux-stagger]` — adds `.lux-in` on entry (children stagger via CSS)
 *
 * Reveals fire once per element (unobserved after).
 * Respects `prefers-reduced-motion` by short-circuiting the observer.
 */
export function useLuxReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Collect targets
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section"),
    );
    sections.forEach((el) => {
      if (!el.hasAttribute("data-lux-section")) {
        el.setAttribute("data-lux-section", "");
      }
    });

    const opts: HTMLElement[] = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-lux-section], [data-lux-reveal], [data-lux-stagger]",
      ),
    );

    if (reduce) {
      opts.forEach((el) => el.classList.add("lux-in"));
      return;
    }

    // If already in view at mount (above-the-fold hero, initial section),
    // mark them immediately so nothing pops or stays invisible.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    opts.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.85 && rect.bottom > 0) {
        el.classList.add("lux-in");
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("lux-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    opts.forEach((el) => {
      if (!el.classList.contains("lux-in")) io.observe(el);
    });

    return () => io.disconnect();
  }, []);
}

/**
 * Subtle magnetic hover for premium buttons.
 * Attaches to every element carrying `[data-magnetic]`.
 * Max travel: ±4px on both axes. Writes CSS vars `--mag-x` / `--mag-y`
 * consumed by `.btn-lux` transform. Disabled under prefers-reduced-motion.
 */
export function useLuxMagnetic() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const MAX = 4;
    const STRENGTH = 0.35;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    );

    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));

    const handlers: Array<{ el: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }> = [];

    els.forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        el.style.setProperty("--mag-x", `${clamp(dx)}px`);
        el.style.setProperty("--mag-y", `${clamp(dy)}px`);
      };
      const leave = () => {
        el.style.setProperty("--mag-x", "0px");
        el.style.setProperty("--mag-y", "0px");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      handlers.push({ el, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        el.style.removeProperty("--mag-x");
        el.style.removeProperty("--mag-y");
      });
    };
  }, []);
}
