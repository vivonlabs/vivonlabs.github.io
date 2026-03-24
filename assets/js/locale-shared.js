(() => {
  const SUPPORTED = ["ko", "en", "ja"];
  const STORAGE_KEY = "vivon_site_locale";

  function isFileProtocol() {
    return location.protocol === "file:";
  }

  function pathnameNorm() {
    return location.pathname.replace(/\\/g, "/");
  }

  function fromQuery() {
    const p = new URLSearchParams(window.location.search);
    const q = (p.get("lang") || p.get("hl") || "").toLowerCase();
    if (q.startsWith("ko")) return "ko";
    if (q.startsWith("ja")) return "ja";
    if (q.startsWith("en")) return "en";
    return null;
  }

  function fromStorage() {
    const v = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(v) ? v : null;
  }

  function fromNavigator() {
    const list = navigator.languages || [navigator.language || "en"];
    for (const raw of list) {
      const x = String(raw).toLowerCase();
      if (x.startsWith("ko")) return "ko";
      if (x.startsWith("ja")) return "ja";
      if (x.startsWith("en")) return "en";
    }
    return "en";
  }

  function resolveLocale() {
    return fromQuery() || fromStorage() || fromNavigator();
  }

  function persistLocale(loc) {
    if (SUPPORTED.includes(loc)) localStorage.setItem(STORAGE_KEY, loc);
  }

  /**
   * http(s)는 /ko/... 형태. file://(로컬 파일)은 드라이브 경로라 /^\/ko/ 패턴이 깨지므로 세그먼트로 탐지.
   */
  function localeFromPath() {
    const p = pathnameNorm();
    const m = p.match(/\/(ko|en|ja)(?=\/|\/index\.html|$)/i);
    return m ? m[1].toLowerCase() : null;
  }

  /** 로컬 파일 기준 저장소 루트 pathname (끝에 /) */
  function getRepoRootPathname() {
    let p = pathnameNorm();
    p = p.replace(/\/[^/]+\.html?$/i, "");
    const deep = p.match(/^(.+)\/(ko|en|ja)\/apps\/[^/]+$/i);
    if (deep) {
      const root = deep[1];
      return root.endsWith("/") ? root : `${root}/`;
    }
    const hub = p.match(/^(.+)\/(ko|en|ja)$/i);
    if (hub) {
      const root = hub[1];
      return root.endsWith("/") ? root : `${root}/`;
    }
    const legacy = p.match(/^(.+)\/apps\/[^/]+$/i);
    if (legacy) {
      const root = legacy[1];
      return root.endsWith("/") ? root : `${root}/`;
    }
    return p.endsWith("/") ? p : `${p}/`;
  }

  function fileHrefFromRepoRootPathname(rootPathname) {
    let r = rootPathname.replace(/\/+/g, "/");
    if (!r.endsWith("/")) r += "/";
    if (r.startsWith("/")) {
      return `file://${r}`;
    }
    return `file:///${r}`;
  }

  function getRepoRootHref() {
    if (!isFileProtocol()) {
      const o = location.origin;
      return o.endsWith("/") ? o : `${o}/`;
    }
    return fileHrefFromRepoRootPathname(getRepoRootPathname());
  }

  /**
   * 로케일별 페이지 URL (GitHub Pages / 로컬 file:// 공통)
   * @param {string} loc ko|en|ja
   * @param {string} relPath 예: index.html, apps/CheckMED/privacy.html
   */
  function buildLocalizedUrl(loc, relPath) {
    const clean = String(relPath || "index.html").replace(/^\//, "");
    if (!isFileProtocol()) {
      return `/${loc}/${clean}`;
    }
    return `${getRepoRootHref()}${loc}/${clean}`;
  }

  function normalizePathForCompare(href) {
    try {
      const u = new URL(href);
      let p = u.pathname.replace(/\\/g, "/").toLowerCase();
      p = p.replace(/\/index\.html$/i, "");
      p = p.replace(/\/$/, "") || "/";
      return p;
    } catch {
      return String(href).toLowerCase();
    }
  }

  /**
   * 레거시 URL 등에서 locale 경로로 즉시 이동
   * @param {string} relPath locale 루트 기준 상대 경로
   */
  function redirectTo(relPath) {
    const loc = resolveLocale();
    persistLocale(loc);
    const clean = String(relPath || "index.html").replace(/^\//, "");
    const targetUrl = buildLocalizedUrl(loc, clean);
    const cur = normalizePathForCompare(location.href.split(/[#?]/)[0]);
    const next = normalizePathForCompare(targetUrl);
    if (cur !== next) {
      window.location.replace(targetUrl);
    }
  }

  window.VivonLocale = {
    SUPPORTED,
    STORAGE_KEY,
    resolveLocale,
    persistLocale,
    localeFromPath,
    getRepoRootHref,
    buildLocalizedUrl,
    redirectTo,
  };
})();
