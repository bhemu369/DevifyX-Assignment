import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Initialize theme on app startup
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "system";
  const isDark =
    savedTheme === "dark" ||
    (savedTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.add(isDark ? "dark" : "light");
};

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
