(() => {
  const STORAGE_KEY = "vivon_theme"; // "dark" | "light" | null
  const root = document.documentElement;

  const fab = () => document.getElementById("themeFab");
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
    // theme: "dark" | "light" | null (null = system)
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }

  function effectiveTheme() {
    // 실제 화면에 적용될 테마 계산 (저장값 우선, 없으면 시스템)
    const saved = getSavedTheme();
    if (saved === "dark" || saved === "light") return saved;
    return systemPrefersDark() ? "dark" : "light";
  }

  function syncButtonUI() {
    const f = fab();
    if (!f) return;

    const eff = effectiveTheme();
    f.setAttribute("data-active", eff); // ✅ CSS가 이 값으로 하이라이트 표시

    // 접근성/툴팁
    f.title = eff === "dark" ? "다크 모드 (현재)" : "라이트 모드 (현재)";
  }

  function setThemeAndRemember(theme) {
    // theme: "dark" | "light"
    setSavedTheme(theme);
    applyTheme(theme);
    syncButtonUI();
  }

  function bindSystemListener() {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // 저장값 없을 때만 시스템 변경 반영
      if (getSavedTheme() === null) {
        applyTheme(null);
        syncButtonUI();
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // init: 저장값이 있으면 적용, 없으면 시스템
    const saved = getSavedTheme();
    applyTheme(saved);
    syncButtonUI();

    if (btnLight()) btnLight().addEventListener("click", () => setThemeAndRemember("light"));
    if (btnDark())  btnDark().addEventListener("click",  () => setThemeAndRemember("dark"));

    bindSystemListener();
  });
})();
