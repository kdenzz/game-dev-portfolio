import { toolkit } from "../data.js";

export default function Toolkit() {
  return (
    <section className="toolkit-section section-shell" id="toolkit" aria-labelledby="toolkit-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-index">03</span> LOADOUT
          </p>
          <h2 id="toolkit-title">
            Tools of the <span>trade.</span>
          </h2>
        </div>
        <p className="section-aside">
          The right tool for the right
          <br />
          kind of fun.
        </p>
      </div>
      <div className="toolkit-grid">
        {toolkit.map((group) => (
          <article key={group.title} className={`toolkit-card${group.primary ? " toolkit-primary" : ""}`}>
            <span className="toolkit-index">{group.index}</span>
            <h3>{group.title}</h3>
            <p>{group.items}</p>
            <span className="toolkit-symbol" aria-hidden="true">
              {group.symbol}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
