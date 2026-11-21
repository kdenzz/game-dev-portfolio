export default function Wordmark({ home = "", ...props }) {
  return (
    <a className="wordmark" href={`${home}#top`} {...props}>
      <span className="wordmark-icon" aria-hidden="true">
        K
      </span>
      <span>
        KARAN<span className="wordmark-muted">.DEV</span>
      </span>
    </a>
  );
}
