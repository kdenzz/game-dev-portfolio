import { contact } from "../data.js";

export default function Hero() {
  return (
    <section className="hero section-shell" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot"></span> UNITY · GAMEPLAY · XR
        </p>
        <h1 id="hero-title">
          I build worlds
          <br />
          that <span>play back.</span>
        </h1>
        <p className="hero-intro">
          Hey, I’m Karan — a Unity game and XR developer turning ambitious ideas into immersive, joyfully playable
          experiences.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">
            Explore my work <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href={`mailto:${contact.email}`}>
            Have a project?{" "}
            <span>
              Let’s talk <b aria-hidden="true">↗</b>
            </span>
          </a>
        </div>
        <div className="hero-meta" aria-label="Developer details">
          <span>
            <span className="meta-mark">⌘</span> Unity 6 &amp; C#
          </span>
          <span>
            <span className="meta-mark">◉</span> Multiplayer systems
          </span>
          <span>
            <span className="meta-mark">◌</span> XR experiences
          </span>
        </div>
      </div>

      <div className="hero-art" aria-label="Run Across, a neon 3D platformer">
        <div className="hero-art-frame">
          <img
            src="assets/images/projects/RunAcross.jpg"
            alt="A vivid neon environment from the game Run Across"
            fetchPriority="high"
          />
          <div className="art-wash"></div>
          <div className="art-topline">
            <span>
              <span className="live-dot"></span> WORLD // 001
            </span>
            <span>UNITY ENGINE</span>
          </div>
          <div className="art-caption">
            <span className="caption-index">01 / 04</span>
            <span className="caption-title">
              RUN
              <br />
              ACROSS
            </span>
            <span className="caption-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="art-coordinates" aria-hidden="true">
            35° 41' 22.2" N<br />
            139° 41' 30.1" E
          </div>
        </div>
        <div className="art-sticker" aria-hidden="true">
          <span>MADE TO</span>
          <strong>
            PLAY<span>↗</span>
          </strong>
        </div>
        <div className="art-side-note" aria-hidden="true">
          PRESS START&nbsp; · &nbsp;SCROLL TO EXPLORE
        </div>
      </div>
      <a className="scroll-cue" href="#work" aria-label="Scroll to selected work">
        <span></span> SCROLL TO EXPLORE
      </a>
    </section>
  );
}
