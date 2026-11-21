import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const CHECKPOINT_XP = 100;
const TOAST_DURATION_MS = 3200;
const TOAST_GAP_MS = 180;

/**
 * Tracks which quest zone (page section) is in view, awards XP for newly reached
 * checkpoints, and runs a queue of "checkpoint reached" toasts.
 */
export function useQuest(zones) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  const discovered = useRef(new Set([0]));
  const queue = useRef([]);
  const toastActive = useRef(false);
  const toastId = useRef(0);

  const awardXp = useCallback((points) => setXp((current) => current + points), []);

  const enqueueToast = useCallback((name, points) => {
    queue.current.push({ id: ++toastId.current, name, points });
    if (toastActive.current) return;
    toastActive.current = true;
    setToast(queue.current.shift());
  }, []);

  // Play each toast: hidden -> visible for a few seconds -> hidden -> next in queue.
  useEffect(() => {
    if (!toast) return undefined;
    const timers = [];
    setToastVisible(false);
    const frame = requestAnimationFrame(() => {
      setToastVisible(true);
      timers.push(
        setTimeout(() => {
          setToastVisible(false);
          timers.push(
            setTimeout(() => {
              const next = queue.current.shift();
              if (next) setToast(next);
              else toastActive.current = false;
            }, TOAST_GAP_MS)
          );
        }, TOAST_DURATION_MS)
      );
    });
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, [toast]);

  // Work out the active zone from scroll position (layout effect so the first paint is already correct).
  useLayoutEffect(() => {
    let lastIndex = -1;

    const update = () => {
      const focusLine = window.innerHeight * 0.45;
      let index = 0;
      zones.forEach((zone, i) => {
        const el = document.getElementById(zone.id);
        if (el && el.getBoundingClientRect().top <= focusLine) index = i;
      });
      if (index === lastIndex) return;
      lastIndex = index;
      setActiveIndex(index);

      for (let i = 1; i <= index; i += 1) {
        if (discovered.current.has(i)) continue;
        discovered.current.add(i);
        awardXp(CHECKPOINT_XP);
        enqueueToast(zones[i].name, CHECKPOINT_XP);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [zones, awardXp, enqueueToast]);

  return { activeIndex, xp, awardXp, toast, toastVisible };
}
