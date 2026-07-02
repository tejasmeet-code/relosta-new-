import { useMemo, useState } from "react";
import { ArrowLeft, Briefcase, CheckCircle2, Copy, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ROLES,
  Role,
  RoleId,
  generateAppId,
  isRoleClosed,
  rememberMyAppId,
  sendApplicationWebhook,
  upsertApplication,
} from "@/lib/applications";

type Mode = "list" | "detail" | "apply";

export default function Jobs() {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("list");
  const [activeId, setActiveId] = useState<RoleId | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ appId: string; roleTitle: string } | null>(null);

  const role: Role | undefined = useMemo(
    () => ROLES.find((r) => r.id === activeId),
    [activeId]
  );

  const openDetail = (id: RoleId) => {
    setActiveId(id);
    setAnswers({});
    setSubmitted(null);
    setMode("detail");
  };

  const startApply = () => {
    if (!role) return;
    if (isRoleClosed(role.id)) {
      toast({ title: "Applications closed", description: "This role is not accepting applications right now.", variant: "destructive" });
      return;
    }
    setMode("apply");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    // basic required check
    for (let i = 0; i < role.questions.length; i++) {
      if (!(answers[i] && answers[i].trim())) {
        toast({ title: "Please answer all questions", description: role.questions[i], variant: "destructive" });
        return;
      }
    }
    setSubmitting(true);
    try {
      const appId = generateAppId();
      const qa = role.questions.map((q, i) => ({ question: q, answer: answers[i].trim() }));
      const app = {
        appId,
        roleId: role.id,
        roleTitle: role.title,
        submittedAt: new Date().toISOString(),
        status: "pending" as const,
        name: qa[0]?.answer ?? "",
        discordUsername: qa[3]?.answer ?? "",
        discordUserId: qa[4]?.answer ?? "",
        answers: qa,
      };
      upsertApplication(app);
      rememberMyAppId(appId);
      try {
        await sendApplicationWebhook(app);
      } catch (err) {
        console.error("Webhook failed", err);
        toast({ title: "Submitted locally", description: "Application saved, but webhook delivery failed.", variant: "destructive" });
      }
      setSubmitted({ appId, roleTitle: role.title });
    } catch (err) {
      console.error(err);
      toast({ title: "Could not submit", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ---- list view ----
  if (mode === "list") {
    return (
      <>
        <section className="container mx-auto px-4 pt-10 pb-10 text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Careers · Jobs
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold">
            Join the <span className="text-gradient-brand">team</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Operations, growth, marketing, community. Pick the role that fits you and apply — every answer goes
            straight to our hiring desk.
          </p>
        </section>

        {(["Execution & Operations", "Management"] as const).map((tier) => (
          <section key={tier} className="container mx-auto px-4 pb-10">
            <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">{tier} Tier</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {ROLES.filter((r) => r.tier === tier).map((r) => {
                const closed = isRoleClosed(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => openDetail(r.id)}
                    className="text-left glass rounded-3xl p-6 hover:-translate-y-1 transition relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-11 grid place-items-center rounded-2xl bg-gradient-brand shadow-glow">
                        <Briefcase className="size-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{r.title}</h3>
                        <p className="text-xs text-muted-foreground">{r.tagline}</p>
                      </div>
                      {closed && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-destructive/15 text-destructive flex items-center gap-1">
                          <Lock className="size-3" /> Closed
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </>
    );
  }

  // ---- detail view ----
  if (mode === "detail" && role) {
    const closed = isRoleClosed(role.id);
    return (
      <section className="container mx-auto px-4 pt-6 pb-20 max-w-3xl">
        <button onClick={() => setMode("list")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All roles
        </button>
        <h1 className="mt-5 text-4xl md:text-5xl font-bold">{role.title}</h1>
        <p className="mt-2 text-muted-foreground">{role.tagline}</p>

        <div className="glass rounded-3xl p-7 mt-8">
          <h2 className="text-xl font-semibold">Compensation & Benefits</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {role.benefits.map((b) => (
              <li key={b} className="flex gap-3">
                <CheckCircle2 className="size-4 text-[hsl(var(--brand))] mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={startApply}
            disabled={closed}
            className="flex-1 bg-gradient-brand text-primary-foreground font-medium px-6 py-3.5 rounded-2xl hover:opacity-90 disabled:opacity-50 transition shadow-glow"
          >
            {closed ? "Applications Closed" : "Apply Now"}
          </button>
          <button onClick={() => setMode("list")} className="px-6 py-3.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-sm">
            Back
          </button>
        </div>
      </section>
    );
  }

  // ---- apply view ----
  if (mode === "apply" && role) {
    if (submitted) {
      return <SubmittedView appId={submitted.appId} roleTitle={submitted.roleTitle} onDone={() => { setMode("list"); setSubmitted(null); }} />;
    }
    const field = "w-full bg-input/60 border border-border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition";
    return (
      <section className="container mx-auto px-4 pt-6 pb-20 max-w-3xl">
        <button onClick={() => setMode("detail")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to role
        </button>
        <h1 className="mt-5 text-3xl md:text-4xl font-bold">{role.title} — Application</h1>
        <p className="mt-2 text-sm text-muted-foreground">All fields are required. Submissions are sent directly to our hiring desk.</p>

        <form onSubmit={onSubmit} className="glass rounded-3xl p-6 md:p-8 mt-6 space-y-4">
          {role.questions.map((q, i) => {
            const isShort = i < 5; // base info
            return (
              <div key={i}>
                <label className="text-sm text-muted-foreground">{q}</label>
                {isShort ? (
                  <input
                    className={field}
                    value={answers[i] || ""}
                    onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                    maxLength={120}
                    required
                  />
                ) : (
                  <textarea
                    className={`${field} min-h-[110px] resize-y`}
                    value={answers[i] || ""}
                    onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                    maxLength={2000}
                    required
                  />
                )}
              </div>
            );
          })}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-brand text-primary-foreground font-medium px-6 py-3.5 rounded-2xl hover:opacity-90 disabled:opacity-60 transition shadow-glow"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    );
  }

  return null;
}

function SubmittedView({ appId, roleTitle, onDone }: { appId: string; roleTitle: string; onDone: () => void }) {
  const { toast } = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(appId);
      toast({ title: "Copied", description: "Application ID copied to clipboard." });
    } catch {}
  };
  return (
    <section className="container mx-auto px-4 pt-10 pb-20 max-w-2xl text-center">
      <div className="size-16 mx-auto grid place-items-center rounded-full bg-gradient-brand shadow-glow">
        <CheckCircle2 className="size-8 text-primary-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">Application Submitted</h1>
      <p className="mt-3 text-muted-foreground">
        Thanks for applying for <span className="text-foreground font-medium">{roleTitle}</span>. Save your Application ID
        below — if accepted, you'll need it when opening a ticket in the Relosta Media Discord.
      </p>
      <div className="glass rounded-3xl p-6 mt-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Application ID</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <code className="text-lg md:text-2xl font-mono px-4 py-2 rounded-xl bg-foreground/5">{appId}</code>
          <button onClick={copy} className="size-10 grid place-items-center rounded-xl bg-foreground/5 hover:bg-foreground/10" aria-label="Copy">
            <Copy className="size-4" />
          </button>
        </div>
      </div>
      <button onClick={onDone} className="mt-8 px-6 py-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-sm">
        Back to Jobs
      </button>
    </section>
  );
}