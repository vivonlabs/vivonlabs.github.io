# 새 앱 공식 페이지 추가 플레이북

## 채팅에 붙여 넣기용 프롬프트 (예시)

아래에서 `<AppName>`만 바꿔서 사용하면 됩니다. (표시 이름과 폴더명이 같을 때)

```text
플레이북 docs/ADD_APP_PLAYBOOK.md와 en/apps/Houriva 패턴을 따라 앱 이름 <AppName>으로 소개 페이지·개인정보처리방침 페이지와 허브 링크를 추가해줘. Play 블록을 넣을 때는 아이콘을 assets/images/apps/<AppName>/icon.png 에 두고 허브 img src를 그 경로로 맞춰줘. Google Play 링크·아이콘·배지는 아직 없으면 블록을 생략하고 준비 중 문구만 넣어줘.
```

## 목표

- CheckMED / Houriva와 **동일한 URL·파일 구조**로 다국어(ko, en, ja) 앱 허브를 유지한다.

## 네이밍

- **폴더명**: `PascalCase` (예: `CheckMED`, `Houriva`). 공백·소문자-only는 피한다.
- **파일명**: 앱 소개 `index.html`, 정책 `privacy.html` 고정.

## 생성할 경로 (로케별 6개 HTML)

루트 `apps/` 레거시 리다이렉트는 사용하지 않는다. 실제 URL은 항상 `en|ko|ja/apps/...` 이다.

| 경로 | 역할 |
|------|------|
| `en/apps/<AppName>/index.html` | 영문 앱 소개 |
| `en/apps/<AppName>/privacy.html` | 영문 개인정보처리방침 |
| `ko/apps/<AppName>/index.html` | 한국어 앱 소개 |
| `ko/apps/<AppName>/privacy.html` | 한국어 개인정보처리방침 |
| `ja/apps/<AppName>/index.html` | 일본어 앱 소개 |
| `ja/apps/<AppName>/privacy.html` | 일본어 개인정보처리방침 |

## 허브 페이지 수정 (4파일)

CheckMED 블록과 Timer 블록 **사이**에 새 앱 섹션을 넣는 것을 권장한다.

1. **루트** [`index.html`](../index.html): 링크는 **`en/apps/<AppName>/index.html`**, **`en/apps/<AppName>/privacy.html`** (영문 실제 경로).
2. **로케별** [`en/index.html`](../en/index.html), [`ko/index.html`](../ko/index.html), [`ja/index.html`](../ja/index.html): 같은 언어 폴더 기준 **`apps/<AppName>/index.html`**, **`apps/<AppName>/privacy.html`**.

각 로케일 허브의 제목·설명 문구는 해당 언어로 짧게 맞춘다.

## 허브 앱 아이콘 (Play 스토어 블록이 있을 때)

- **파일 위치**: `assets/images/apps/<AppName>/icon.png` — `<AppName>`은 `en/apps/<AppName>/` 와 동일한 `PascalCase` 폴더명과 맞춘다.
- **형식**: 정사각 PNG 권장(예: 512×512). 모서리 둥글림은 CSS 클래스 `.hub-store-link__icon`으로 처리하므로 사각 이미지 그대로 두면 된다.
- **허브 `img` `src`**:
  - 루트 [`index.html`](../index.html): `assets/images/apps/<AppName>/icon.png`
  - 로케일 허브: `../assets/images/apps/<AppName>/icon.png`
- Play 링크·배지·아이콘 중 하나라도 없으면 **블록 전체를 넣지 않는다** (아래 「스토어·이미지」와 동일).

## 앱 페이지·정책 페이지 공통 요구사항

템플릿으로 [`en/apps/Houriva/index.html`](../en/apps/Houriva/index.html) 등을 복사해 이름·문구만 바꾸는 방식이 안전하다.

- `html lang`: 해당 로케일 (`ko` / `en` / `ja`).
- `canonical`, `alternate` hreflang 4종 + `x-default` → **영문 URL** (`en/apps/...`).
- 스타일: `../../../assets/css/style.css`.
- 언어 전환: `nav#langSwitch`, `data-rel` 값은 `apps/<AppName>/index.html` 또는 `apps/<AppName>/privacy.html`.
- 언어 링크: `../../../ko|en|ja/apps/<AppName>/...` 형태.
- 하단 스크립트: `locale-shared.js`, `lang-switcher.js`, `theme-toggle.js` (경로 `../../../assets/js/...`).
- 테마 FAB 마크업: 기존 앱 페이지와 동일.
- 앱 소개: 정책으로 가는 버튼·푸터에 App Hub 링크 (`../../index.html`).
- 앱 소개 하단 **Google Play CTA**: App Hub와 동일한 `hub-store-link-wrap` 패턴 — 스토어 URL·아이콘·배지가 있으면 `hub-store-link` 링크(CheckMED·Houriva 참고), **미오픈**이면 `span.hub-store-link.hub-store-link--soon`에 로케일 배지 이미지만. 자산 경로는 `../../../assets/images/...`.
- 정책 페이지: 앱 소개·App Hub로 돌아가기 링크 (Houriva `privacy.html` 푸터 참고).

## 스토어·이미지 (선택)

- Play 링크·아이콘·배지는 준비되기 전이면 **허브에 배지 블록을 넣지 않는다** (깨진 이미지 방지).
- 준비 후에는 CheckMED 허브의 `hub-store-link-wrap` 패턴을 동일하게 적용하고, 아이콘은 위 **「허브 앱 아이콘」** 경로 규칙을 따른다.

## 수정하면 안 되는 파일 (루트)

저장소 루트의 아래 파일은 **에이전트가 수정·삭제하지 않는다** ([`AGENTS.md`](../AGENTS.md)와 동일).

- `app-ads.txt`
- `CNAME`
- `google39b438b48ece26d9.html`
- `zzzindex.html`

`zzzindex.html`을 루트 허브와 맞춰야 하면 **수동**으로 반영한다.

## 완료 후 확인

- `en|ko|ja/apps/<AppName>/` 각 URL이 해당 언어 콘텐츠로 열리는지.
- ko/en/ja 앱 소개·정책에서 언어 전환·테마 토글이 동작하는지.
- 루트·로케일 네 허브에서 링크가 404 없이 열리는지.
- Play 블록을 넣었다면 `assets/images/apps/<AppName>/icon.png`가 네 허브에서 모두 열리는지.
