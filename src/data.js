// All portfolio content lives here. Add or edit projects without touching components.

export const contact = {
  email: "karangupta916@gmail.com",
  phone: { href: "tel:+919637516106", label: "+91 96375 16106" },
  linkedin: "https://linkedin.com/in/karan-gupta-9672b71b4",
  github: "https://github.com/kdenzz",
};

// Order matters: each entry is a checkpoint in the quest HUD.
export const questZones = [
  { id: "top", name: "Spawn Point" },
  { id: "work", name: "Main Quest" },
  { id: "about", name: "Player Profile" },
  { id: "toolkit", name: "Loadout" },
  { id: "contact", name: "Final Level" },
];

export const navLinks = [
  { href: "#work", label: "Selected work" },
  { href: "#about", label: "About" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "play.html", label: "Play" },
];

export const proofStats = [
  { value: "04", suffix: "+", label: "Years building" },
  { value: "10", suffix: "+", label: "Projects shipped" },
  { value: "05", suffix: "", label: "Live apps & sites" },
];

export const categories = [
  { id: "all", label: "All work" },
  { id: "game", label: "Games" },
  { id: "xr", label: "XR / VR" },
  { id: "other", label: "Other builds" },
];

const img = (name) => `assets/images/projects/${name}`;
const vid = (name) => `assets/videos/${name}`;

export const projects = [
  {
    id: "sync-blocks",
    category: "game",
    layout: "featured",
    mediaClass: "media-sync",
    cover: { src: img("SyncBlocks.png"), alt: "Sync Blocks multiplayer game board" },
    label: "MULTIPLAYER // LIVE",
    live: true,
    kicker: "GAMEPLAY SYSTEMS · UNITY 6",
    title: "Sync Blocks",
    description:
      "Competitive Tetris with a twist: clear a line and your opponent’s board shrinks. Real-time networking makes every counter-play count.",
    tags: ["Multiplayer", "Unity 6", "Real-time"],
    link: { href: "https://kdenzz.itch.io/syncblocks", label: "Explore the game" },
    galleryTitle: "Sync Blocks",
    media: [
      { src: img("SyncBlocks.png"), type: "image", caption: "Multiplayer gameplay" },
      { src: img("SyncblocksMainMenu.png"), type: "image", caption: "Main menu" },
    ],
  },
  {
    id: "run-across",
    category: "game",
    layout: "offset",
    cover: { src: img("RunAcross1.png"), alt: "Run Across gameplay in a futuristic neon world" },
    label: "3D PLATFORMER",
    kicker: "GAME DESIGN · 3D",
    title: "Run Across",
    description:
      "A neon-soaked platformer-puzzler with multiple levels, custom mechanics, and shooting challenges that open new paths.",
    tags: ["Platformer", "Unity", "Puzzles"],
    galleryTitle: "Run Across",
    media: [
      { src: img("RunAcross.jpg"), type: "image", caption: "Neon world" },
      { src: img("RunAcross1.png"), type: "image", caption: "Platformer gameplay" },
    ],
  },
  {
    id: "unproject",
    category: "xr",
    cover: { src: img("Unproject.png"), alt: "Unproject collaborative spatial design tool" },
    label: "CURRENT ROLE",
    live: true,
    kicker: "UNITY XR DEVELOPER",
    title: "Unproject",
    description:
      "A VR-based 3D design tool. I build modular menus for spawning and manipulating prefabs through ray-based and direct XR interactions.",
    tags: ["Unity", "C#", "XR"],
    link: { href: "https://www.unproject.ai", label: "Visit Unproject" },
    galleryTitle: "Unproject — VR Design Tool",
    media: [
      { src: img("Unproject.png"), type: "image", caption: "Collaborative spatial design tool" },
      { src: vid("Unproject.mp4"), type: "video", caption: "VR design demo" },
    ],
  },
  {
    id: "practice-range",
    category: "xr",
    layout: "offset",
    cover: { src: img("PracticeRange.png"), alt: "Practice Range VR target training environment" },
    label: "VR AIM TRAINER",
    kicker: "PERSONAL PROJECT · VR",
    title: "Practice Range",
    description:
      "A VR aim trainer with a high-score counter and multiple weapon variations, built with the Unity XR SDK for an immersive feel.",
    tags: ["VR", "Unity XR SDK", "Gameplay"],
    galleryTitle: "Practice Range VR",
    media: [
      { src: img("PracticeRange.png"), type: "image", caption: "Practice range" },
      { src: vid("VR_GunReload.mp4"), type: "video", caption: "Gun reload demo" },
      { src: vid("VR_GunShoot.mp4"), type: "video", caption: "Target shooting demo" },
    ],
  },
  {
    id: "lost-in-the-woods",
    category: "xr",
    placeholder: "woods",
    label: "VR INTERACTION",
    kicker: "IMMERSIVE SYSTEMS · VR",
    title: "Lost In The Woods",
    description:
      "A head-gaze detection system using raycasting and an automated checklist, with LOD optimization for a detailed forest scene.",
    tags: ["Raycasting", "Gaze detection", "Optimization"],
    galleryTitle: "Lost In The Woods",
    media: [{ src: vid("CarCrash.mp4"), type: "video", caption: "Gaze detection demo" }],
  },
  {
    id: "oneroot",
    category: "other",
    cover: { src: img("Oneroot.png"), alt: "Oneroot mobile applications" },
    label: "2 APPS ON GOOGLE PLAY",
    kicker: "MOBILE · FULL STACK",
    title: "Oneroot Apps",
    description:
      "Built two Android apps from scratch, with a React Native, Node.js, Express, and MongoDB stack plus a coconut-detection CV model.",
    tags: ["React Native", "Node.js", "Computer vision"],
    galleryTitle: "Oneroot Android Apps",
    media: [{ src: img("Oneroot.png"), type: "image", caption: "Oneroot mobile apps" }],
  },
  {
    id: "blackbox",
    category: "other",
    cover: { src: img("Blackbox.png"), alt: "BlackBox Development website and product work" },
    label: "CURRENT ROLE",
    live: true,
    kicker: "FULL-STACK DEVELOPMENT",
    title: "BlackBox",
    description:
      "Building Android apps and responsive websites, contributing to front-end experiences and database-driven product development.",
    tags: ["Full stack", "Web", "Mobile"],
    link: { href: "https://blackbox-bixa.vercel.app", label: "Visit BlackBox" },
    galleryTitle: "BlackBox Development",
    media: [{ src: img("Blackbox.png"), type: "image", caption: "BlackBox product work" }],
  },
  {
    id: "hirebuddy",
    category: "other",
    cover: { src: img("Hirebuddy.png"), alt: "HireBuddy job board interface" },
    label: "FULL-STACK WEB APP",
    kicker: "PRODUCT BUILD · WEB",
    title: "HireBuddy",
    description:
      "A job board with resume parsing, real-time listings, advanced search, and an accessible application flow.",
    tags: ["React", "Node.js", "Resume parsing"],
    link: { href: "https://hirebuddy-job-board.vercel.app", label: "Visit HireBuddy" },
    galleryTitle: "HireBuddy Job Board",
    media: [{ src: img("Hirebuddy.png"), type: "image", caption: "Job board interface" }],
  },
  {
    id: "woo-plugin",
    category: "other",
    cover: { src: img("WooPlugin.png"), alt: "Woo Plugin Wizard generator interface" },
    label: "AI-POWERED TOOL",
    kicker: "AI · FULL STACK",
    title: "Woo Plugin Wizard",
    description:
      "A WooCommerce plugin generator with a React interface, Gemini-powered generation, and an IDE-like Monaco Editor.",
    tags: ["React", "Gemini API", "WooCommerce"],
    link: { href: "https://woocomerce-gemini.vercel.app", label: "Visit the project" },
    galleryTitle: "Woo Plugin Wizard",
    media: [{ src: img("WooPlugin.png"), type: "image", caption: "Plugin generator interface" }],
  },
  {
    id: "drypto",
    category: "other",
    placeholder: "drypto",
    label: "MOTION DESIGN",
    kicker: "ANIMATION · UI SYSTEMS",
    title: "Drypto",
    description:
      "Interactive After Effects animations for React apps, synchronized with live product logic and a consistent design system.",
    tags: ["After Effects", "React", "Motion"],
    galleryTitle: "Drypto UI Animations",
    media: [
      { src: vid("Drypto_animation.mp4"), type: "video", caption: "UI animation demo" },
      { src: vid("Drypto_animation1.mp4"), type: "video", caption: "Motion design study" },
    ],
  },
];

export const toolkit = [
  {
    index: "01 / CORE",
    title: "Game & XR",
    items: "Unity 6 · Unity XR Toolkit · Unity Netcode · Photon Fusion 2 · Unity Cloud Services · Unreal Engine · WebSockets",
    symbol: "◆",
    primary: true,
  },
  {
    index: "02 / CODE",
    title: "Languages",
    items: "C# · C++ · JavaScript · TypeScript · Java · Python · Kotlin · HTML / CSS",
    symbol: "{ }",
  },
  {
    index: "03 / BUILD",
    title: "Web & data",
    items: "React · React Native · Node.js · Express · NestJS · MongoDB · MySQL · Vite",
    symbol: "⌘",
  },
  {
    index: "04 / CREATE",
    title: "Creative stack",
    items: "Blender · After Effects · Photoshop · Figma · Ableton Live · FL Studio",
    symbol: "◉",
  },
];
