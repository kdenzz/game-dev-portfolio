import { contact } from "../data.js";

export default function Contact() {
  return (
    <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
      <div className="contact-panel">
        <div className="contact-topline">
          <span>
            <span className="live-dot"></span> COMMS CHANNEL OPEN
          </span>
          <span>END OF LEVEL // NEXT?</span>
        </div>
        <div className="contact-content">
          <div>
            <p className="eyebrow">GOT A GOOD QUEST?</p>
            <h2 id="contact-title">
              Let’s make
              <br />
              something <span>matter.</span>
            </h2>
          </div>
          <div className="contact-actions">
            <p>Looking for a Unity, game, or XR developer? Tell me what you’re building.</p>
            <a className="button button-primary" href={`mailto:${contact.email}`}>
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-links">
              <a href={contact.phone.href}>{contact.phone.label}</a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={contact.github} target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
        <div className="contact-decoration" aria-hidden="true">
          KG<span>◆</span>
        </div>
      </div>
    </section>
  );
}
