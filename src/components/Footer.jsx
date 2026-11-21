import Wordmark from "./Wordmark.jsx";

export default function Footer({ home = "" }) {
  return (
    <footer className="site-footer">
      <Wordmark home={home} />
      <span>Designed to play. Built to ship.</span>
      <a href="#top" className="back-top">
        BACK TO TOP ↑
      </a>
      <span className="copyright">© {new Date().getFullYear()} Karan Gupta</span>
    </footer>
  );
}
