const pad = (n) => String(n).padStart(2, "0");

export default function QuestHud({ zones, activeIndex, xp }) {
  const total = zones.length;
  const progress = activeIndex / (total - 1);

  return (
    <nav className={`quest-hud${activeIndex > 0 ? " is-visible" : ""}`} aria-label="Portfolio quest progress">
      <div className="quest-hud-heading">
        <span>
          <span className="live-dot"></span> QUEST LOG
        </span>
        <span className="quest-hud-level">LEVEL 01</span>
      </div>
      <div className="quest-hud-zone">
        <span>ACTIVE ZONE</span>
        <strong className="quest-hud-zone-name">{zones[activeIndex].name}</strong>
      </div>
      <div
        className="quest-hud-progress"
        role="progressbar"
        aria-label="Portfolio quest progress"
        aria-valuemin={0}
        aria-valuemax={total - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={`Checkpoint ${activeIndex + 1} of ${total}`}
        style={{ "--quest-progress": progress, "--quest-position": `${progress * 100}%` }}
      >
        <span className="quest-hud-progress-fill"></span>
        <span className="quest-hud-progress-marker" aria-hidden="true"></span>
      </div>
      <div className="quest-hud-stats">
        <span className="quest-hud-count">
          <span className="quest-hud-count-current">{pad(activeIndex + 1)}</span> <span>/ {pad(total)}</span>
        </span>
        <span className="quest-hud-xp-label">
          {/* Re-keying on xp remounts the element so the pulse animation replays. */}
          XP{" "}
          <strong key={xp} className={`quest-hud-xp${xp > 0 ? " is-updated" : ""}`}>
            {String(xp).padStart(3, "0")}
          </strong>
        </span>
      </div>
      <ol className="quest-hud-steps">
        {zones.map((zone, i) => (
          <li key={zone.id}>
            <a
              href={`#${zone.id}`}
              aria-current={i === activeIndex ? "step" : undefined}
              aria-label={`Checkpoint ${i + 1}: ${zone.name}`}
            >
              <span>{pad(i + 1)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
