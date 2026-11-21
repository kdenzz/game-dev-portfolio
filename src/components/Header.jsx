import { useState } from "react";
import { navLinks } from "../data.js";
import Wordmark from "./Wordmark.jsx";

// `home` prefixes in-page anchors so the header also works from other pages (e.g. "./" on play.html).
export default function Header({ home = "", current }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <Wordmark home={home} aria-label="Karan Gupta, home" />

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        <span></span>
        <span></span>
      </button>

      <nav className={`site-nav${open ? " is-open" : ""}`} id="primary-navigation" aria-label="Main navigation">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href.startsWith("#") ? home + link.href : link.href}
            aria-current={link.href === current ? "page" : undefined}
            onClick={close}
          >
            {link.label}
          </a>
        ))}
        <a className="nav-contact" href={`${home}#contact`} onClick={close}>
          Let's talk <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
