import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Σύνδεση Διαχειριστή — Ekaterini VIP Villa" },
      { name: "description", content: "Σύνδεση διαχειριστή για τη διαχείριση κρατήσεων της Ekaterini VIP Villa." },
      { property: "og:title", content: "Σύνδεση Διαχειριστή — Ekaterini VIP Villa" },
      { property: "og:description", content: "Ιδιωτική περιοχή διαχείρισης — απαιτείται σύνδεση." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Συμπληρώστε email και κωδικό.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Ο λογαριασμός δημιουργήθηκε.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Κάτι πήγε στραβά.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(35_35%_96%)] text-foreground">
      <Toaster position="top-center" />
      <header className="border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container-villa flex items-center justify-between py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Επιστροφή
          </Link>
          <div className="font-serif text-lg">Ekaterini <span className="text-accent">VIP</span> Villa</div>
        </div>
      </header>

      <main className="container-villa flex min-h-[70vh] items-center justify-center py-10">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-8 bg-accent" /> Διαχείριση
          </span>
          <h1 className="mt-3 font-serif text-3xl">
            {mode === "signin" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            {mode === "signin"
              ? "Συνδεθείτε για να διαχειριστείτε το ημερολόγιο διαθεσιμότητας."
              : "Ο πρώτος λογαριασμός γίνεται αυτόματα διαχειριστής."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">Email</label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">Κωδικός</label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Παρακαλώ περιμένετε…" : mode === "signin" ? "Σύνδεση" : "Εγγραφή"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-xs text-foreground/60 hover:text-accent"
          >
            {mode === "signin" ? "Δεν έχετε λογαριασμό; Εγγραφή" : "Έχετε ήδη λογαριασμό; Σύνδεση"}
          </button>
        </div>
      </main>
    </div>
  );
}
