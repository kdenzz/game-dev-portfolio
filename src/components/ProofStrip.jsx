import { proofStats } from "../data.js";

export default function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Experience highlights">
      {proofStats.map((stat) => (
        <div className="proof-item" key={stat.label}>
          <strong>
            {stat.value}
            {stat.suffix && <span>{stat.suffix}</span>}
          </strong>
          <span>{stat.label}</span>
        </div>
      ))}
      <p>
        FROM FIRST PIXEL
        <br />
        TO FINAL BUILD
        <span className="proof-star" aria-hidden="true">
          ◆
        </span>
      </p>
    </section>
  );
}
