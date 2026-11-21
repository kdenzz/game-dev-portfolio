import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PlayPage from "./PlayPage.jsx";
import "../styles.css";
import "./play.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlayPage />
  </StrictMode>
);
