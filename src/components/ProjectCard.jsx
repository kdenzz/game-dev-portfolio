import { forwardRef } from "react";

const pad = (n) => String(n).padStart(2, "0");

// "01 IMAGE ＋", "02 VIDEOS ▶", or "03 MEDIA ＋" for mixed / multi-image galleries.
function mediaCountLabel(media) {
  const n = media.length;
  if (media.every((item) => item.type === "video")) return { text: `${pad(n)} VIDEO${n > 1 ? "S" : ""}`, icon: "▶" };
  if (n === 1) return { text: "01 IMAGE", icon: "＋" };
  return { text: `${pad(n)} MEDIA`, icon: "＋" };
}

const placeholders = {
  woods: (
    <span className="project-placeholder woods-placeholder">
      <span className="placeholder-ring">◉</span>
      <span>
        GAZE DETECTION
        <br />
        // ENVIRONMENT STUDY
      </span>
    </span>
  ),
  drypto: (
    <span className="project-placeholder drypto-placeholder">
      <span className="drypto-orb"></span>
      <span>
        DRYPTO
        <br />
        MOTION STUDY
      </span>
    </span>
  ),
};

const ProjectCard = forwardRef(function ProjectCard({ project, number, hidden, discovered, onOpen }, ref) {
  const count = mediaCountLabel(project.media);
  const classes = ["project-card"];
  if (project.layout) classes.push(`project-${project.layout}`);
  if (discovered) classes.push("is-discovered");

  return (
    <article ref={ref} className={classes.join(" ")} data-category={project.category} hidden={hidden}>
      <button
        className={`project-media${project.mediaClass ? ` ${project.mediaClass}` : ""}`}
        type="button"
        aria-label={`Open ${project.galleryTitle.split(" — ")[0]} media gallery`}
        onClick={(event) => onOpen(project, event.currentTarget)}
      >
        {project.cover ? (
          <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
        ) : (
          placeholders[project.placeholder]
        )}
        <span className="media-shade"></span>
        <span className="media-label">
          {project.live && (
            <>
              <span className="live-dot"></span>{" "}
            </>
          )}
          {project.label}
        </span>
        <span className="media-open" aria-hidden="true">
          ↗
        </span>
        <span className="media-count">
          {count.text} <span aria-hidden="true">{count.icon}</span>
        </span>
      </button>
      <div className="project-details">
        <div className="project-heading">
          <div>
            <p className="project-kicker">{project.kicker}</p>
            <h3>{project.title}</h3>
          </div>
          <span className="project-number">{pad(number)}</span>
        </div>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {project.link && (
          <a className="project-link" href={project.link.href} target="_blank" rel="noopener noreferrer">
            {project.link.label} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
});

export default ProjectCard;
