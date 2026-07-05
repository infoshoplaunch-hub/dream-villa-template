import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLuxReveal, useLuxMagnetic } from "@/hooks/use-lux-reveal";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Loader2, Maximize2 } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Ekaterini VIP Villa" },
      {
        name: "description",
        content:
          "Δείτε φωτογραφίες από την Ekaterini VIP Villa στην Πλάκα Αποκορώνου Χανίων — εσωτερικοί χώροι, πισίνα, θέα και παροχές.",
      },
      { property: "og:title", content: "Gallery — Ekaterini VIP Villa" },
      {
        property: "og:description",
        content: "Φωτογραφίες από τη βίλα, τους χώρους και τη θέα.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

type PhotoRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

type PhotoWithUrl = PhotoRow & { url: string };

function GalleryPage() {
  useLuxReveal();
  useLuxMagnetic();
  const query = useQuery({
    queryKey: ["gallery_photos_public"],
    queryFn: async (): Promise<PhotoWithUrl[]> => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("id, storage_path, caption, sort_order, created_at")
        .order("sort_order", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as PhotoRow[];
      if (rows.length === 0) return [];
      const paths = rows.map((r) => r.storage_path);
      const { data: signed, error: sErr } = await supabase.storage
        .from("gallery")
        .createSignedUrls(paths, 60 * 60 * 24 * 7); // 7 days
      if (sErr) throw sErr;
      const map = new Map<string, string>();
      (signed ?? []).forEach((s) => {
        if (s.path && s.signedUrl) map.set(s.path, s.signedUrl);
      });
      return rows.map((r) => ({ ...r, url: map.get(r.storage_path) ?? "" }));
    },
  });

  const photos = query.data ?? [];
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, prev, next]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container-villa flex items-center justify-between py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-accent transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Επιστροφή στην αρχική
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Gallery
          </span>
        </div>
      </header>

      <main className="container-villa py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Gallery
          </h1>
          <p className="mt-4 text-sm text-foreground/70 md:text-base">
            Μια περιήγηση στους χώρους, την πισίνα και τη θέα της βίλας μας.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          {query.isLoading ? (
            <div className="flex items-center justify-center py-24 text-foreground/60">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Φόρτωση...
            </div>
          ) : query.isError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
              Δεν ήταν δυνατή η φόρτωση των φωτογραφιών.
            </div>
          ) : photos.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-12 text-center text-foreground/60">
              Δεν υπάρχουν ακόμη φωτογραφίες.
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="group mb-4 block w-full overflow-hidden rounded-2xl bg-muted/40 shadow-soft transition hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)]"
                >
                  <img
                    src={p.url}
                    alt={p.caption ?? "Ekaterini VIP Villa"}
                    loading="lazy"
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Κλείσιμο"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Προηγούμενη"
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Επόμενη"
                className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={photos[lightbox].url}
            alt={photos[lightbox].caption ?? "Ekaterini VIP Villa"}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}
