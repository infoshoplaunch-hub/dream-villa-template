import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react";

type PhotoRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

type PhotoWithUrl = PhotoRow & { url: string };

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function GalleryTab() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const photosQuery = useQuery({
    queryKey: ["gallery_photos_admin"],
    queryFn: async (): Promise<PhotoWithUrl[]> => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("id, storage_path, caption, sort_order, created_at")
        .order("sort_order", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as PhotoRow[];
      if (rows.length === 0) return [];
      const { data: signed, error: sErr } = await supabase.storage
        .from("gallery")
        .createSignedUrls(
          rows.map((r) => r.storage_path),
          60 * 60 * 24,
        );
      if (sErr) throw sErr;
      const map = new Map<string, string>();
      (signed ?? []).forEach((s) => {
        if (s.path && s.signedUrl) map.set(s.path, s.signedUrl);
      });
      return rows.map((r) => ({ ...r, url: map.get(r.storage_path) ?? "" }));
    },
  });

  const photos = useMemo(() => photosQuery.data ?? [], [photosQuery.data]);

  const deleteMut = useMutation({
    mutationFn: async (photo: PhotoRow) => {
      const { error: sErr } = await supabase.storage
        .from("gallery")
        .remove([photo.storage_path]);
      if (sErr) throw sErr;
      const { error: dErr } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", photo.id);
      if (dErr) throw dErr;
    },
    onSuccess: () => {
      toast.success("Η φωτογραφία διαγράφηκε");
      qc.invalidateQueries({ queryKey: ["gallery_photos_admin"] });
      qc.invalidateQueries({ queryKey: ["gallery_photos_public"] });
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "Αποτυχία διαγραφής");
    },
  });

  const captionMut = useMutation({
    mutationFn: async (args: { id: string; caption: string }) => {
      const { error } = await supabase
        .from("gallery_photos")
        .update({ caption: args.caption || null })
        .eq("id", args.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Η λεζάντα αποθηκεύτηκε");
      qc.invalidateQueries({ queryKey: ["gallery_photos_admin"] });
      qc.invalidateQueries({ queryKey: ["gallery_photos_public"] });
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "Αποτυχία");
    },
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const invalid = list.find((f) => !ACCEPTED.includes(f.type));
    if (invalid) {
      toast.error(`Μη υποστηριζόμενος τύπος αρχείου: ${invalid.name}`);
      return;
    }
    setUploading(true);
    setProgress({ done: 0, total: list.length });
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    let successCount = 0;
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const rand = Math.random().toString(36).slice(2, 10);
      const path = `${Date.now()}-${rand}.${ext}`;
      try {
        const { error: upErr } = await supabase.storage
          .from("gallery")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const { error: insErr } = await supabase.from("gallery_photos").insert({
          storage_path: path,
          caption: null,
          sort_order: 0,
          created_by: userId ?? null,
        });
        if (insErr) throw insErr;
        successCount++;
      } catch (e) {
        console.error(e);
        toast.error(
          `Αποτυχία για ${file.name}: ${e instanceof Error ? e.message : "άγνωστο σφάλμα"}`,
        );
      }
      setProgress({ done: i + 1, total: list.length });
    }
    setUploading(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (successCount > 0) {
      toast.success(`Ανέβηκαν ${successCount} από ${list.length} φωτογραφίες`);
      qc.invalidateQueries({ queryKey: ["gallery_photos_admin"] });
      qc.invalidateQueries({ queryKey: ["gallery_photos_public"] });
    }
  }

  return (
    <div>
      <div className="rounded-3xl border border-dashed border-border p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Ανέβασμα φωτογραφιών</div>
            <div className="text-xs text-foreground/60">
              JPG, PNG ή WebP. Πολλαπλή επιλογή υποστηρίζεται.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft transition hover:brightness-110 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {progress
                    ? `Ανέβασμα ${progress.done}/${progress.total}...`
                    : "Ανέβασμα..."}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Επιλογή αρχείων
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {photosQuery.isLoading ? (
          <div className="flex items-center justify-center py-16 text-foreground/60">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Φόρτωση...
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-12 text-center text-foreground/60">
            <ImageIcon className="mx-auto mb-3 h-8 w-8 opacity-50" />
            Δεν υπάρχουν ακόμη φωτογραφίες. Ανέβασε την πρώτη!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                onDelete={() => {
                  if (confirm("Σίγουρα διαγραφή αυτής της φωτογραφίας;")) {
                    deleteMut.mutate(p);
                  }
                }}
                onSaveCaption={(caption) => captionMut.mutate({ id: p.id, caption })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoCard({
  photo,
  onDelete,
  onSaveCaption,
}: {
  photo: PhotoWithUrl;
  onDelete: () => void;
  onSaveCaption: (caption: string) => void;
}) {
  const [caption, setCaption] = useState(photo.caption ?? "");
  const dirty = caption !== (photo.caption ?? "");
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="aspect-square w-full overflow-hidden bg-muted/40">
        <img
          src={photo.url}
          alt={photo.caption ?? "gallery photo"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 p-3">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Λεζάντα (προαιρετικό)"
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
        />
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={!dirty}
            onClick={() => onSaveCaption(caption)}
            className="rounded-md bg-foreground/5 px-2 py-1 text-xs font-medium text-foreground/80 transition hover:bg-foreground/10 disabled:opacity-40"
          >
            Αποθήκευση
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Διαγραφή"
            className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Διαγραφή
          </button>
        </div>
      </div>
    </div>
  );
}
