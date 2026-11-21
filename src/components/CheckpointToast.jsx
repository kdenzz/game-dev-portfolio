export default function CheckpointToast({ toast, visible }) {
  return (
    <div
      className={`checkpoint-toast${visible ? " is-visible" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="checkpoint-toast-label">{toast ? "CHECKPOINT REACHED" : ""}</span>
      <strong className="checkpoint-toast-name">{toast?.name}</strong>
      <span className="checkpoint-toast-xp">{toast ? `+${toast.points} XP` : ""}</span>
    </div>
  );
}
