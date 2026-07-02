import { useEffect } from "react";
import { sfx } from "@/lib/sfx";

// Attaches global hover/click sound effects to interactive elements.
// Honors data-no-sfx="true" on any element to opt-out.
export function useGlobalSfx() {
  useEffect(() => {
    const isInteractive = (el: EventTarget | null): HTMLElement | null => {
      if (!(el instanceof HTMLElement)) return null;
      const target = el.closest<HTMLElement>(
        'button, a, [role="button"], input[type="submit"], summary'
      );
      if (!target) return null;
      if (target.closest('[data-no-sfx="true"]')) return null;
      if (target.hasAttribute("disabled")) return null;
      return target;
    };

    const onPointerOver = (e: PointerEvent) => {
      // pointerover bubbles; only fire on entering a new interactive
      const t = isInteractive(e.target);
      const r = isInteractive(e.relatedTarget as EventTarget | null);
      if (t && t !== r) sfx.hover();
    };
    const onClick = (e: MouseEvent) => {
      if (isInteractive(e.target)) sfx.click();
    };
    const onSubmit = () => sfx.success();

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);
}
