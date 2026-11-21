import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import RunnerGame from "./RunnerGame.jsx";

const HOME = "./";

const controls = [
  { keys: ["SPACE", "↑"], action: "Jump (hold for higher)" },
  { keys: ["↓"], action: "Duck · fast-fall mid-air" },
  { keys: ["TAP"], action: "Jump on touch screens" },
  { keys: ["SWIPE ↓"], action: "Duck on touch screens" },
];

export default function PlayPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header home={HOME} current="play.html" />

      <main id="main">
        <section className="play-section section-shell" id="top" aria-labelledby="play-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="section-index">◆</span> SIDE QUEST // COURIER RUN
              </p>
              <h1 id="play-title" className="play-title">
                Courier <span>Run.</span>
              </h1>
            </div>
            <p className="section-aside">
              Dodge glitch blocks and patrol drones.
              <br />
              The run gets faster the longer you last.
            </p>
          </div>

          <RunnerGame />

          <div className="play-footer">
            <ul className="play-controls" aria-label="Controls">
              {controls.map((control) => (
                <li key={control.action}>
                  <span className="play-keys">
                    {control.keys.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </span>
                  {control.action}
                </li>
              ))}
            </ul>
            <a className="text-link" href={`${HOME}#work`}>
              Done playing?{" "}
              <span>
                See my real projects <b aria-hidden="true">↗</b>
              </span>
            </a>
          </div>
        </section>
      </main>

      <Footer home={HOME} />
    </>
  );
}
