const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  });
});

const questSections = Array.from(document.querySelectorAll("[data-quest-zone]"));
const questSteps = Array.from(document.querySelectorAll(".quest-hud-steps a"));
const questHud = document.querySelector(".quest-hud");
const questZoneName = document.querySelector(".quest-hud-zone-name");
const questCountCurrent = document.querySelector(".quest-hud-count-current");
const questXp = document.querySelector(".quest-hud-xp");
const questProgress = document.querySelector(".quest-hud-progress");
const questProgressFill = document.querySelector(".quest-hud-progress-fill");
const checkpointToast = document.querySelector(".checkpoint-toast");
const checkpointToastLabel = document.querySelector(".checkpoint-toast-label");
const checkpointToastName = document.querySelector(".checkpoint-toast-name");
const checkpointToastXp = document.querySelector(".checkpoint-toast-xp");
const discoveredZones = new Set([0]);
const checkpointQueue = [];
let earnedXp = 0;
let checkpointToastActive = false;
let activeQuestZone = null;

function awardQuestXp(points) {
  earnedXp += points;
  questXp.textContent = String(earnedXp).padStart(3, "0");
  questXp.classList.remove("is-updated");
  requestAnimationFrame(() => questXp.classList.add("is-updated"));
}

function showCheckpointToast(name, points) {
  checkpointQueue.push({ name, points });
  if (checkpointToastActive) return;

  showNextCheckpointToast();
}

function showNextCheckpointToast() {
  const checkpoint = checkpointQueue.shift();
  if (!checkpoint) {
    checkpointToastActive = false;
    return;
  }

  checkpointToastActive = true;
  checkpointToastLabel.textContent = "CHECKPOINT REACHED";
  checkpointToastName.textContent = checkpoint.name;
  checkpointToastXp.textContent = `+${checkpoint.points} XP`;
  checkpointToast.classList.remove("is-visible");
  requestAnimationFrame(() => {
    checkpointToast.classList.add("is-visible");
    window.setTimeout(() => {
      checkpointToast.classList.remove("is-visible");
      window.setTimeout(showNextCheckpointToast, 180);
    }, 3200);
  });
}

function activateQuestZone(section) {
  const index = questSections.indexOf(section);
  if (index < 0) return;

  questHud.classList.toggle("is-visible", index > 0);
  questZoneName.textContent = section.dataset.questZone;
  questCountCurrent.textContent = String(index + 1).padStart(2, "0");
  questProgress.setAttribute("aria-valuenow", String(index));
  questProgress.setAttribute(
    "aria-valuetext",
    `Checkpoint ${index + 1} of ${questSections.length}`
  );
  const progress = index / (questSections.length - 1);
  questProgress.style.setProperty("--quest-progress", String(progress));
  questProgress.style.setProperty("--quest-position", `${progress * 100}%`);

  questSteps.forEach((step, stepIndex) => {
    if (stepIndex === index) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  for (let checkpointIndex = 1; checkpointIndex <= index; checkpointIndex += 1) {
    if (discoveredZones.has(checkpointIndex)) continue;

    discoveredZones.add(checkpointIndex);
    awardQuestXp(100);
    showCheckpointToast(questSections[checkpointIndex].dataset.questZone, 100);
  }
}

function updateQuestZone() {
  const focusLine = window.innerHeight * 0.45;
  const currentZone = questSections.reduce(
    (active, section) =>
      section.getBoundingClientRect().top <= focusLine ? section : active,
    questSections[0]
  );

  if (currentZone === activeQuestZone) return;
  activeQuestZone = currentZone;
  activateQuestZone(currentZone);
}

window.addEventListener("scroll", updateQuestZone, { passive: true });
window.addEventListener("resize", updateQuestZone);
updateQuestZone();

const filters = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const emptyMessage = document.querySelector(".filter-empty");
const discoveredProjects = new WeakSet();

const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || discoveredProjects.has(entry.target)) return;

      discoveredProjects.add(entry.target);
      entry.target.classList.add("is-discovered");
      awardQuestXp(25);
      projectObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.25 }
);

projectCards.forEach((card) => projectObserver.observe(card));

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    let visibleCount = 0;

    filters.forEach((button) => {
      const active = button === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach((card) => {
      const visible = category === "all" || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount > 0;
  });
});

const mediaLibrary = {
  "sync-blocks": {
    title: "Sync Blocks",
    items: [
      { src: "assets/images/projects/SyncBlocks.png", type: "image", caption: "Multiplayer gameplay" },
      { src: "assets/images/projects/SyncblocksMainMenu.png", type: "image", caption: "Main menu" },
    ],
  },
  "run-across": {
    title: "Run Across",
    items: [
      { src: "assets/images/projects/RunAcross.jpg", type: "image", caption: "Neon world" },
      { src: "assets/images/projects/RunAcross1.png", type: "image", caption: "Platformer gameplay" },
    ],
  },
  unproject: {
    title: "Unproject — VR Design Tool",
    items: [
      { src: "assets/images/projects/Unproject.png", type: "image", caption: "Collaborative spatial design tool" },
      { src: "assets/videos/Unproject.mp4", type: "video", caption: "VR design demo" },
    ],
  },
  "practice-range": {
    title: "Practice Range VR",
    items: [
      { src: "assets/images/projects/PracticeRange.png", type: "image", caption: "Practice range" },
      { src: "assets/videos/VR_GunReload.mp4", type: "video", caption: "Gun reload demo" },
      { src: "assets/videos/VR_GunShoot.mp4", type: "video", caption: "Target shooting demo" },
    ],
  },
  "lost-in-the-woods": {
    title: "Lost In The Woods",
    items: [
      { src: "assets/videos/CarCrash.mp4", type: "video", caption: "Gaze detection demo" },
    ],
  },
  oneroot: {
    title: "Oneroot Android Apps",
    items: [
      { src: "assets/images/projects/Oneroot.png", type: "image", caption: "Oneroot mobile apps" },
    ],
  },
  blackbox: {
    title: "BlackBox Development",
    items: [
      { src: "assets/images/projects/Blackbox.png", type: "image", caption: "BlackBox product work" },
    ],
  },
  hirebuddy: {
    title: "HireBuddy Job Board",
    items: [
      { src: "assets/images/projects/Hirebuddy.png", type: "image", caption: "Job board interface" },
    ],
  },
  "woo-plugin": {
    title: "Woo Plugin Wizard",
    items: [
      { src: "assets/images/projects/WooPlugin.png", type: "image", caption: "Plugin generator interface" },
    ],
  },
  drypto: {
    title: "Drypto UI Animations",
    items: [
      { src: "assets/videos/Drypto_animation.mp4", type: "video", caption: "UI animation demo" },
      { src: "assets/videos/Drypto_animation1.mp4", type: "video", caption: "Motion design study" },
    ],
  },
};

const mediaDialog = document.querySelector(".media-dialog");
const dialogTitle = document.querySelector(".dialog-title");
const dialogImage = document.querySelector(".dialog-image");
const dialogVideo = document.querySelector(".dialog-video");
const dialogCaption = document.querySelector(".dialog-caption");
const dialogCounter = document.querySelector(".dialog-counter");
const previousButton = document.querySelector(".dialog-prev");
const nextButton = document.querySelector(".dialog-next");
const closeButton = document.querySelector(".dialog-close");
let activeMedia = [];
let activeIndex = 0;
let returnFocusTo = null;

function showMedia(index) {
  activeIndex = (index + activeMedia.length) % activeMedia.length;
  const item = activeMedia[activeIndex];
  dialogVideo.pause();
  dialogVideo.removeAttribute("src");
  dialogVideo.load();
  dialogImage.classList.remove("is-visible");
  dialogVideo.classList.remove("is-visible");

  if (item.type === "video") {
    dialogVideo.src = item.src;
    dialogVideo.classList.add("is-visible");
  } else {
    dialogImage.src = item.src;
    dialogImage.alt = `${dialogTitle.textContent}: ${item.caption}`;
    dialogImage.classList.add("is-visible");
  }

  dialogCaption.textContent = item.caption;
  dialogCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(activeMedia.length).padStart(2, "0")}`;
  previousButton.disabled = activeMedia.length < 2;
  nextButton.disabled = activeMedia.length < 2;
  previousButton.hidden = activeMedia.length < 2;
  nextButton.hidden = activeMedia.length < 2;
}

document.querySelectorAll(".project-media").forEach((button) => {
  button.addEventListener("click", () => {
    const project = mediaLibrary[button.dataset.project];
    if (!project) {
      throw new Error(`Missing media library entry for "${button.dataset.project}".`);
    }

    returnFocusTo = button;
    activeMedia = project.items;
    dialogTitle.textContent = project.title;
    showMedia(0);
    mediaDialog.showModal();
  });
});

previousButton.addEventListener("click", () => showMedia(activeIndex - 1));
nextButton.addEventListener("click", () => showMedia(activeIndex + 1));
closeButton.addEventListener("click", () => mediaDialog.close());

mediaDialog.addEventListener("click", (event) => {
  if (event.target === mediaDialog) mediaDialog.close();
});

mediaDialog.addEventListener("close", () => {
  dialogVideo.pause();
  dialogVideo.removeAttribute("src");
  dialogVideo.load();
  activeMedia = [];
  if (returnFocusTo?.isConnected) returnFocusTo.focus();
});

document.addEventListener("keydown", (event) => {
  if (!mediaDialog.open) return;
  if (event.key === "ArrowLeft" && activeMedia.length > 1) showMedia(activeIndex - 1);
  if (event.key === "ArrowRight" && activeMedia.length > 1) showMedia(activeIndex + 1);
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
