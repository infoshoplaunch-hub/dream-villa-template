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
