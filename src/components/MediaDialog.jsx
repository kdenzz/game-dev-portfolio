import { useEffect, useRef, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

export default function MediaDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  const [index, setIndex] = useState(0);

  const items = project?.media ?? [];
  const item = items[index];
  const multiple = items.length > 1;
  const step = (delta) => setIndex((i) => (i + delta + items.length) % items.length);

  // Open the native modal whenever a project is selected.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!project) return;
    setIndex(0);
    if (!dialog.open) dialog.showModal();
  }, [project]);

  // Arrow-key navigation while open.
  useEffect(() => {
    if (!project || !multiple) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const isVideo = item?.type === "video";

  return (
    <dialog
      ref={dialogRef}
      className="media-dialog"
      aria-label="Project media viewer"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="dialog-top">
        <div>
          <p className="eyebrow">PROJECT FILE</p>
          <h2 className="dialog-title">{project?.galleryTitle}</h2>
        </div>
        <button className="dialog-close" type="button" aria-label="Close media viewer" onClick={() => dialogRef.current.close()}>
          ×
        </button>
      </div>
      <div className="dialog-stage">
        <button
          className="dialog-nav dialog-prev"
          type="button"
          aria-label="Previous media"
          disabled={!multiple}
          hidden={!multiple}
          onClick={() => step(-1)}
        >
          ←
        </button>
        <img
          className={`dialog-image${item && !isVideo ? " is-visible" : ""}`}
          src={item && !isVideo ? item.src : undefined}
          alt={item && !isVideo ? `${project.galleryTitle}: ${item.caption}` : ""}
        />
        {/* Keyed on the source so switching items or closing unmounts the old video and stops playback. */}
        <video
          key={isVideo ? item.src : "none"}
          className={`dialog-video${isVideo ? " is-visible" : ""}`}
          src={isVideo ? item.src : undefined}
          controls
          playsInline
        />
        <button
          className="dialog-nav dialog-next"
          type="button"
          aria-label="Next media"
          disabled={!multiple}
          hidden={!multiple}
          onClick={() => step(1)}
        >
          →
        </button>
      </div>
      <div className="dialog-bottom">
        <span className="dialog-caption">{item?.caption}</span>
        <span className="dialog-counter">{item ? `${pad(index + 1)} / ${pad(items.length)}` : ""}</span>
      </div>
    </dialog>
  );
}
