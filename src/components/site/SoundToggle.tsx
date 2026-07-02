import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sfx } from "@/lib/sfx";

const KEY = "relosta-sfx-muted";

export default function SoundToggle() {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  });

  useEffect(() => {
    sfx.setMuted(muted);
    try { localStorage.setItem(KEY, muted ? "1" : "0"); } catch {}
  }, [muted]);

  return (
    <button
      id="sfx-toggle"
      data-no-sfx="true"
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      onClick={() => {
        const next = !muted;
        setMuted(next);
        if (!next) sfx.pop();
      }}
    >
      {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
    </button>
  );
}
