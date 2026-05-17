export function getPreferredTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

export function applyThemeToDocument(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;

  // Tailwind's `dark:` uses the `dark` class on the <html> element.
  root.classList.toggle("dark", theme === "dark");
}

