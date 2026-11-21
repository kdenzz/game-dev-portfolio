import { useCallback, useEffect, useRef, useState } from "react";
import { WORLD, createState, step } from "./game/engine.js";
import { render } from "./game/render.js";

const FIXED_DT = 1 / 120;
const MAX_FRAME_DT = 0.1;
const BEST_KEY = "courier-run-best";
const JUMP_KEYS = new Set([" ", "Spacebar", "ArrowUp", "w", "W"]);
const DUCK_KEYS = new Set(["ArrowDown", "s", "S"]);

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(Math.floor(value)));
  } catch {
    // Storage can be unavailable (private mode); the best score just won't persist.
  }
}

// Space/Enter on a focused link or button should keep its normal meaning.
const isInteractive = (target) => target instanceof Element && target.closest("a, button, input, textarea, select");

export default function RunnerGame() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const stateRef = useRef(createState());
  const inputRef = useRef({ jumpHeld: false, jumpPressed: false, duckHeld: false });
  const phaseRef = useRef("ready");
  const bestRef = useRef(readBest());
  const scaleRef = useRef(1);

  const [phase, setPhaseState] = useState("ready");
  const [result, setResult] = useState({ score: 0, best: bestRef.current, newBest: false });

  const setPhase = useCallback((next) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    render(canvas.getContext("2d"), stateRef.current, bestRef.current, scaleRef.current);
  }, []);

  const start = useCallback(() => {
    stateRef.current = createState();
    inputRef.current = { jumpHeld: false, jumpPressed: false, duckHeld: false };
    setPhase("running");
  }, [setPhase]);

  const pause = useCallback(() => {
    if (phaseRef.current === "running") setPhase("paused");
  }, [setPhase]);

  // Primary action (Space / tap): start, resume, restart, or jump.
  const primary = useCallback(() => {
    const current = phaseRef.current;
    if (current === "ready" || current === "over") start();
    else if (current === "paused") setPhase("running");
    else {
      inputRef.current.jumpPressed = true;
      inputRef.current.jumpHeld = true;
    }
  }, [setPhase, start]);

  // Resize the canvas to its container, keeping the world's aspect ratio and a crisp DPR.
  useEffect(() => {
    const frame = frameRef.current;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = frame.clientWidth;
      const canvas = canvasRef.current;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round((cssWidth * WORLD.height * dpr) / WORLD.width);
      scaleRef.current = canvas.width / WORLD.width;
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    resize();
    // Redraw once the mono font is ready so the HUD text uses it.
    document.fonts?.ready.then(draw);
    return () => observer.disconnect();
  }, [draw]);

  // Game loop with a fixed simulation step.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const tick = (now) => {
      const frameDt = Math.min(MAX_FRAME_DT, (now - last) / 1000);
      last = now;

      if (phaseRef.current === "running") {
        acc += frameDt;
        const state = stateRef.current;
        while (acc >= FIXED_DT && !state.over) {
          step(state, inputRef.current, FIXED_DT);
          inputRef.current.jumpPressed = false;
          acc -= FIXED_DT;
        }
        if (state.over) {
          acc = 0;
          const newBest = state.score > bestRef.current;
          if (newBest) {
            bestRef.current = state.score;
            saveBest(state.score);
          }
          setResult({ score: Math.floor(state.score), best: Math.floor(bestRef.current), newBest });
          setPhase("over");
        }
      } else {
        acc = 0;
      }

      draw();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw, setPhase]);

  // Keyboard controls.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const jump = JUMP_KEYS.has(event.key) || (event.key === "Enter" && phaseRef.current !== "running");
      const duck = DUCK_KEYS.has(event.key);
      if (!jump && !duck) return;
      if (isInteractive(event.target) && (event.key === " " || event.key === "Enter")) return;

      event.preventDefault(); // stop Space / arrows from scrolling the page
      if (jump && !event.repeat) primary();
      if (duck && phaseRef.current === "running") inputRef.current.duckHeld = true;
    };
    const onKeyUp = (event) => {
      if (JUMP_KEYS.has(event.key)) inputRef.current.jumpHeld = false;
      if (DUCK_KEYS.has(event.key)) inputRef.current.duckHeld = false;
    };
    const onHide = () => {
      inputRef.current = { jumpHeld: false, jumpPressed: false, duckHeld: false };
      pause();
    };
    const onVisibility = () => document.hidden && onHide();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pause, primary]);

  // Touch / mouse: tap to jump (hold for a higher jump), swipe down to duck.
  const pointerStart = useRef(null);
  const onPointerDown = (event) => {
    if (isInteractive(event.target)) return;
    pointerStart.current = event.clientY;
    primary();
  };
  const onPointerMove = (event) => {
    if (pointerStart.current === null || phaseRef.current !== "running") return;
    if (event.clientY - pointerStart.current > 24) {
      inputRef.current.duckHeld = true;
      inputRef.current.jumpHeld = false;
    }
  };
  const onPointerUp = () => {
    pointerStart.current = null;
    inputRef.current.jumpHeld = false;
    inputRef.current.duckHeld = false;
  };

  return (
    <div className="runner">
      <div
        ref={frameRef}
        className={`runner-frame is-${phase}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <canvas ref={canvasRef} className="runner-canvas" aria-label="Courier Run game" role="img" />

        {phase !== "running" && (
          <div className="runner-overlay">
            {phase === "ready" && (
              <>
                <p className="eyebrow">
                  <span className="live-dot"></span> READY PLAYER ONE
                </p>
                <strong className="runner-overlay-title">Deliver the parcel.</strong>
                <button className="button button-primary" type="button" onClick={start}>
                  Start run <span aria-hidden="true">▶</span>
                </button>
                <span className="runner-overlay-hint">or press SPACE · tap the screen</span>
              </>
            )}
            {phase === "paused" && (
              <>
                <p className="eyebrow">GAME PAUSED</p>
                <button className="button button-primary" type="button" onClick={() => setPhase("running")}>
                  Resume <span aria-hidden="true">▶</span>
                </button>
                <span className="runner-overlay-hint">or press SPACE · tap the screen</span>
              </>
            )}
            {phase === "over" && (
              <>
                <p className="eyebrow">{result.newBest ? "NEW BEST // RUN ENDED" : "RUN ENDED"}</p>
                <strong className="runner-overlay-title">
                  {String(result.score).padStart(5, "0")} <span>XP</span>
                </strong>
                <span className="runner-overlay-hint">BEST {String(result.best).padStart(5, "0")}</span>
                <button className="button button-primary" type="button" onClick={start}>
                  Run it back <span aria-hidden="true">↻</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {phase === "running" && "Run started."}
        {phase === "paused" && "Game paused."}
        {phase === "over" && `Run ended. Score ${result.score}. Best ${result.best}.`}
      </p>
    </div>
  );
}
