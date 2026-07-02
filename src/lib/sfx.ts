// Lightweight WebAudio-based SFX — no assets, no deps.
let ctx: AudioContext | null = null;
let muted = false;
let lastPlay = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

type Tone = {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  vol?: number;
  slideTo?: number;
  delay?: number;
};

function play(tones: Tone[]) {
  if (muted) return;
  const now = performance.now();
  if (now - lastPlay < 25) return; // debounce machine-gun events
  lastPlay = now;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime;
  for (const t of tones) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = t.type ?? "sine";
    const start = t0 + (t.delay ?? 0);
    const dur = t.dur ?? 0.08;
    const vol = t.vol ?? 0.05;
    osc.frequency.setValueAtTime(t.freq, start);
    if (t.slideTo) osc.frequency.exponentialRampToValueAtTime(t.slideTo, start + dur);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }
}

export const sfx = {
  hover:  () => play([{ freq: 880, type: "sine", dur: 0.06, vol: 0.025, slideTo: 1320 }]),
  click:  () => play([
    { freq: 520, type: "triangle", dur: 0.05, vol: 0.06, slideTo: 880 },
    { freq: 1200, type: "sine", dur: 0.05, vol: 0.03, delay: 0.03 },
  ]),
  success: () => play([
    { freq: 660, type: "triangle", dur: 0.09, vol: 0.06 },
    { freq: 880, type: "triangle", dur: 0.09, vol: 0.06, delay: 0.08 },
    { freq: 1320, type: "sine", dur: 0.14, vol: 0.05, delay: 0.16 },
  ]),
  pop:    () => play([{ freq: 1500, type: "sine", dur: 0.04, vol: 0.04, slideTo: 600 }]),
  whoosh: () => play([{ freq: 200, type: "sawtooth", dur: 0.18, vol: 0.025, slideTo: 1200 }]),
  setMuted: (v: boolean) => { muted = v; },
  isMuted: () => muted,
};
