import { contact } from "../data.js";

export default function About() {
  return (
    <section className="about-section section-shell" id="about" aria-labelledby="about-title">
      <div className="about-stamp" aria-hidden="true">
        <span>CURIOUS BY DEFAULT</span>
        <strong>◆</strong>
        <span>BUILT WITH INTENT</span>
      </div>
      <div className="about-copy">
        <p className="eyebrow">
          <span className="section-index">02</span> PLAYER PROFILE
        </p>
        <h2 id="about-title">
          Curiosity is
          <br />
          my <span>game engine.</span>
        </h2>
        <p>
          I started coding in eighth grade and never really stopped. Today, I’m a Unity developer focused on XR,
          multiplayer gameplay, and the small details that make an experience feel alive.
        </p>
        <p>
          From VR design tools to competitive games, I enjoy taking a feature from a rough idea to a build people can
          actually use. I also work across full-stack apps and creative tools when a project calls for it.
        </p>
        <a className="text-link about-link" href={contact.github} target="_blank" rel="noopener noreferrer">
          More builds on GitHub{" "}
          <span>
            See my profile <b aria-hidden="true">↗</b>
          </span>
        </a>
      </div>
    </section>
  );
}
