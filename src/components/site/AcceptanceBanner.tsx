import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import {
  getMyAppIds,
  getSeenAccepted,
  loadApplications,
  markAcceptedSeen,
  StoredApplication,
} from "@/lib/applications";

export default function AcceptanceBanner() {
  const [accepted, setAccepted] = useState<StoredApplication[]>([]);

  useEffect(() => {
    const check = () => {
      const mine = new Set(getMyAppIds());
      const seen = new Set(getSeenAccepted());
      const all = loadApplications();
      setAccepted(all.filter((a) => mine.has(a.appId) && a.status === "accepted" && !seen.has(a.appId)));
    };
    check();
    const t = setInterval(check, 3000);
    window.addEventListener("storage", check);
    return () => {
      clearInterval(t);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (accepted.length === 0) return null;

  const dismiss = (id: string) => {
    markAcceptedSeen(id);
    setAccepted((arr) => arr.filter((a) => a.appId !== id));
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[min(640px,calc(100vw-2rem))] space-y-2">
      {accepted.map((a) => (
        <div key={a.appId} className="glass rounded-2xl p-4 flex items-start gap-3 shadow-glow">
          <div className="size-9 grid place-items-center rounded-xl bg-gradient-brand shrink-0">
            <CheckCircle2 className="size-5 text-primary-foreground" />
          </div>
          <div className="flex-1 text-sm">
            <p className="font-semibold">Your application was accepted 🎉</p>
            <p className="text-muted-foreground mt-0.5">
              <span className="text-foreground">{a.roleTitle}</span> · Open a ticket in the Relosta Media Discord and send your Application ID:
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <code className="font-mono text-xs px-2 py-1 rounded-lg bg-foreground/10">{a.appId}</code>
              <a
                href="https://discord.gg/9QqyGScgdj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full bg-gradient-brand text-primary-foreground hover:opacity-90"
              >
                Join Discord
              </a>
              <Link to="/jobs" className="text-xs px-3 py-1 rounded-full bg-foreground/10 hover:bg-foreground/15">
                View Jobs
              </Link>
            </div>
          </div>
          <button onClick={() => dismiss(a.appId)} aria-label="Dismiss" className="size-8 grid place-items-center rounded-lg hover:bg-foreground/10">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}