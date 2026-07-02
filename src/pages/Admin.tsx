import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Lock, ShieldCheck, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  ADMIN_KEY,
  ROLES,
  RoleId,
  StoredApplication,
  isRoleClosed,
  loadApplications,
  saveApplications,
  sendAcceptanceWebhook,
  setRoleClosed,
  upsertApplication,
} from "@/lib/applications";

const SESSION_KEY = "relosta_admin_session_v1";

export default function Admin() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [key, setKey] = useState("");
  const [apps, setApps] = useState<StoredApplication[]>([]);
  const [closedMap, setClosedMap] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [supabaseConnected] = useState(!!supabase);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    refresh();
  }, [authed]);

  // Listen for storage changes from other tabs (or Supabase sync) and refresh.
  useEffect(() => {
    if (!authed) return;
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === "relosta_applications_v1" || e.key === "relosta_closed_roles_v1") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authed]);

  const refresh = () => {
    setApps(loadApplications());
    const map: Record<string, boolean> = {};
    ROLES.forEach((r) => (map[r.id] = isRoleClosed(r.id)));
    setClosedMap(map);
  };

  const submitKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === ADMIN_KEY) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      toast({ title: "Access denied", description: "Invalid key.", variant: "destructive" });
    }
  };

  const toggleClosed = (id: RoleId) => {
    const next = !closedMap[id];
    setRoleClosed(id, next);
    setClosedMap({ ...closedMap, [id]: next });
  };

  const decide = async (app: StoredApplication, status: "accepted" | "rejected") => {
    const updated: StoredApplication = { ...app, status, decidedAt: new Date().toISOString() };
    // Persist via upsert so Supabase receives the status update.
    upsertApplication(updated);
    const all = loadApplications().map((a) => (a.appId === app.appId ? updated : a));
    setApps(all);
    if (status === "accepted") {
      try {
        await sendAcceptanceWebhook(updated);
        toast({ title: "Accepted", description: "Acceptance sent to webhook." });
      } catch (err) {
        console.error(err);
        toast({ title: "Saved, but webhook failed", description: "Please retry.", variant: "destructive" });
      }
    } else {
      toast({ title: "Rejected", description: "Application marked as rejected." });
    }
  };

  const visible = useMemo(
    () => (filter === "all" ? apps : apps.filter((a) => a.status === filter)),
    [apps, filter]
  );

  if (!authed) {
    return (
      <section className="container mx-auto px-4 pt-16 pb-20 max-w-md">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="size-14 mx-auto grid place-items-center rounded-full bg-gradient-brand shadow-glow">
            <Lock className="size-6 text-primary-foreground" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Admin Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter the access key to continue.</p>
          <form onSubmit={submitKey} className="mt-6 space-y-3">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Access key"
              className="w-full bg-input/60 border border-border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="w-full bg-gradient-brand text-primary-foreground font-medium px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-glow">
              Unlock
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pt-10 pb-20">
      {!supabaseConnected && (
        <div className="mb-6 bg-destructive/15 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-destructive">⚠️ Supabase not configured</p>
            <p className="text-destructive/80 text-xs mt-1">Applications won't sync across devices/browsers. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Netlify environment.</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-[hsl(var(--brand))]" />
        <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
      </div>
      <p className="mt-2 text-muted-foreground text-sm">
        Review staff applications, approve or reject candidates, and open/close hiring for each role.
      </p>

      {/* Roles open/close */}
      <div className="glass rounded-3xl p-6 mt-8">
        <h2 className="font-semibold">Role Availability</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const closed = closedMap[r.id];
            return (
              <div key={r.id} className="flex items-center justify-between gap-3 bg-foreground/5 rounded-2xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{closed ? "Applications closed" : "Open for applications"}</p>
                </div>
                <button
                  onClick={() => toggleClosed(r.id)}
                  className={`text-xs px-3 py-1.5 rounded-full ${closed ? "bg-destructive/15 text-destructive" : "bg-foreground/10"}`}
                >
                  {closed ? "Open" : "Close"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applications */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Applications ({apps.length})</h2>
        <div className="flex gap-1 text-xs">
          {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full capitalize ${filter === f ? "bg-foreground/15" : "bg-foreground/5 hover:bg-foreground/10"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="glass rounded-3xl p-8 mt-4 text-center text-sm text-muted-foreground">
          No applications yet. (Note: applications submitted on other devices/browsers won't appear here — every submission is also sent to the Discord webhook.)
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((a) => {
            const open = expanded === a.appId;
            return (
              <div key={a.appId} className="glass rounded-3xl overflow-hidden">
                <button onClick={() => setExpanded(open ? null : a.appId)} className="w-full text-left p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{a.name || "—"}</span>
                      <span className="text-xs text-muted-foreground">· {a.roleTitle}</span>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      ID <code className="font-mono">{a.appId}</code> · {a.discordUsername || "—"} · {new Date(a.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
                {open && (
                  <div className="px-5 pb-5">
                    <div className="space-y-3 border-t border-border/60 pt-4">
                      {a.answers.map((qa, i) => (
                        <div key={i}>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">{qa.question}</p>
                          <p className="text-sm whitespace-pre-wrap mt-1">{qa.answer || "—"}</p>
                        </div>
                      ))}
                    </div>
                    {a.status === "pending" && (
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => decide(a, "accepted")} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-brand text-primary-foreground text-sm hover:opacity-90">
                          <CheckCircle2 className="size-4" /> Accept
                        </button>
                        <button onClick={() => decide(a, "rejected")} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-destructive/15 text-destructive text-sm hover:bg-destructive/25">
                          <XCircle className="size-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: StoredApplication["status"] }) {
  const map = {
    pending: "bg-foreground/10 text-foreground",
    accepted: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-destructive/15 text-destructive",
  } as const;
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${map[status]}`}>{status}</span>;
}