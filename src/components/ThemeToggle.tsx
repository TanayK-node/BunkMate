
// ThemeToggle - simple dark/light toggle with smooth animation
import React from "react";
import { useEffect, useState } from "react";
import { Circle, CircleCheck } from "lucide-react";

const getInitialTheme = () =>
  (localStorage.getItem("theme") as "light" | "dark" | null) ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className="bg-card rounded-full border border-divider shadow p-2 transition-all duration-300 flex items-center justify-center hover:bg-accent2/40 focus:focus-soft outline-none"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
        width: 40,
        height: 40,
        color: theme === "dark" ? "#b19cd9" : "#8fbc8f",
      }}
    >
      {theme === "dark" ? (
        <CircleCheck size={23} strokeWidth={2} />
      ) : (
        <Circle size={23} strokeWidth={2} />
      )}
    </button>
  );
};
