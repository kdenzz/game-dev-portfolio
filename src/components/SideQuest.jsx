export default function SideQuest() {
  return (
    <section className="side-quest section-shell" aria-labelledby="side-quest-title">
      <a className="side-quest-panel" href="play.html">
        <span className="side-quest-badge" aria-hidden="true">
          ▶
        </span>
        <span className="side-quest-copy">
          <span className="eyebrow">
            <span className="live-dot"></span> SIDE QUEST UNLOCKED
          </span>
          <strong id="side-quest-title">
            Take a break: play <span>Courier Run.</span>
          </strong>
          <span className="side-quest-text">A tiny endless runner I built for this site. Jump, duck, beat your best.</span>
        </span>
        <span className="side-quest-cta">
          Play now <span aria-hidden="true">↗</span>
        </span>
      </a>
    </section>
  );
}
