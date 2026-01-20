(() => {
  const STORAGE_KEY = "vivon_theme"; // "dark" | "light"
  const root = document.documentElement;

  const fab = () => document.getElementById("themeFab");
  const btnLight = () => document.getElementById("themeLight");
  const btnDark  = () => document.getElementById("themeDark");

  function getSavedTheme() {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  }

  function setSavedTheme(v) {
    localStorage.setItem(STORAGE_KEY, v);
  }

  function applyTheme(theme) {
    // theme must be "dark" or "light"
    root.setAttribute("data-theme", theme);
  }

  function syncButtonUI(theme) {
    const f = fab();
    if (!f) return;
    f.setAttribute("data-active", theme); // CSS 하이라이트는 이 값으로만 결정
  }

  function setTheme(theme) {
    setSavedTheme(theme);
    applyTheme(theme);
    syncButtonUI(theme);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // ✅ 첫 방문 기본값을 무조건 다크로
    const saved = getSavedTheme();
    const initial = saved ?? "dark";

    // 저장값이 없었다면, 여기서 "dark"를 저장해버림 (시크릿도 동일)
    if (!saved) setSavedTheme("dark");

    applyTheme(initial);
    syncButtonUI(initial);

    // 버튼 동작 유지: 좌=라이트, 우=다크
    if (btnLight()) btnLight().addEventListener("click", () => setTheme("light"));
    if (btnDark())  btnDark().addEventListener("click",  () => setTheme("dark"));
  });
})();
