(() => {
  const STORAGE_KEY = "vivon_theme"; // "dark" | "light" | null
  const root = document.documentElement;

  const btnLight = () => document.getElementById("themeLight");
  const btnDark  = () => document.getElementById("themeDark");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getSavedTheme() {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  }

  function setSavedTheme(v) {
    if (v === "dark" || v === "light") localStorage.setItem(STORAGE_KEY, v);
    else localStorage.removeItem(STORAGE_KEY);
  }

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }

  function setThemeAndRemember(theme) {
    setSavedTheme(theme);
    applyTheme(theme);
  }

  function bindSystemListener() {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getSavedTheme() === null) applyTheme(null);
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // init
    const saved = getSavedTheme();
    applyTheme(saved);

    // left = light, right = dark
    if (btnLight()) btnLight().addEventListener("click", () => setThemeAndRemember("light"));
    if (btnDark())  btnDark().addEventListener("click",  () => setThemeAndRemember("dark"));

    bindSystemListener();
  });
})();
