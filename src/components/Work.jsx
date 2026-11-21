import { useEffect, useRef, useState } from "react";
import { categories, projects } from "../data.js";
import ProjectCard from "./ProjectCard.jsx";
import MediaDialog from "./MediaDialog.jsx";

const countFor = (category) =>
  category === "all" ? projects.length : projects.filter((p) => p.category === category).length;

export default function Work({ onProjectDiscovered }) {
  const [filter, setFilter] = useState("all");
  const [discovered, setDiscovered] = useState(() => new Set());
  const [openProject, setOpenProject] = useState(null);
  const cardRefs = useRef(new Map());
  const returnFocusTo = useRef(null);
  const onDiscoveredRef = useRef(onProjectDiscovered);
  onDiscoveredRef.current = onProjectDiscovered;

  // Award XP the first time each card scrolls into view.
  useEffect(() => {
    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.projectId;
          if (!entry.isIntersecting || seen.has(id)) return;
          seen.add(id);
          observer.unobserve(entry.target);
          setDiscovered((current) => new Set(current).add(id));
          onDiscoveredRef.current();
        });
      },
      { threshold: 0.25 }
    );
    cardRefs.current.forEach((el, id) => {
      el.dataset.projectId = id;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const visibleCount = countFor(filter);

  return (
    <section className="work-section section-shell" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-index">01</span> THE BUILD LOG
          </p>
          <h2 id="work-title">
            Selected <span>work.</span>
          </h2>
        </div>
        <p className="section-aside">
          A few worlds, systems, and side quests
          <br />
          I’ve brought to life.
        </p>
      </div>

      <div className="filter-row" role="group" aria-label="Filter projects">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`filter-button${filter === category.id ? " is-active" : ""}`}
            type="button"
            aria-pressed={filter === category.id}
            onClick={() => setFilter(category.id)}
          >
            {category.label} <span>{countFor(category.id)}</span>
          </button>
        ))}
      </div>

      <div className="project-grid">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            ref={(el) => {
              if (el) cardRefs.current.set(project.id, el);
              else cardRefs.current.delete(project.id);
            }}
            project={project}
            number={i + 1}
            hidden={filter !== "all" && project.category !== filter}
            discovered={discovered.has(project.id)}
            onOpen={(p, trigger) => {
              returnFocusTo.current = trigger;
              setOpenProject(p);
            }}
          />
        ))}
      </div>
      <p className="filter-empty" hidden={visibleCount > 0}>
        No projects in this category yet.
      </p>

      <MediaDialog
        project={openProject}
        onClose={() => {
          setOpenProject(null);
          if (returnFocusTo.current?.isConnected) returnFocusTo.current.focus();
        }}
      />
    </section>
  );
}
