# Quizly 앱 초기 세팅 설계

| | |
|---|---|
| 날짜 | 2026-11-13 |
| 대상 | `Quizly-Team/app` (신규), `Quizly-Team/frontend` (기존, 소폭) |
| 작성 근거 | 2026-11-13 브레인스토밍 세션 |
| 이동 예정 | 앱 레포 생성 후 `docs/ai/` 로 |

## 1. 의도

1차 MVP 는 한 코드베이스로 iOS 와 Android 를 동시에 커버하는 네이티브 앱이다. 태블릿을 기준 사이즈로 그리고 폰으로 축소한다. 대상은 B2C 이고, 태블릿에 최적화된 서비스라서 앱이 먼저다. 웹은 서비스 소개와 문의만 남긴다.

2차는 시장 반응을 보고 결제와 PWA 를 강화하는 방향이지만, 1차 세팅에서 그걸 미리 준비하지 않는다. 지금 넣으면 쓰지 않는 구조를 유지보수하게 된다.

혼자 개발한다. 그래서 세팅 기준은 **사람 손이 가장 덜 가는 쪽**이다.

## 2. Goals, Non-goals, Anti-goals

### Goals

1. 한 코드베이스에서 iOS 와 Android 빌드가 둘 다 나온다
2. 태블릿 기준 레이아웃이 폰에서 깨지지 않는 규칙이 코드와 하네스 양쪽에 박힌다
3. 첫 이슈부터 `rh-dev-orchestrator` 가 돈다
4. 피그마의 신규 디자인을 코드로 옮기는 경로가 있다
5. 움직이는 백엔드 계약을 앱이 조용히 우회하지 않는다

### Non-goals (1차에서 하지 않는다)

| 항목 | 이유 |
|---|---|
| 기존 웹 기능을 앱으로 이식 | 디자인을 새로 가므로 포팅이 아니라 신규 구현이다. 이식 계획을 세팅 단계에서 세우지 않는다 |
| 결제, IAP | 2차 범위. 아래 주석 참조 |
| PWA, 웹 앱 강화 | 2차 범위 |
| 모노레포 | 1차에 공유할 코드가 없다 |
| 디자인 토큰 파이프라인 | 토큰을 안 쓰기로 했다 |
| 오프라인 모드 | B2C 학습 앱이고 요구에 없다 |
| iOS 스토어 배포 | Apple 계정 확보 후 |
| 신규 web 레포 | 기존 레포를 쓴다 (4.1 참조) |

> **2차 결제에 대한 주석.** 1차에서 할 일은 없지만 미리 알아둘 제약이 있다. 앱 안에서 유료 기능을 파는 것은 "디지털 콘텐츠" 판매라서 결제 수단을 앱이 자유롭게 고르는 문제가 아니다. 스토어 정책이 먼저 결정하고, 그 위에서 스토어 인앱결제와 외부 결제 SDK(토스페이먼츠 등) 중 무엇이 가능한지가 갈린다. 한국은 2021년 전기통신사업법 개정 이후 외부 결제 허용 범위가 따로 있고 수수료 구조도 다르다. **이 영역은 규정과 집행이 계속 움직이므로 2차 착수 시점에 다시 확인할 항목으로 남긴다.** 지금 가정을 박아두면 틀린 전제로 설계하게 된다. 스택 선택(Expo, RN)은 어느 쪽이든 막지 않는다.

### Anti-goals (이게 되면 기술적으로 돌아가도 실패다)

1. 플랫폼 분기가 화면 단위로 생기는 것. `.ios.tsx` / `.android.tsx` 로 화면을 두 벌 만드는 순간 "한 코드로 둘 다"가 깨진다
2. `.claude/` 를 또 gitignore 해서 하네스가 사라지는 것. 기존 `frontend` 레포에서 이미 한 번 일어났다
3. 하네스가 무거워서 작은 작업에 안 쓰게 되는 것
4. 태블릿에서만 맞고 폰에서 깨진 화면이 머지되는 것

## 3. 제약

| 제약 | 귀결 |
|---|---|
| Apple Developer 계정 없음 | iOS 는 빌드 대상이고 시뮬레이터 검증도 하지만, 실기기와 스토어는 보류 |
| 백엔드가 앱에 맞게 일부 개편 예정 | 계약이 움직인다. 정본을 로컬 코드가 아니라 배포된 스펙으로 고정해야 한다 |
| 피그마 PAT 만료 (403) | `figma-developer-mcp` 가 아니라 공식 플러그인 MCP 의 OAuth 경로로 읽는다 |
| 디자인 토큰 파이프라인 없음 | 상수 파일 한 곳이 단일 소스. 디자인 변경은 수동 반영 |
| 1인 개발 | 비평 루프에 상한이 있어야 한다. 끝없이 도는 파이프라인은 혼자서는 못 끊는다 |

## 4. 고려한 접근법

### 4.1 레포 구조

| 안 | 내용 | 판단 |
|---|---|---|
| A | `app` 신규 + 기존 `frontend` 유지 | **채택** |
| B | `app` 신규 + `web` 신규, 기존 archive | 탈락 |
| C | 모노레포 (`apps/mobile`, `apps/web`, `packages/*`) | 탈락 |

채택 근거. 1차 웹 범위는 소개 1개와 문의 1개다. 기존 레포는 13,155 LOC, 라우트 13개, Vercel 배포가 이미 서 있고 Tailwind 4 가 우세해서 새 랜딩이 그대로 들어간다. B 는 Vercel 프로젝트, lint/format, husky, commitlint, CI 를 한 번 더 세팅하고 도메인 하나를 두 레포가 나눠 갖는 rewrite 설정까지 만든다. C 는 공유 코드가 1차에 없는데 EAS 빌드와 workspace hoisting 충돌을 떠안는다. 둘 다 1차에 값을 치를 이유가 없다.

기존 웹을 완전히 내리기로 하면 그때도 레포를 새로 만들 게 아니라 브랜치에서 지우면 된다.

### 4.2 상위 스택

| 안 | 내용 | 판단 |
|---|---|---|
| Expo (RN) | `prebuild` 로 네이티브 폴더 생성, EAS 빌드 | **채택** |
| bare RN (RN CLI) | `ios/`, `android/` 직접 관리 | 탈락 |
| WebView 하이브리드 (Capacitor) | 웹 코드를 네이티브 셸로 감싸기 | 탈락 |

채택 근거. 요구는 "한 코드로 iOS 와 Android 를 동시에"다. 세 안 모두 그걸 만족한다. 갈리는 건 유지 비용이다.

bare 는 RN 을 올릴 때마다 네이티브 폴더 두 개를 수동 머지하는 일을 1인 개발자가 떠안는다. Expo 는 그 작업을 `prebuild` 로 재생성하고, 네이티브 코드가 필요하면 config plugin 으로 넣고, 정말 싫어지면 언제든 bare 로 빼낸다. 즉 bare 는 Expo 의 부분집합이 아니라 Expo 를 쓰다가 도달할 수 있는 상태다. 먼저 갈 이유가 없다.

Capacitor 는 로드맵(2차 PWA 강화)과는 가장 잘 맞는다. 코드 하나로 앱 둘에 PWA 가 사실상 공짜다. 탈락 이유는 두 개다. 태블릿 최적화가 제품의 핵심인데 WebView 는 스크롤 관성, 제스처, 화면 전환에서 네이티브 느낌을 포기한다. 그리고 학습 앱은 App Store 심사 가이드라인 4.2 Minimum Functionality 에서 "웹사이트 포장"으로 보기 쉬운 범주다. 1차에 스토어 리젝 리스크를 안을 자리가 아니다.

`if_ent_app` 에서 Expo 로 가 본 전례가 있어 함정을 이미 안다는 것도 근거에 넣는다.

### 4.3 하네스 세대

| 안 | 내용 | 판단 |
|---|---|---|
| v2 `rh` 이식 (`if_ent_app` 기반) | 에이전트 6, 스킬 6, 승인 게이트 명시 | **채택** |
| v1 `quizly-dev-workflow` 복원 | 에이전트 9, 레이어 전문가 팀 | 탈락 |

채택 근거. v1 은 **실물이 없다.** 기존 `frontend` 의 `CLAUDE.md` 에 9에이전트 파이프라인이 문서화돼 있지만 `.claude/` 가 커밋 `7502eb7` 에서 gitignore 로 들어가 사라졌다. 복원은 복원이 아니라 재작성이다. 게다가 v1 의 레이어 전문가 3인 구성은 화면 13개가 이미 있는 레포에서 경계면 불일치를 잡으려고 만든 것이고, 신규 앱은 화면 0개에서 시작한다. v2 는 승인 게이트가 명시적이고 비평 루프에 3회 상한이 있어 1인 개발에 맞다.

## 5. 결정 사항

### 5.1 레포

| 항목 | 값 |
|---|---|
| 이름 | `Quizly-Team/app`, **public** (기존 두 레포와 동일) |
| 브랜치 | `main` + `dev` 2단. **PR base 는 `dev`**, 출시 당에 `dev` to `main` |
| `.claude/` | **커밋한다.** gitignore 에 넣지 않는다 |
| `docs/ai/**` | 코드와 같은 커밋에 사람이 올린다 |
| 워크플로우 | 예외 없이 이슈 to 브랜치 to PR. `feat/#<번호>`, `fix/#<번호>` |
| 커밋 | 제목만. 본문, `Co-Authored-By`, AI 서명 금지 |
| 이슈/PR 제목 | 명사형 어미 (`fix: Completed 제거`). 서술형 금지 |

### 5.2 스택

| 구분 | 값 | 근거 |
|---|---|---|
| 런타임 | Expo SDK 최신 **안정판**, RN, React 19 | 4.2 |
| 언어 | TypeScript `strict` | |
| 라우팅 | expo-router (파일 기반) | |
| 서버 상태 | TanStack Query | 기존 웹과 같은 개념이라 전환 비용 0 |
| 클라 상태 | **처음엔 넣지 않는다.** 전역 클라 상태가 실제로 생길 때 Zustand | 기존 웹이 zustand 를 설치만 하고 미사용으로 방치한 전례 |
| 스타일 | **세팅 시점 실측 후 결정** (5.3) | |
| Lint | oxlint | `if_ent_app` 과 동일 |
| Format | oxfmt | |
| 테스트 | vitest (순수 함수 한정) | 기존 웹은 러너가 아예 없었다. 최소 하나는 깐다 |
| 플랫폼 | iOS + Android 한 코드. 출시만 Android 먼저 | |

### 5.2.1 New Architecture 가 기본이다

RN 0.76 부터 New Architecture(JSI, Fabric, TurboModules)가 기본이고 **브릿지는 제거됐다.** 흔히 인용되는 "JS 브릿지로 네이티브를 호출한다"는 설명은 그 이전 구조다. 결과물은 같거나 더 좋다. JS 와 네이티브 사이 직렬화 병목이 없어진다.

세팅에 영향이 있는 건 하나다. **라이브러리 선택 기준에 New Architecture 지원 여부를 넣는다.**

| 상황 | 대응 |
|---|---|
| 라이브러리가 New Architecture 를 지원 | 그대로 쓴다 |
| 미지원 | interop layer 로 돌아갈 수는 있지만 성능과 수명이 불확실하다. **다른 라이브러리를 찾는다** |
| 대안이 없음 | 그 기능을 1차 범위에서 뺄지 사람이 판단한다. 조용히 interop 으로 가지 않는다 |

확인 경로는 React Native Directory 의 New Architecture 배지와 각 라이브러리 README 다. `planner` 가 새 라이브러리를 계획에 넣을 때 이 확인을 §4 에 적는다.

### 5.3 스타일 스택은 실측으로 정한다

NativeWind **안정판**이 채택할 Expo SDK 를 peer 로 명시하면 NativeWind, 아니면 `StyleSheet` + 상수 스케일로 간다.

RC 를 밟지 않는 게 이 결정의 핵심이다. `if_ent_app` 이 NativeWind 5 RC 에서 밟은 함정 두 개가 둘 다 **빌드는 통과하고 화면만 조용히 비는** 형태로 실패했다. `lightningcss` 를 `1.30.1` 로 핀해야 하고, `postcss.config.js` 가 없으면 유틸리티 클래스가 0개 생성된다. 1차 세팅에서 쓸 시간이 아니다.

실측 명령은 `npm info nativewind peerDependencies`. 세팅 담당이 그 출력을 `docs/ai/measurements/` 에 남기고 결정한다.

### 5.4 디자인 수용 경로: 웹 토큰을 그대로 쓴다

**2026-11-13 변경.** 당초 "토큰 안 씀, 상수 파일 수동 관리"로 잡았는데 사용자가 웹의 토큰을 그대로 쓰기로 정했다. 확인해보니 웹 파이프라인은 죽은 게 아니라 **디자이너가 실제로 쓰는 살아 있는 경로**였다. 앞선 판단이 틀렸다.

**실측한 웹 파이프라인.**

| 항목 | 값 |
|---|---|
| 소스 | `Quizly-Team/frontend` 의 `tokens/tokens.json` (Tokens Studio, DTCG). 세트 9개 |
| 유입 | 디자이너가 피그마에서 `design-tokens` 브랜치로 Push |
| CI | `.github/workflows/design-tokens.yml` 이 변환하고 `dev` 로 PR |
| 출력 | `src/styles/tokens.css` (CSS 변수 + Tailwind 4 `@theme`) |
| 정본 브랜치 | `dev`. `main` 에는 없다 (실측) |
| 최종 갱신 | 2026-11-05 `d9f0213` |

**앱의 재사용 방식.**

| 항목 | 결정 |
|---|---|
| 토큰 소스 | **하나다.** 디자이너는 계속 웹 레포로만 Push 한다. 두 곳에 Push 하게 만들면 깨진다 |
| 가져오는 방법 | 앱 레포 `scripts/build-tokens.mjs` 가 `https://raw.githubusercontent.com/Quizly-Team/frontend/dev/tokens/tokens.json` 을 받는다. **public 레포라 인증이 필요 없다** |
| 출력 | `src/shared/constants/theme.ts` 를 **생성**한다. `as const` 객체다. RN 은 CSS 변수를 못 쓴다 |
| 갱신 | `npm run tokens:build` 수동. **크로스 레포 CI 와 PAT 를 만들지 않는다** |
| 직접 수정 | 금지. 자동 생성 파일이고 파일 머리에 그렇게 적는다 |

웹 스크립트에서 가져올 로직 네 개가 있다. 전부 하드코딩 값으로는 재현이 안 되는 것들이다.

1. 세트 재귀 병합. 얕은 병합이면 `gray` 그룹이 통째로 덮여 `{gray.800}` 참조가 안 풀린다
2. `deref`. `{line-height.3xl}` 같은 세트 간 참조를 실제 값으로 푼다
3. 타이포 합성 토큰 수동 해체. style-dictionary 의 font shorthand 변환을 타면 속성이 깎인다
4. 스페이싱 그리드 검증. 스케일이 4px 스텝을 벗어나면 빌드를 세운다

버리는 것: Tailwind `@theme` 블록 전부(RN 무관), `data-theme` 다크 블록(아직 안 씀. 다크를 켤 때 다시 꺼낸다).

**피그마 직접 읽기는 토큰에 없는 것에만 쓴다.** 공식 플러그인 MCP 의 OAuth 경로다 (`figma-developer-mcp` 는 PAT 만료로 403).

### 5.4.1 ⚠️ 토큰과 설계가 충돌하는 지점

실측하다 발견했다. 임의로 정하지 않고 디자이너 대화 항목으로 넘긴다.

| 토큰 | 값 | 설명 | 충돌 |
|---|---|---|---|
| `layout.touch-min` | **40** | 최소 터치 영역 (태블릿 포함) | 설계 5.5 는 44 로 잡았다. 40 은 Apple HIG 44pt 와 Material 48dp **둘 다 미달**이다 |

접근성은 깎지 않는다. 그래서 둘 중 하나로 가야 한다. 토큰을 44 이상으로 올리거나, 토큰은 그대로 두고 앱이 44 를 바닥으로 깔되 그 예외를 `quizly-app-conventions` 에 명시한다. 후자는 "토큰이 단일 소스"를 깨므로 전자가 낫다. **디자이너 확인이 필요하다.**

참고로 쓸 수 있는 다른 레이아웃 토큰이 있다. `content-max 1200`, `readable-max 840`, `panel 420`. `panel` 설명이 "2단 화면 오른쪽 고정 패널 폭"이라 디자이너가 이미 태블릿 2단을 전제하고 있다.

**브레이크포인트 토큰은 없다.** `breakpoint`, `tablet`, `phone`, `desktop` 전부 0회다. 앱이 정할 값이다 (5.5).

### 5.5 태블릿 기준에서 폰 축소

이 프로젝트의 가장 반복되는 작업이다. 규칙을 `quizly-app-conventions` 스킬에 박아 builder, code-critic, layout-auditor 가 같은 기준으로 본다.

| 규칙 | 내용 |
|---|---|
| 브레이크포인트 | **1개만.** 폰과 태블릿. 화면마다 `useWindowDimensions` 로 분기하지 않는다 |
| 간격 | 고정 px 금지. 생성된 `theme.ts` 의 스케일에서만 꺼낸다 |
| 2단에서 1단 | 한 컴포넌트 안에서 전환한다. 화면을 두 벌 만들지 않는다 (Anti-goal 1) |
| 터치 타겟 | ⚠️ **5.4.1 미해결.** 토큰은 40, 설계는 44 다. 디자이너 확인 전까지 44 를 바닥으로 쓴다 |

브레이크포인트 값은 **잠정 768** 이다. 토큰에 브레이크포인트가 없어서 앱이 정해야 하고, 768 은 RN 에서 흔히 쓰는 태블릿 임계값이다. 디자이너와 레이아웃을 확정할 때 `content-max 1200`, `readable-max 840`, `panel 420` 에서 역산한 값으로 바꿀 수 있다. 바꿀 자리는 `src/shared/layout/breakpoint.ts` 상수 한 곳이고 테스트가 경계를 들고 있다.

### 5.6 하네스

`if_ent_app` 의 rh 를 이식한다. 파이프라인은 그대로다.

```
Plan 비평  ->  〔사람 승인〕  ->  Implement 비평  ->  QA
```

| 구성 | 내용 |
|---|---|
| 에이전트 6 | `planner`, `plan-critic`, `builder`, `code-critic`, `integration-qa`, **`layout-auditor`** |
| 스킬 6 | `rh-dev-orchestrator`, `rh-plan`, `rh-implement`, `rh-qa`, `quizly-app-conventions`, `quizly-be-contract` |
| 게이트 | `.claude/scripts/check-gate.sh` = typecheck + oxlint + oxfmt --check + vitest. **절대 0건.** 베이스라인 도입 금지 |
| 산출물 | `docs/ai/{plan,plan-critique,review,qa}/<id>.md` |
| 외부 스킬 | `ponytail` (코드 쓰거나 고치거나 리뷰하는 모든 작업), `frontend-design` (신규 화면) |
| 하드 룰 | 오케스트레이터와 서브에이전트는 commit, push, PR 을 하지 않는다 |

`if_ent_app` 대비 델타는 두 개다.

**`device-prober` 제거.** 고정 하드웨어 100대를 관제하는 앱이 아니다. B2C 라서 실측해야 할 특정 기기가 없다.

**`layout-auditor` 추가.** 변경된 화면마다 태블릿과 폰 두 사이즈를 확인하고 5.5 규칙 위반을 잡는다. Anti-goal 4 를 막는 전담 역할이다. 모델은 sonnet 으로 충분하다.

끼우는 위치를 명시한다. Phase 2 에서 `code-critic` 과 **병렬 호출**하고, 산출물은 `docs/ai/review/<id>-layout.md` 로 분리한다. Phase 2 통과 조건은 `code-critic` 이 `approve` **그리고** `layout-auditor` 가 `pass` 다. 둘 중 하나라도 걸리면 `builder` 재호출로 간다. UI 변경이 없는 작업(순수 로직, API 레이어만 손본 경우)에서는 호출하지 않는다.

### 5.7 움직이는 백엔드 계약 대응

Quizly 고유 조건이다. 백엔드를 앱에 맞게 일부 개편할 예정이라 계약이 확정되지 않았다.

| 장치 | 내용 |
|---|---|
| `quizly-be-contract` 스킬 | 계약 정본은 **백엔드 레포의 컨트롤러 소스**다. 기존 웹 클라이언트 코드를 근거로 쓰지 않는다 |
| 1차 조회 경로 | `gh api "repos/Quizly-Team/backend/git/trees/main?recursive=1"` 로 컨트롤러를 열거하고 필요한 파일만 읽는다. public 레포라 인증이 필요 없다 |
| 2차 조회 경로 | 배포 Swagger. ⚠️ **막혀 있다** (아래 실측) |
| planner 의 범위 선분리 | 매 작업마다 §Non-goals 에 **서버 변경 요청**을 분리해 적는다. 앱이 서버 부재를 우회하는 코드를 발명하지 않는다 |
| 미결 계약 누적 | `docs/ai/contract-gaps.md` 에 번호로 쌓는다 (`if_ent_be` 의 `client-impact-log.md` 패턴) |

**실측 (2026-11-13).** 호스트는 `https://api.quizly.co.kr` 이고 서버는 살아 있다.

| 엔드포인트 | 결과 |
|---|---|
| `GET /swagger-ui/index.html` | `200`. 정적 HTML 만 |
| `GET /v3/api-docs` | `401` `TOKEN_NOT_FOUND` |
| `GET /v3/api-docs/swagger-config` | `401` `TOKEN_NOT_FOUND` |

Spring Security 가 `/v3/api-docs` 를 막고 있어서 **하네스가 WebFetch 로 스펙을 읽을 수 없다.** UI 페이지는 열리지만 스펙 JSON 을 못 받는다. 그래서 1차 경로를 컨트롤러 소스로 뒤집었다. 이게 더 낫기도 하다. 컨트롤러가 유스케이스 하나씩 31개로 쪼개져 있고(`<Verb><Noun>Controller`) 열거가 되며, 코드가 사실이라는 원칙에 그대로 맞는다.

**서버 변경 요청 1건.** `/v3/api-docs` 를 인증 예외로 열면 조회가 한 번에 끝난다. 작은 SecurityConfig 변경이다. 백엔드를 어차피 손볼 예정이니 그때 묶는다. 열리기 전까지는 컨트롤러 소스가 정본이다.

**부수 발견.** 백엔드에 기존 웹이 쓰지 않는 도메인이 있다. `chatbot`, `dailyquiz`, 그리고 OCR 계열 4개(`CreateOcrMemberQuizzesController`, `CreateMemberOcrMockExamController` 등). 앱 기획에서 쓸 수 있는 자산이므로 planner 가 계획 단계에서 한 번 훑는다.

### 5.8 검증 경로

| 영역 | 어디서 | 비고 |
|---|---|---|
| 순수 로직 | vitest | 먼저다 |
| UI, 라우팅, 상태 | Android 에뮬레이터 | 태블릿 AVD 와 폰 AVD **2개를 띄운다** |
| iOS 레이아웃 | **iOS 시뮬레이터** | Xcode 만 있으면 된다. 유료 계정 불필요 |
| REST, 인증, 업로드 | 에뮬레이터 | 네트워크만 쓴다 |
| 실기기, 스토어 | 보류 | Apple 계정 확보 후 |

iOS 시뮬레이터가 계정 없이 된다는 게 중요하다. "iOS 는 나중"이 아니라 레이아웃 깨짐은 1차부터 잡는다. 계정이 막는 건 실기기 설치와 스토어 배포뿐이다.

### 5.9 세팅 순서

| 단계 | 작업 | 검증 |
|---|---|---|
| 1 | 레포 생성, Expo 프로젝트 초기화 | `npx expo run:android` 로 빈 화면이 뜬다 |
| 2 | TS strict, oxlint, oxfmt, vitest, `check-gate.sh` | 게이트 0건 |
| 3 | 스타일 스택 실측 결정 (5.3) | 유틸리티 또는 스타일이 실제 적용된 화면 1개. `measurements/` 에 근거 |
| 4 | `src/` 디렉터리 규약 + `theme.ts` | 태블릿 AVD 와 폰 AVD 에서 같은 화면이 안 깨진다 |
| 5 | `.claude/` 하네스 이식 (에이전트 6, 스킬 6) | **세션 재시작 후** `rh-dev-orchestrator` 트리거가 걸리고 첫 이슈를 Phase 0 까지 몰고 간다 |
| 6 | iOS 시뮬레이터 빌드 | `npx expo run:ios` 로 같은 화면 |
| 7 | 웹 레포 `CLAUDE.md` 하네스 섹션 정정 | 문서에 적힌 스킬이 전부 실존한다 |

단계 5 의 "세션 재시작"은 생략하면 안 된다. `.claude/agents/` 와 `.claude/skills/` 는 세션 시작 시점에 등록되고, 상위 폴더에서 세션을 시작하면 에이전트가 `not found` 로 뜨며 하네스가 통째로 안 걸린다.

### 5.10 기존 웹 레포

| 항목 | 내용 |
|---|---|
| 신규 레포 | 만들지 않는다 |
| 추가 | 랜딩 1개 + 문의 1개. 랜딩이 `/` 를 가져가고 지금 `/` (문제 생성)는 다른 경로로 내린다 |
| 기존 기능 | 건드리지 않는다. 그대로 살려둔다 |
| 하네스 | 복원하지 않는다. `ponytail` + `frontend-design` 으로 충분하다 |
| `CLAUDE.md` | `quizly-dev-workflow` 섹션이 문서만 남은 상태다. 실물에 맞게 정정한다 |

## 6. 빌더에게 남기는 것

세팅 담당이 판단해도 되는 항목이다.

1. Expo SDK 정확한 버전과 NativeWind peer 지원 여부 (5.3 의 실측 결과로 결정)
2. `src/` 하위 폴더 이름 세부. 디렉터리는 **코드가 들어갈 때 만든다.** 빈 폴더를 미리 두지 않는다
3. AVD 모델 선정 (태블릿 1개, 폰 1개)
4. `layout-auditor` 의 프롬프트 세부

## 7. 미결 (사람만 답할 수 있다)

| 항목 | 왜 필요한가 |
|---|---|
| Apple Developer 계정 결제 시점 | iOS 실기기와 스토어 일정이 여기 달려 있다. 시뮬레이터 검증은 이것 없이 진행한다 |
| 기존 웹 트래픽 규모 | `/` 를 랜딩으로 바꾸는 시점을 정하는 근거 |

해결됨 (2026-11-13): PR base 는 `dev` (5.1), 레포는 `Quizly-Team/app` public (5.1), API 호스트는 `https://api.quizly.co.kr` 이고 Swagger 가 막혀 있어 컨트롤러 소스를 정본으로 뒤집었다 (5.7).
