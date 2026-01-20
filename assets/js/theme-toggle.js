(() => {
  const STORAGE_KEY = "vivon_theme"; // "dark" | "light" | null
  const root = document.documentElement;
  const btn = () => document.getElementById("themeToggle");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(theme) {
    // theme: "dark" | "light" | null (null = system)
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (btn()) btn().setAttribute("aria-label", "라이트 모드로 전환");
    } else if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (btn()) btn().setAttribute("aria-label", "다크 모드로 전환");
    } else {
      // follow system
      root.removeAttribute("data-theme");
      if (btn()) btn().setAttribute("aria-label", "다크/라이트 전환");
    }
    updateButton(theme);
  }

  function updateButton(theme) {
    const b = btn();
    if (!b) return;

    // 현재 적용 테마 계산
    const effectiveTheme =
      theme === "dark" || theme === "light"
        ? theme
        : (systemPrefersDark() ? "dark" : "light");

    // 아이콘/텍스트: 너무 과하지 않게
    b.dataset.mode = effectiveTheme; // css에서 쓰려고 저장
    b.title = effectiveTheme === "dark" ? "라이트 모드" : "다크 모드";
  }

  function getSavedTheme() {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  }

  function setSavedTheme(v) {
    if (v === "dark" || v === "light") localStorage.setItem(STORAGE_KEY, v);
    else localStorage.removeItem(STORAGE_KEY);
  }

  function toggleTheme() {
    const saved = getSavedTheme();
    const effective = saved ?? (systemPrefersDark() ? "dark" : "light");
    const next = effective === "dark" ? "light" : "dark";
    setSavedTheme(next);
    applyTheme(next);
  }

  // 시스템 테마가 바뀌면(저장값 없을 때만) 버튼/테마 업데이트
  function bindSystemListener() {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getSavedTheme() === null) applyTheme(null);
      else updateButton(getSavedTheme());
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
  }

  // init
  document.addEventListener("DOMContentLoaded", () => {
    const saved = getSavedTheme();
    applyTheme(saved);

    const b = btn();
    if (b) b.addEventListener("click", toggleTheme);

    bindSystemListener();
  });
})();
