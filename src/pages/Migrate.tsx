import { useEffect, useState } from "react";
import { loadApplications, upsertApplication } from "@/lib/applications";

export default function Migrate() {
  const [status, setStatus] = useState<string>("idle");
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const apps = loadApplications();
    setTotal(apps.length);
    if (apps.length === 0) {
      setStatus("No local applications to migrate.");
      return;
    }
    setStatus("Migrating...");
    (async () => {
      let n = 0;
      for (const a of apps) {
        try {
          await upsertApplication(a);
        } catch (e) {
          console.error("migrate error", e);
        }
        n++;
        setDone(n);
      }
      setStatus("Done");
    })();
  }, []);

  return (
    <section className="container mx-auto px-4 pt-10 pb-20 text-center">
      <h1 className="text-2xl font-bold">Migrate local applications to Supabase</h1>
      <p className="mt-4">Status: {status}</p>
      <p className="mt-2">{done} / {total} migrated</p>
      <p className="mt-4 text-sm text-muted-foreground">This page is a one-time migration helper — remove it when finished.</p>
    </section>
  );
}
