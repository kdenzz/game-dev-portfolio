import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Two pages: the portfolio (index.html) and the mini-game (play.html).
// Relative base so the build works from any static host or subpath (e.g. GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { main: "index.html", play: "play.html" },
    },
  },
});
