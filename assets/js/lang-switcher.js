(() => {
  const LABELS = { ko: "한국어", en: "English", ja: "日本語" };

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("langSwitch");
    if (!nav || !window.VivonLocale) return;

    const rel = nav.getAttribute("data-rel") || "index.html";
    const cur = VivonLocale.localeFromPath() || "ko";

    const relClean = rel.replace(/^\//, "");

    VivonLocale.SUPPORTED.forEach((loc) => {
      const a = document.createElement("a");
      a.href = VivonLocale.buildLocalizedUrl(loc, relClean);
      a.textContent = LABELS[loc] || loc;
      a.setAttribute("hreflang", loc);
      if (loc === cur) {
        a.setAttribute("aria-current", "true");
        a.classList.add("lang-switch__current");
      }
      a.addEventListener("click", () => VivonLocale.persistLocale(loc));
      nav.appendChild(a);
    });

    nav.removeAttribute("hidden");
  });
})();
