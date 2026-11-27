---
id: storybook-chromatic
status: approved # draft | approved
approved: true
approved_by: yura0302
approved_at: 2026-11-27
---

# chore: Storybook 과 Chromatic 으로 시각적 테스트와 디자이너 공유

> 작성 2026-11-27 (1회차), 4회차 개정 2026-11-27. 외부 사실은 전부 이 날짜에 공식 문서(WebFetch)와 npm registry, GitHub API 로 확인했다. 레포 안의 사실은 이 날짜의 워킹트리 기준이다.
>
> **개정 기록**
>
> | 회차 | 날짜 | 내용 |
> | --- | --- | --- |
> | 1 | 2026-11-27 | 최초 작성 |
> | 2 | 2026-11-27 | `docs/ai/plan-critique/storybook-chromatic.md` (verdict revise) 반영. C1: §5 자동 7 의 워크플로 검사를 다시 쓰고 음성 대조를 붙였다. M1: 피그마 프레임 폭 읽기를 builder 에서 빼 사람 작업으로 옮겼다. M2: tablet mode 를 `TABLET_MIN_WIDTH` 에서 피그마 태블릿 프레임 폭으로 바꾸고 테스트를 붙였다. Minor m1 에서 m7 은 전부 반영했다 |
> | 3 | 2026-11-27 | 사람 결정 2026-11-27 과 비평 2회차(verdict sound, Minor 5) 반영. (a) 시작점을 "첫 공유 컴포넌트 PR" 에서 "지금, Foundations 스토리(색, 타이포, 간격, 라운딩)" 로 바꿨다 (Step 0-2, Step 4). 착수 조건에서 첫 컴포넌트 계획을 뺐다 (Step 0-4). (b) 목적을 Storybook 시각적 테스트 핸드북의 4단계로 다시 쓰고, `UI Tests` 를 `dev` 의 required check 로 **이 PR 에서** 건다 (Step 0-3). §2 의 Non-goal 전부를 같은 기준으로 재판정했다. (c) 비평 m1 에서 m5 를 전부 반영했다. m1, m2 는 §5 자동 7, m3 은 Step 0-4, m4, m5 는 §6-1. (d) 이 PR 에는 Chromatic mode 를 두지 않는다 (Step 0-5). 2회차 Step 3 의 미리보기 폭 상수와 테스트, 2회차 Step 4 의 `.storybook/preview.ts` 를 뺐다. 폭을 읽는 규칙은 §6-1 로 옮겼다. (e) 피그마는 파일 이름만 쓴다 (§6-1). 순수 함수 `flattenColors` 와 그 테스트가 새로 들어왔다 (Step 3). 단계 번호가 바뀌었다. 2회차 Step 6 은 4, 7 은 6, 8 은 7, 9 는 8, 10 은 9 다 |
> | 4 | 2026-11-27 | 비평 3회차(verdict revise, Critical 1, Major 3, Minor 4) 반영. **C1.** 새 Chromatic 프로젝트의 Build 1 이 auto-accept 될 수 있다 (CLI 저장소 문서). Step 9 와 §5 Chromatic 2, 4, 5, 6 을 갈래 A (auto-accept) 와 갈래 P (pending) 로 갈랐다. 판정은 §5 Chromatic 2 의 표다. auto-accept 는 공식 문서에 없어 §6-23 에 미확인으로 남겼다. **M1.** classic branch protection rule 로 정하고 ruleset 을 쓰지 않는다 (Step 0-3). 화면 경로를 "Add classic branch protection rule", "Create" 로 고쳤다. 협업자 셋 전원이 admin 이라 차단 확인을 admin 계정 기준(Required 표시, 비활성 머지 버튼, bypass 체크박스)으로 바꾸고 bypass 가 실제로 머지 버튼을 여는지 보는 단계를 넣었다 (§5 Chromatic 4). 전원 admin 을 유지할지는 사람이 정한다 (Step 0-4 표). **M2.** "mode 없음, 폭 1200 하나, phone 배치는 스냅샷에 없다" 와 mode 도입 조건을 `quizly-app-conventions/SKILL.md` 의 "태블릿에서 폰으로" 표로 옮긴다 (Step 7). **M3.** §1 과 Step 0-2 의 주장을 "네 export 의 값 변경" 으로 좁혔다. 네 story 모두 값 글자를 같이 그리고 Radius 의 변을 `SPACING["80"]` 으로 고정했다 (Step 4). `OPACITY`, `LAYOUT` 은 넣지 않고 근거를 §2 에 적었다. **Minor.** m1 README 빠짐 목록을 `theme.ts` 머리 SHA 에 묶고 §5 자동 10 으로 검사한다. m2 plan 1 참조를 5회차로 고쳤다. m3 §5 자동 9 에 폭 API grep 을 더했다. m4 Step 8 이슈 3 (사용량 측정과 bypass 기록) 과 §6-8 을 고쳤다. §6 에 23 에서 26 을 더했다 |

> **구현 후 사람 피드백 (2026-11-27, PR #15).** 첫 Chromatic 빌드를 본 사람이 Colors 스토리가 "정리가 안 되고 뒤죽박죽" 이라고 했다. 50개가 폭이 제각각인 라벨로 한 줄 흐름에 섞여 있어서다. 그래서 Step 4 의 "꾸밈을 넣지 않는다" 를 Colors 에 한해 아래로 바꾼다. 다른 세 스토리는 그대로다.
>
> 1. 부모 경로(`status/positive`, `interaction/neutral` 등)별 섹션으로 나누고, 섹션마다 제목을 단다. 순서는 `theme.ts` 의 선언 순서다
> 2. 카드는 모두 같은 폭이다. 견본 아래에 리프 이름과 값을 줄을 나눠 쓴다
> 3. 견본에 `StyleSheet.hairlineWidth` 두께, `COLORS.line.normal` 색의 테두리를 준다. 흰 견본 3개가 배경에서 보이게 하려는 것이다. 새 토큰이나 고정값은 쓰지 않는다
> 4. 묶는 로직은 RN 비의존 순수 함수로 `flattenColors.ts` 에 두고 단위 테스트를 붙인다
> 5. 섹션 제목은 `TYPOGRAPHY["text-1md"].semibold`, 카드 글자는 `TYPOGRAPHY["text-2xs"].regular` 다. Colors 에 한해 "라벨 글자에는 스타일을 주지 않는다" 를 대신한다 (리뷰 2회차 m1)
>
> 이 블록과 어긋나는 Step 4 와 §5 의 Colors 서술(한 줄 흐름, 라벨 무스타일, 꾸밈 없음)은 이 블록이 우선한다. QA 는 이 블록 기준으로 본다.
>
> 이 변경으로 다음 빌드에서 Colors 스냅샷에 diff 가 생긴다. 그래서 Step 9 의 6 마지막 항목대로 **머지 막힘 확인은 이 PR 에서 갈래 P 로** 한다. 다만 (가) 임시 PR 이 맡던 "글자 한 개 바뀐 것을 잡는지" 확인(§6-24)은 이 PR 의 diff 로 대신되지 않는다. 그래서 Step 0-4 의 사람 결정 (가) 는 유지하고, 이 PR 의 diff 를 Accept 한 뒤 임시 PR 을 그 용도로만 연다.

## 1. Context

디자이너가 개발된 UI 를 보려면 지금은 에뮬레이터를 띄워야 하고, 디자이너 손에 그 환경이 없다. UI 가 바뀌었는지도 사람이 화면을 하나씩 열어 봐야 안다. 이 작업은 Storybook 시각적 테스트 핸드북 [^hb] 의 흐름을 이 레포에 그대로 들인다.

1. 스토리로 상태를 고립한다 [^hb-explorer]
2. PR 마다 Chromatic 이 스냅샷을 찍어 승인된 baseline 과 비교한다. 이것이 시각적 테스트 자동화다
3. 의도한 변경은 Accept 해 baseline 을 갱신하고, 의도하지 않은 변경은 고친다 [^hb-auto]
4. 배포된 Storybook 링크로 UI 를 디자이너와 공유한다

첫 스토리는 **토큰 팔레트**다 (사람 결정 2026-11-27). `src/shared/constants/theme.ts` 를 읽어 색, 타이포, 간격, 라운딩을 그린다. 디자이너는 이 팔레트를 피그마와 나란히 놓고 앱이 가진 토큰을 비교한다. 그리고 팔레트는 토큰마다 값을 글자로 같이 쓴다 (Step 4). 그래서 `theme.ts` 가 바뀌는 PR 에서 **팔레트가 그리는 네 export (`COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`) 의 값이 하나라도 바뀌면** 스냅샷 diff 가 생기고 `UI Tests` 체크가 pending 이 되어, Accept 전에는 머지 버튼이 비활성이다. plan 1 (`docs/ai/plan/1.md` 5회차, 미승인) 이 토큰 소스를 커밋 SHA 로 고정하므로, 그 SHA 를 올리는 PR 이 이 게이트를 지난다.

이 게이트가 막는 범위는 두 가지로 좁다. (1) `OPACITY` 와 `LAYOUT` 은 팔레트에 없어 게이트 밖이다 (§2, §6-26). (2) 레포 협업자 셋이 전원 admin 이라, 누구든 머지 박스의 bypass 체크박스를 켜면 pending 인 채로 머지된다 (Step 0-3). 즉 이 게이트는 **모르고 지나가는 변경**을 막고, 의도적으로 넘기는 변경은 막지 않는다.

이 앱은 태블릿 기준으로 그리고 폰으로 줄인다. 같은 컴포넌트를 두 폭으로 찍는 Chromatic mode 는 **폭에 반응하는 첫 컴포넌트와 함께** 들어온다. 팔레트는 폭에 반응하지 않는다 (Step 0-5). 이 PR 뒤로 모든 스냅샷은 폭 1200 하나이고 phone 배치는 스냅샷에 없다. 이 사실과 mode 도입 조건은 Step 7 이 `quizly-app-conventions/SKILL.md` 에 옮겨, 이 계획을 읽지 않는 다음 planner 도 보게 한다.

## 2. Non-goals

3회차에서 모든 항목을 핸드북 4단계(Step 0-3) 기준으로 다시 판정했다. 결론이 뒤집힌 항목은 없고 근거가 바뀐 항목이 있다. "재판정" 표시가 그것이다.

| 항목 | 왜 빼는가 | 어디로 |
| --- | --- | --- |
| 웹 레포 Storybook | `Quizly-Team/frontend` 소관이다. 웹 1차 범위는 소개와 문의라 공유할 컴포넌트가 없다. `dev` 에 Storybook/Chromatic 이 없다 (조정자 실측 2026-11-27) | 웹 레포 |
| 서버 변경 요청 | 백엔드를 전혀 타지 않는다. 요청할 것이 없다 | 없음 |
| 피그마에만 있는 4개(`glass/tint`, `glass/highlight`, `shadow/sheet`, `glass` effect style)를 토큰에 넣는 것 | plan 1 이 고정한 SHA 의 `tokens.json` 에 없다 (`d9f0213` 에서 planner 재확인 2026-11-27, §5 자동 10 의 검사식). 토큰은 디자이너가 웹 레포로만 Push 한다. **팔레트에서 이 4개가 빠져 보이는 것이 정상 동작이다** (사람 결정 2026-11-27) | 디자이너, `Quizly-Team/frontend` `tokens/tokens.json` |
| 기기 안 Storybook (`@storybook/react-native`) 과 Chromatic React Native 프로젝트 | Step 0-1 에서 기각했다. 태블릿과 폰 두 폭을 한 리뷰에 담는 방법이 문서에 없고, 핸드북 4단계의 "배포된 Storybook 링크" 가 문서에 없다 | §6-7 의 재검토 조건이 생기면 별 작업 |
| 첫 공유 UI 컴포넌트 자체의 설계와 구현 | 별 계획이다. 토큰(`docs/ai/plan/1.md`)과 디자이너 시안이 선행이다 | 별 id |
| Chromatic mode (태블릿, 폰 두 폭) | Step 0-5. 팔레트는 폭에 반응하지 않는다 | 폭에 반응하는 첫 컴포넌트 작업. 규칙은 §6-1 |
| Foundations 의 `OPACITY`, `LAYOUT` 스토리 | **4회차 재판단 (비평 M3). 넣지 않는다.** (1) 사람 결정 2026-11-27 이 정한 범위가 색, 타이포, 간격, 라운딩 넷이다. (2) `LAYOUT` 은 plan 1 Step 4 의 7번이 4키 전체를 `toEqual` 로 고정한다. 기다리는 변경인 `touch-min` 40 에서 44 는 SHA 를 올리는 PR 에서 그 테스트를 깨고, plan 1 Step 5 가 그 PR 에서 할 교체까지 적었다. 팔레트에 넣어도 사람 눈에 오르는 경로가 하나 더 생길 뿐 새로 막는 사고가 없다. (3) `OPACITY` 는 plan 1 Step 4 의 3번이 범위(0..1)와 11값 중 2값만 고정한다. 나머지 9값의 변경을 강제로 사람 눈에 올리는 장치는 없다. 이 구멍은 받아들이고 §6-26 에 적는다. 넣으면 push 마다 스냅샷이 4장에서 6장이 되어 Free 한도 소모가 1.5배다 (§6-8). 그래서 §1 의 게이트 범위를 네 export 로 좁혔다 | 요청이 오면 같은 파일에 story 추가. 그때 §1 의 범위 문장을 같이 고친다 |
| 화면(라우트) stories | `src/app/` 은 expo-router 라우트라 라우터 없이 격리해 그리기 어렵다. 리뷰 대상은 공유 컴포넌트다 | 필요해지면 별 작업 |
| Figma 연결 (Storybook Connect 플러그인) | **재판정.** 핸드북 4단계는 "링크로 공유" 이고 Figma 연결은 흐름에 없다. 디자이너에게 Figma 편집자 권한과 Chromatic collaborator 자격이 필요하고 링크를 손으로 잇는 유지 비용이 생긴다 [^figma] | 디자이너가 요청하면 별 작업 |
| Storybook addon (docs/MDX, a11y, vitest addon, `@chromatic-com/storybook`) | **재판정.** 핸드북 4단계에 addon 이 없다 [^hb-auto]. `@chromatic-com/storybook` 은 로컬 Storybook 에서 Chromatic 을 돌리는 addon 이라 2단계를 CI 로 하는 이 계획에 필요 없다. docs addon 의 색상표 문서 블록은 새 의존성이고, 팔레트는 CSF story 여야 Chromatic 이 story 마다 스냅샷을 찍는다 (과금 공식의 `Tests` 가 story 다 [^billing]) | 없음 |
| Storybook 툴바의 뷰포트 프리셋 | **재판정.** 핸드북 흐름에 없다. 이 PR 에 mode 도 없다 | §6-1 |
| TurboSnap (`onlyChanged`), 경로 필터 | **재판정.** 핸드북 흐름에 없다. TurboSnap 은 스냅샷 수를 줄이는 최적화이고 게이트의 의미를 바꾸지 않는다. 지금 push 1번에 스냅샷 4장이다. **경로 필터는 required check 와 함께 쓰면 해롭다.** Chromatic 이 돌지 않은 커밋은 `UI Tests` 가 "Pending indefinitely" 다 [^mandatory]. docs 만 바꾼 PR 이 영원히 머지되지 않는다 | TurboSnap 은 §6-9. 경로 필터는 쓰지 않는다 |
| `chromatic` CLI devDependency | **재판정. 핸드북에서 의도적으로 벗어난다.** 핸드북은 `yarn add -D chromatic` 후 로컬에서 `--project-token` 으로 돈다. 그건 핸드북이 "이 튜토리얼에서는 설정하지 않지만" 이라며 CI 를 생략한 경로다 [^hb-auto]. 이 계획은 2단계 "PR 마다" 를 CI 로 하고 `chromaui/action` 이 CLI 를 직접 돈다 [^gha]. devDependency 로 넣으면 CI 가 쓰지 않는 의존성이 되어 금지에 걸린다. 로컬 게시에는 개발자 기기마다 project token 이 필요해진다 | 없음 |
| CI 에서 `check-gate.sh` 돌리기 | **재판정.** 핸드북 4단계에 typecheck, lint, 단위 테스트가 없다. Chromatic 문서가 머지 게이트를 "The UI Tests check is the merge gate, not the CI job" 으로 둔다 [^mandatory]. 이 작업의 CI 는 시각적 테스트 하나다. check-gate 를 CI 에 올리면 그 잡을 required 로 걸지가 별개의 결정이 된다. 대가는 §6-22 | 별 작업. 원하면 사람이 이슈를 만든다 |

## 3. 영향 범위

| 파일 | 변경 | 따를 references |
| --- | --- | --- |
| `package.json` | devDependencies `storybook`, `@storybook/react-native-web-vite` 2개. scripts `storybook`, `build-storybook` 2줄 | 기존 scripts 블록 |
| `package-lock.json` | `npm install` 결과 | |
| `.storybook/main.ts` | 신규 | Step 2 |
| `src/shared/constants/flattenColors.ts` | 신규. 순수 함수 1개. `react-native` 를 import 하지 않는다 | Step 3. `src/shared/layout/breakpoint.ts` (RN 없는 순수 모듈) |
| `src/shared/constants/flattenColors.test.ts` | 신규. 테스트 1개 | `src/shared/layout/breakpoint.test.ts` |
| `src/shared/constants/theme.stories.tsx` | 신규. Foundations story 4개 | Step 4 |
| `tsconfig.json` | `include` 에 `".storybook/**/*.ts"` 추가 | 같은 파일의 `.expo/types/**/*.ts` |
| `.gitignore` | `storybook-static/`, `*storybook.log` 2줄 | |
| `.github/workflows/chromatic.yml` | 신규. 이 레포의 첫 워크플로다 (`.github/` 없음, 실측) | Step 6 |
| `.claude/skills/quizly-app-conventions/SKILL.md` | 101행 `export default` 규칙에 Storybook 파일 예외, 스택 표 1행, "태블릿에서 폰으로" 표 1행 (mode 규칙), 작업 흐름 표 1행 | Step 7 |
| `CLAUDE.md` | 스택 표 1행, 명령 블록 2줄, 작업 흐름 표 1행 | Step 7 |
| `README.md` | "디자이너 리뷰" 절 신규. 빠짐 목록은 `theme.ts` 머리의 SHA 에 묶는다 | Step 7, §5 자동 10 |

건드리지 않는 것: `app.json`, `src/app/**`, `src/shared/layout/**`, `src/shared/constants/theme.ts` (생성물. 읽기만 한다), `.claude/scripts/check-gate.sh`. **네이티브 리빌드가 필요 없다** (Step 1).

레포 밖에서 사람이 하는 설정: Chromatic 프로젝트와 GitHub 연결 (Step 0-4), GitHub secret (Step 0-4), `dev` 의 classic branch protection rule (Step 9). builder 와 하네스는 이 셋을 하지 않는다.

## 4. 단계

### Step 0-1: 경로 선택 (판단, 코드 변경 없음)

세 경로를 공식 문서로 대조했다.

| 기준 | (a) 기기 Storybook + Chromatic RN | (b) RN Web Storybook + Chromatic | (c) 둘 다 |
| --- | --- | --- | --- |
| 렌더링 위치 | Chromatic 호스팅 iOS 시뮬레이터(macOS)와 Android 에뮬레이터(Linux) [^rn] | Chromatic 의 Chrome [^pricing] | 둘 다 |
| 태블릿과 폰 두 폭 | **modes API 의 viewport 미지원** [^rn]. 기기 화면 폭이 고정이라 story 를 나눠도 `useBreakpoint` 결과가 안 바뀐다. 태블릿 기기를 고를 수 있는지 문서에 없다 | `parameters.chromatic.modes` 에 폭 두 개. mode 마다 스냅샷과 베이스라인이 따로다 [^vp] | (b) 쪽으로만 된다 |
| 디자이너가 여는 것 (핸드북 4단계) | 빌드 페이지의 스냅샷 이미지와 UI Review [^rn]. 게시 Storybook 언급 없음 | 브랜치 permalink 의 **살아 있는 Storybook** + UI Review [^perm] | 둘 다 |
| Figma 연결 | 문서에 없음 [^figma] | Chromatic 에 게시된 story URL 로 가능 [^figma] | (b) 쪽만 |
| 새 네이티브 의존성 | `@react-native-async-storage/async-storage`, `react-native-svg`, `@gorhom/bottom-sheet` [^rnsetup] | **없다** | (a) 와 같다 |
| 앱 코드 변경 | `_layout.tsx` 분기 또는 `/storybook` 라우트, `metro.config.js`, 프로덕션 제외 가드 [^rnrouter] | **없다** | (a) 와 같다 |
| CI | iOS 빌드에 `macos-latest`, Android 빌드, 업로드 3잡 [^rnci] | `ubuntu-latest` 1잡 [^gha] | 4잡 |
| 요금 근거 | RN 스냅샷 과금 방식이 문서에 없다 [^billing] | `Tests x Builds x Browsers x Modes` [^billing] | |
| 충실도 | 실제 기기 렌더링 | 웹 근사. Step 7 의 차이표 | 둘 다 |

**결론: (b).** 결정적인 이유는 둘이다. (1) **이 레포의 리뷰 핵심인 "태블릿과 폰을 나란히" 를 문서로 보장하는 경로가 (b) 뿐이다.** (a) 는 Chromatic 문서가 viewport mode 미지원을 명시하고 대안으로 "변형마다 story 를 따로 쓰라" 고 하는데, 그건 다크 모드 같은 prop 변형에는 통해도 **기기 화면 폭은 story 로 못 바꾼다.** (2) 핸드북 4단계의 "배포된 Storybook 링크" 가 (a) 문서에 없다. 게다가 (a) 는 네이티브 의존성 3개와 앱 코드 변경과 리빌드가 따라온다.

(c) 를 지금 고르지 않아도 손해가 없다. Storybook 문서가 두 방식을 같은 stories 로 함께 쓰는 "Both" 설치를 권한다 [^rnw]. 즉 (b) 로 쓴 CSF stories 는 나중에 (a) 를 붙일 때 그대로 재사용된다. (a) 를 붙일 조건은 §6-7 이다.

### Step 0-2: 언제 넣는가 (사람 결정 2026-11-27)

| 안 | 내용 | 판정 |
| --- | --- | --- |
| A. 지금 인프라만 | stories 0개로 Storybook, Chromatic, 워크플로를 넣는다 | **기각 유지.** CLAUDE.md 금지 "설치만 하고 안 쓰는 의존성" 에 걸린다. 첫 빌드에 볼 것이 없다 |
| B. 지금 인프라 + 검증용 더미 story 1개 | 예제 컴포넌트를 만들어 붙인다 | **기각 유지.** 첫 컴포넌트가 오면 지워질 "for later" 코드다 |
| C. 첫 공유 UI 컴포넌트와 같은 PR (2회차 채택안) | 그 컴포넌트의 story 가 첫 소비자가 된다 | **사람 결정으로 대체.** 첫 컴포넌트는 디자이너 시안과 토큰을 기다린다. 그동안 시각적 테스트 흐름이 시작되지 않고, 토큰 갱신 PR 이 사람 눈을 거치지 않는다 |
| **D. 지금, 토큰 팔레트 스토리로** | Foundations story 4개가 `theme.ts` 를 읽어 그린다 | **채택 (사람 결정).** |

D 는 B 와 다르다. 팔레트는 지워질 코드가 아니다. 컴포넌트가 생긴 뒤에도 남고 쓰임이 따로 있다. (1) 디자이너가 앱이 실제로 가진 토큰을 피그마와 비교한다. (2) `theme.ts` 가 바뀌는 PR 에서 팔레트가 그리는 네 export (`COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`) 의 값이 바뀌면 값 글자가 바뀌어 팔레트 스냅샷이 바뀌고 `UI Tests` 가 pending 이 된다. `OPACITY`, `LAYOUT` 의 변경은 여기 걸리지 않는다 (§2). 그래서 Storybook devDependency 의 실제 소비자로 성립하고 "설치만 하고 안 쓰는 의존성" 에 걸리지 않는다.

이 결정으로 2회차의 두 리스크가 닫혔다. "stories 0개 빌드" (2회차 §6-12) 는 첫 빌드부터 story 4개라 생기지 않는다. "금지 사항과 지금 넣기의 충돌" (2회차 §6-13) 은 위 이유로 풀렸다.

### Step 0-3: 목적과 머지 게이트 (판단, 코드 변경 없음)

핸드북 4단계를 이 레포의 부품에 대응시킨다.

| 핸드북 단계 | 이 레포에서 | 근거 |
| --- | --- | --- |
| 1. 스토리로 상태를 고립한다 | Step 4 의 Foundations story 4개. 컴포넌트 stories 는 컴포넌트와 함께 온다 | [^hb-explorer] |
| 2. PR 마다 스냅샷을 baseline 과 비교한다 | Step 6 의 `chromatic.yml` 이 push 마다 돈다. Chromatic 이 PR 에 `UI Tests` 와 `Storybook Publish` 상태 체크를 붙인다. 레포에 연결된 프로젝트는 기본으로 붙는다 | [^ci] |
| 3. 의도한 변경은 Accept, 아니면 고친다 | Chromatic 빌드 화면에서 PR 작성자가 Accept 한다. baseline 은 Accept 로만 갱신된다 | [^hb-auto] [^baselines] |
| 4. 배포된 Storybook 링크로 공유한다 | PR 의 `Storybook Publish` 체크 링크, 그리고 `https://dev--<appid>.chromatic.com` (Step 7 README) | [^perm] |

핸드북은 2단계를 로컬 CLI 로 보여 주고 CI 설정과 머지 차단을 다루지 않는다 [^hb-auto]. 그래서 "PR 상태 체크로 보인다" 와 "머지를 막는다" 의 근거는 Chromatic 문서다. 핸드북 자동화 장이 머지 시점을 "버그가 수정되고 기준선이 최신 상태가 되면, 코드를 target 브랜치로 다시 merge할 수 있습니다" 로 적는다 [^hb-auto]. 이 문장을 규칙으로 만드는 장치가 required check 다.

**어느 체크를 required 로 거는가**

| 체크 | required | 근거 |
| --- | --- | --- |
| `UI Tests` | **건다** | Chromatic 문서 "The UI Tests check is the merge gate, not the CI job" [^mandatory]. 시각 변경이 있으면 "Pending: blocks merging until someone reviews and approves the changes" 다 [^mandatory]. 걸지 않으면 Accept 하지 않은 변경이 그대로 머지된다. baseline 은 Accept 로만 갱신되므로 [^baselines] 그 변경이 **다음 PR 의 빌드에 다시 뜬다.** 다음 PR 작성자가 자기가 만들지 않은 diff 를 받게 되어 3단계의 "의도했나" 판정이 깨진다 |
| `UI Review` | 걸지 않는다 | 걸면 모든 PR 이 디자이너 승인을 기다린다. 핸드북 4단계는 "공유" 이지 게이트가 아니다. UI Review 는 켜 두되 디자이너의 댓글 창구로만 쓴다 |
| `Storybook Publish` | 걸지 않는다 | 게시는 테스트가 아니다. 4단계 링크가 안 생기면 사람이 바로 안다 |
| GitHub Actions 의 `chromatic` 잡 | 걸지 않는다 | `exitZeroOnChanges` 기본값에서 잡은 변경이 있어도 초록이다 [^gha]. Chromatic 문서가 이 경우 "require the UI Tests check in your Git provider rather than relying on the CI job" 이라 적는다 [^mandatory] |
| `check-gate.sh` | 해당 없음 | CI 에 없다 (§2) |

**언제부터 거는가: 이 PR 에서, 첫 Chromatic 빌드가 `UI Tests` 를 올린 직후, Accept 하거나 머지하기 전.** 순서는 Step 9 다. 근거는 셋이다.

1. 지금이 가장 싸다. story 4개, mode 1개라 push 1번에 스냅샷 4장이다. 나중에 걸수록 그 사이에 머지된 미승인 변경이 쌓인다
2. **첫 빌드의 결과는 두 갈래 중 하나다 (4회차, 비평 C1).** Chromatic CLI 저장소의 검증 문서는 새 프로젝트가 onboarding 모드이고 "Build 1 is `auto-accepted`" 라고 적는다 [^cli-onboard]. 공식 문서는 프로젝트 첫 빌드를 다루지 않고, 새 story 는 Accept 해야 baseline 이 된다고만 적는다 [^baselines]. 그래서 둘 다 대비한다. **갈래 P (pending)** 면 story 4개가 새 스냅샷이라 `UI Tests` 가 pending 이다. 그 상태에서 보호를 걸어 "pending 이면 머지가 막힌다" 를 더미 변경 없이 이 PR 에서 확인한다. **갈래 A (auto-accept)** 면 `UI Tests` 가 처음부터 성공이다. 이 PR 에서는 막힘을 볼 수 없으므로 Step 9 의 6 에서 다른 경로로 확인한다. 갈래 판정은 §5 Chromatic 2 의 표다
3. GitHub 의 required check 검색은 "recently" 상태를 올린 체크만 고를 수 있다고 적는다 [^gh-bp]. 첫 빌드 전에는 고를 체크가 없다. 그래서 "PR 을 열기 전" 이 아니라 "첫 빌드 직후" 다. 갈래 A 에서는 성공 상태가 이미 올라와 있어 고르기가 오히려 쉽다

**규칙 종류: classic branch protection rule. ruleset 을 쓰지 않는다 (4회차, 비평 M1).**

| 기준 | classic rule | ruleset |
| --- | --- | --- |
| admin 우회 | 기본값에서 보호 규칙이 admin 에게 적용되지 않는다 [^gh-bp]. 설정할 것이 없다 | bypass 는 명시적으로 준 역할만 한다. admin 을 기본으로 면제한다는 문장이 문서에 없다 [^gh-rs]. bypass list 에 Repository admin 역할을 넣어야 classic 과 같아진다 |
| Chromatic 문서의 절차 | 이쪽이다 (문서 표기는 "Add rule", 지금 GitHub 버튼은 "Add classic branch protection rule") [^mandatory] [^gh-bpm] | 언급 없음 |
| 둘을 같이 만들면 | 모든 규칙이 함께 적용되고 겹치면 더 엄격한 쪽이 이긴다 [^gh-rs]. 그래서 하나만 만든다 | |

ruleset 을 bypass list 없이 만들면 §6-8 (스냅샷 한도 소진), §6-15 (fork PR), §6-21 (워크플로 없는 브랜치) 에서 `UI Tests` 가 pending 인 채로 남을 때 **탈출구가 없다.** 한도가 차면 결제 주기 리셋까지 어떤 PR 도 머지되지 않는다. classic rule 은 설정 없이 탈출구가 남는다. 나중에 ruleset 으로 옮기려면 bypass list 에 Repository admin 을 넣는 것을 같은 변경에 묶는다.

**거는 범위:** `dev` 하나다. PR base 가 `dev` 다 (CLAUDE.md). 다른 보호 옵션은 켜지 않는다. 특히 "Do not allow bypassing the above settings" 를 켜지 않는다 [^gh-bpm]. 켜면 admin 도 막혀 위 탈출구가 사라진다.

**전원 admin 이라는 사실 (4회차, 비평 M1).** `Quizly-Team/quizly_app` 협업자는 `fnzl54`, `yura0302`, `yeonchaepark` 셋이고 셋 다 `admin` 이다 (`gh api repos/Quizly-Team/quizly_app/collaborators?affiliation=all`, 2026-11-27). 그래서 이 게이트는 "기본은 막히고, 누구든 머지 박스의 bypass 체크박스를 켜면 풀린다" 다. 체크박스를 켜는 행동이 필요하므로 **모르고 지나가지는 않지만, 알고 넘기는 것은 막지 않는다** (§1). 이를 받아들일지, 일부 계정을 `write` 로 내릴지는 사람이 정한다 (Step 0-4 표). `write` 로 내린 계정은 bypass 를 못 하고, 한도 소진 때 admin 에게 머지를 부탁한다. 탈출구가 남으려면 admin 이 한 명 이상 남아야 한다.

### Step 0-4: 착수 조건

아래가 모두 참일 때 Step 1 을 시작한다. 하나라도 거짓이면 builder 는 멈추고 보고한다.

1. `docs/ai/plan/1.md` (토큰 변환)가 `dev` 에 머지돼 `src/shared/constants/theme.ts` 가 있다. 그 파일이 **plan 1 5회차 Step 3** (`docs/ai/plan/1.md` 153~170행) 의 모양으로 `COLORS` (중첩, 리프는 색 문자열), `TYPOGRAPHY` (`TYPOGRAPHY[크기][굵기]` 가 `TextStyle` 객체), `SPACING`, `RADIUS` (평평한 숫자) 를 export 하고, 머리 3줄 안에 40자 SHA 가 있다. plan 1 5회차는 2026-11-27 현재 미승인이다 (`approved: false`, 비평 `docs/ai/plan-critique/1.md` 는 rounds 3 revise). 승인 과정에서 Step 3 이 또 바뀔 수 있다. **머지된 모양이 이와 다르면 builder 는 Step 4 를 고쳐 맞추지 않고 멈춘다** (§6-2)
2. **사람이 Chromatic 설정을 끝냈다.** 코드가 없는 설정이고 레포 admin 권한이 필요하다
   - Chromatic 에 GitHub 로 가입하고 프로젝트를 만든다. **프로젝트 종류로 "React Native" 를 고르지 않는다.** 그건 (a) 용 프로젝트다 [^rn]. 일반 Storybook 프로젝트로 만들고 `Quizly-Team/quizly_app` 을 연결한다. 연결해야 PR 상태 체크가 붙는다 [^ci]
   - project token 을 GitHub `Quizly-Team/quizly_app` Settings > Secrets and variables > Actions 에 `CHROMATIC_PROJECT_TOKEN` 으로 넣는다. **파일, PR 본문, 이슈, 채팅 어디에도 붙여넣지 않는다.** public 레포다. 노출되면 Manage > Configure 에서 재발급한다 [^gha]
   - Chromatic GitHub app 을 설치하고 UI Review 를 켠다 [^review]. UI Review 는 required 로 걸지 않는다 (Step 0-3)
   - Storybook 공개 범위를 정한다. 공개면 링크만 있으면 누구나 게시 Storybook 을 본다 [^perm]. 레포가 public 이라 공개로 새는 정보는 없다
   - 디자이너를 collaborator 로 초대한다
   - **프로젝트의 appid 를 아래 칸에 적는다** (비평 m3). permalink 의 `<appid>` 다 [^perm]. 비밀이 아니다. project token 과 다른 값이다. builder 는 Chromatic 에 접근할 수 없으므로 이 칸이 비어 있으면 README 를 쓰지 않고 멈춘다

   | 항목 | 값 | 누가 쓰나 |
   | --- | --- | --- |
   | Chromatic appid | `6b09346198120c6b2bc461a5` (사람 기입 2026-11-27) | builder (README). 비면 builder 가 멈춘다 |
   | 갈래 A 일 때 "pending 이면 막힌다" 확인 방법 | **(가) 임시 PR 로 이 PR 머지 전에 확인** (사람 결정 2026-11-27) | 사람 (Step 9 의 6). builder 는 쓰지 않는다 |
   | 협업자 권한 | **전원 admin 유지** (사람 결정 2026-11-27) | 사람 (Step 0-3, §5 Chromatic 4). builder 는 쓰지 않는다 |

   (가) 는 push 1번만큼 스냅샷 4장이 더 들고 임시 브랜치와 PR 을 만들고 지우는 사람 작업이 붙는다. 대신 이 PR 이 머지되기 전에 게이트와 bypass 가 실제로 되는지 안다. (나) 는 비용이 없지만 그 사이 게이트가 확인되지 않은 채 돌고, Step 8 이슈 4 가 남는다.

3. **README 의 빠짐 목록이 지금 SHA 에서 참이다.** Step 7 README 3번은 `theme.ts` 머리의 SHA 기준으로 "피그마에만 있는 4개가 `tokens.json` 에 없다" 를 적는다. builder 는 Step 7 전에 §5 자동 10 을 돌린다. 둘째 줄이 `false false` 가 아니면 디자이너가 재Push 한 토큰이 이미 그 SHA 에 들어온 것이다. README 3번이 거짓이 되므로 멈추고 보고한다

2회차의 "첫 컴포넌트 계획 승인" 과 "피그마 프레임 폭 표" 조건은 뺐다. 앞의 것은 사람 결정 (a), 뒤의 것은 Step 0-5 의 귀결이다.

### Step 0-5: mode 폭 (판단, 코드 변경 없음)

2회차는 tablet, phone 두 mode 의 폭을 피그마 태블릿, 폰 프레임에서 읽게 했다. 팔레트에는 화면 프레임이 없다.

| 후보 | 판정 |
| --- | --- |
| 2회차 안 유지. 피그마 프레임 폭으로 두 mode | **기각.** 읽을 프레임이 없다. 팔레트의 피그마 짝은 프레임이 아니라 Variables 와 Styles 다. 다른 화면 프레임에서 폭을 빌려 오면 그 숫자가 이 PR 의 어떤 스냅샷과도 대응하지 않는다 |
| `TABLET_MIN_WIDTH` 기반이나 흔한 기기 폭 | **기각.** `TABLET_MIN_WIDTH` 768 은 잠정값이고 (`breakpoint.ts:3` 의 shortcut 주석) 경계에 붙이면 여유가 0 이다 (2회차 M2). 기기 폭은 실측하지 않은 숫자다 |
| **mode 를 두지 않는다** | **채택.** 팔레트는 `useBreakpoint` 를 쓰지 않아 폭에 반응하지 않는다. 두 폭으로 찍으면 줄바꿈만 다른 스냅샷이 2배가 되고 승인도 mode 마다 따로다 [^vp]. 얻는 리뷰가 없다. mode 가 없으면 Chromatic 기본 viewport "width 1200px and height 900px" 로 찍는다 [^vp]. **레포의 코드와 설정에 폭 숫자를 하나도 쓰지 않는다.** 정본 문서에는 Chromatic 기본값 1200 을 사실로 적는다 (Step 7) |

귀결: `.storybook/preview.ts` 가 필요 없다 (설정할 parameters 가 없다). `TABLET_PREVIEW_WIDTH`, `PHONE_PREVIEW_WIDTH` 상수와 그 테스트도 이 PR 에 없다. `src/shared/layout/**` 을 건드리지 않는다.

mode 는 `useBreakpoint` 로 배치를 가르는 첫 컴포넌트와 함께 들어온다. 그때 폭을 무엇으로 정하고 무엇을 재면 확정되는지는 §6-1 에 적었다. 이 계획에 사람이 채울 폭 칸은 없다.

이 결정의 귀결은 이 PR 뒤로 오래 남는다. 폭 1200 은 `TABLET_MIN_WIDTH` 768 보다 넓어서 (`src/shared/layout/breakpoint.ts:7` 의 `width >= TABLET_MIN_WIDTH`) 모든 스냅샷에서 `useBreakpoint()` 가 `'tablet'` 이다. **phone 배치는 한 번도 찍히지 않고 `UI Tests` 는 초록이다.** `layout-auditor` 가 story 이름의 `Tablet`, `Phone` 을 잡으므로 (`.claude/agents/layout-auditor.md:42`) phone 배치를 스냅샷으로 남길 길은 mode 하나다. 그래서 Step 7 이 이 사실과 mode 도입 조건을 정본에 옮긴다 (비평 M2). `planner` 의 "반드시 읽는 것" 에는 자기 id 의 계획만 있고 다른 계획 문서는 없다 (`.claude/agents/planner.md:17-24`). 1번이 `quizly-app-conventions/SKILL.md` 다.

### Step 1: devDependency 2개 추가와 New Architecture 판단

```bash
npm install --save-dev storybook@<V> @storybook/react-native-web-vite@<V>
```

`<V>` 는 설치 시점의 두 패키지 공통 latest 다. 2026-11-27 registry 조회로는 둘 다 `10.6.9` 다. 두 패키지는 같은 버전으로 맞춘다 (framework 의 peer 가 `storybook ^10.6.9`).

**peer 대조 (npm registry, `@storybook/react-native-web-vite@10.6.9`):**

| peer | 요구 | 이 레포 | 판정 |
| --- | --- | --- | --- |
| `react` | `^19.0.0` 포함 | `19.3.0` | 충족 |
| `react-dom` | `^19.0.0` 포함 | `19.3.0` | 충족 |
| `react-native` | `>=0.74.5` | `0.88.1` | 충족 |
| `react-native-web` | `^0.21.0` 포함 | `~0.21.4` | 충족 |
| `vite` | `^8.0.0` 포함 | `8.3.8` (vitest 의 peer 로 이미 설치, lockfile `"peer": true`) | 충족 |
| `storybook` | `^10.6.9` | 이번에 추가 | 충족 |

하위 `@storybook/react`, `@storybook/react-vite`, `@storybook/builder-vite` (`10.6.9`) 의 peer 는 react `^19`, vite `^8`, typescript `>= 4.9.x` 로 충족한다. **하나는 충족하지 않는다.** framework 의 의존성 `vite-plugin-rnw@0.0.11` 의 peer 가 `typescript: "^5"` 이고 이 레포는 `~6.0.3` 이다 (npm registry, 2026-11-27). 비평 단계의 lockfile dry-run 에서 `npm install` 은 exit 0 이었고, `typescript@5.9.3` 이 `@storybook/react-native-web-vite/node_modules/` 와 `vite-tsconfig-paths/node_modules/` 에 따로 들어갔다. 루트 `tsc` 는 `6.0.3` 그대로라 게이트의 typecheck 는 영향이 없다고 본다. 확정은 Step 1 검증과 §5 자동 1 이다.

**Expo 는 peer 에 없고 framework 문서도 Expo 를 언급하지 않는다** [^rnw]. 기본 상태(`modulesToTranspile` 미지정)에서 node_modules 트랜스파일 범위를 정하는 것은 `vite-plugin-rnw` 의 `defaultExcludeRE` 다 (`dist/index.mjs:239`, `/\/node_modules\/(?!react-native|@react-native|expo|@expo)/`). preset 의 `defaultModulesToTranspile` (`code/frameworks/react-native-web-vite/src/preset.ts:10`, v10.6.9) 은 사용자가 `modulesToTranspile` 을 줄 때만 쓰인다 (같은 파일 15에서 20행). 접두어가 같아서 `expo`, `@expo` 모듈이 트랜스파일된다는 결론은 같다. 같은 플러그인이 `EXPO_OS` 와 `process.env.EXPO_OS` 를 `"web"` 으로 define 한다 (`dist/index.mjs:317-318`). 이 PR 의 story 는 `react-native` 와 `theme.ts` 만 import 하고 `expo-*` 를 import 하지 않는다. Expo 모듈이 Vite 에서 도는지는 첫 컴포넌트의 실측 항목이다 (§6-3).

넣지 않는 것:

- `vite`: 이미 vitest 의 peer 로 `8.3.8` 이 설치돼 있고 framework 범위 `^8` 을 충족한다. 같은 패키지를 두 번 선언하지 않는다
- `chromatic`: §2
- `npx storybook init` / `npm create storybook@latest` 를 쓰지 않는다. 이 계획이 통제하지 않는 파일과 addon 을 만든다. 설정 파일은 Step 2 의 하나만 손으로 만든다

**New Architecture 확인 결과: 해당 없음.** 두 패키지는 브라우저에서만 도는 devDependency 이고 네이티브 코드가 없으며, 앱 코드가 import 하지 않아 Metro 번들에 들어가지 않는다 (§5 자동 6 이 확인). `app.json` 을 바꾸지 않으므로 **네이티브 리빌드가 필요 없다.**

참고로 기각한 (a) 의 네이티브 의존성은 React Native Directory API 기준 `react-native-svg`, `@react-native-async-storage/async-storage`, `@gorhom/bottom-sheet` 모두 `newArchitecture: true` 였다 (2026-11-27 조회). (a) 를 기각한 이유는 New Architecture 가 아니라 Step 0-1 의 두 이유다.

`package.json` scripts 에 두 줄을 넣는다. 포트 숫자를 쓰지 않는다 (Storybook 기본값을 쓴다).

```json
"storybook": "storybook dev",
"build-storybook": "storybook build"
```

`build-storybook` 이름은 바꾸지 않는다. `chromaui/action` 이 이 스크립트 이름으로 빌드를 돈다 (기본 `buildScriptName`).

`npm install` 이 `ERESOLVE` 로 멈추면 builder 는 멈추고 보고한다. `--legacy-peer-deps` 나 `--force` 로 넘기지 않는다.

검증: `npm ls vite` 가 `8.x` 한 벌만 보여 준다 (`deduped`). `npm ls react-native-web` 가 `0.21.x` 다. `npm ls typescript` 는 **두 버전을 보여 주는 것이 정상이다.** 루트 `typescript@6.0.x` 하나와, `vite-plugin-rnw` peer 때문에 중첩 설치된 `5.x` 다. `npx tsc --version` 이 `6.0.x` 이면 통과다.

### Step 2: `.storybook/main.ts`

```ts
import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  // src/app 은 expo-router 가 파일마다 라우트를 만든다. stories 를 거기 두지 않는다
  stories: ["../src/shared/**/*.stories.tsx"],
  framework: "@storybook/react-native-web-vite",
};

export default config;
```

- glob 은 `src/shared/` 하나만 둔다. Step 4 의 `src/shared/constants/theme.stories.tsx` 가 여기 걸린다. `src/features/` 는 아직 없다. 첫 feature story 가 생길 때 그 glob 을 추가한다 (디렉터리는 코드가 들어갈 때 만든다)
- `src/app/` 을 glob 에 넣지 않는다. 거기 둔 `*.stories.tsx` 는 expo-router 가 라우트로 만든다
- `vite.config.ts` 를 만들지 않는다. framework 가 자체 Vite 설정을 쓰고, 루트에 `vite.config.ts` 가 생기면 vitest 가 그걸 집어 순수 함수 테스트에 RN Web 플러그인이 붙는다
- `@/*` 경로 별칭은 framework 가 `vite-tsconfig-paths` 로 `tsconfig.json` 을 읽어 푼다 (preset 소스의 `tsconfigPaths()`). 별도 설정이 없다
- `.storybook/preview.ts` 는 만들지 않는다 (Step 0-5)

검증: Step 4 이후 `npm run build-storybook` 이 exit 0.

### Step 3: `flattenColors` 와 그 테스트

`COLORS` 는 2단과 3단이 섞인 중첩 객체다 (plan 1 Step 3, `COLORS.primary.normal`, `COLORS.interaction.primary.pressed`). 팔레트가 리프를 하나도 빠뜨리지 않고 이름과 함께 그리려면 트리를 `[경로, 값]` 목록으로 펴야 한다. 재귀와 분기가 있는 순수 로직이라 story 안에 두지 않고 RN 을 import 하지 않는 모듈로 뺀다 (CLAUDE.md "순수 로직은 `react-native` 를 import 하지 않는 모듈에 둔다").

`src/shared/constants/flattenColors.ts`:

```ts
interface ColorTree {
  readonly [key: string]: string | ColorTree;
}

// 팔레트 이름을 피그마 표기(glass/tint)와 같은 / 구분자로 잇는다
export function flattenColors(tree: ColorTree, prefix = ""): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}/${key}` : key;
    return typeof value === "string" ? [[path, value] as [string, string]] : flattenColors(value, path);
  });
}
```

- 위 시그니처에 `as const` 중첩 객체를 넘기면 이 레포의 `tsc 6.0.3` (`strict`) 에서 통과한다 (planner 가 /tmp 에서 같은 모양의 객체로 실측, 2026-11-27). 구현은 builder 가 정해도 되지만 시그니처와 `/` 구분자는 이대로 둔다
- 위치를 `src/shared/constants/` 로 하는 이유: 이 함수가 펴는 대상(`theme.ts`)과 유일한 소비자(`theme.stories.tsx`)가 같은 폴더에 있다. 앱 런타임은 import 하지 않는다

`src/shared/constants/flattenColors.test.ts` 에 테스트 1개를 둔다. 입력은 테스트 안의 리터럴이다. `theme.ts` 를 import 하지 않는다 (plan 1 의 생성물 테스트와 역할이 겹치지 않게 하고, plan 1 개정으로 토큰 값이 바뀌어도 이 테스트가 흔들리지 않게 한다).

```ts
it("중첩 경로를 / 로 잇고 리프를 선언 순서대로 모두 낸다", () => {
  expect(
    flattenColors({
      white: "#000001",
      primary: { normal: "#000002" },
      interaction: { primary: { pressed: "#00000324" } },
      shadow: { "key-strong": "#000004" },
    }),
  ).toEqual([
    ["white", "#000001"],
    ["primary/normal", "#000002"],
    ["interaction/primary/pressed", "#00000324"],
    ["shadow/key-strong", "#000004"],
  ]);
});
```

이 테스트가 막는 사고: 펴기가 한 단을 덜 내려가거나 리프를 버리면 팔레트에서 색이 **조용히 빠진다.** 디자이너는 빠진 색을 "피그마에만 있는 4개" 처럼 정상 부재로 읽을 수 있다. typecheck 도 빌드도 이걸 못 잡는다. 입력이 1단, 2단, 3단 리프와 하이픈 키를 다 담아 두 분기(문자열, 객체)를 모두 지난다.

검증: `npx vitest run src/shared/constants/flattenColors.test.ts` 가 1개 통과. 음성 대조로 구분자 `/` 를 임시로 `.` 으로 바꾸면 FAIL 한다. 되돌린다.

### Step 4: Foundations story 4개

`src/shared/constants/theme.stories.tsx`. 앱 화면이 아니라 피그마와 맞대 보는 비교 도구라 꾸밈을 넣지 않는다.

| export | 그리는 것 | 데이터 |
| --- | --- | --- |
| `Colors` | 리프마다 사각 견본 1개와 그 옆 글자 `경로 값` (`primary/normal #30a10e` 꼴) | `flattenColors(COLORS)` |
| `Typography` | variant 마다 글자 `크기/굵기 fontSize/lineHeight/letterSpacing/fontWeight` (`text-1rg/regular 16/24/-0.06/400` 꼴) 를 그 variant 스타일로 쓴 한 줄 | `TYPOGRAPHY` 2단을 `Object.entries` 두 번 |
| `Spacing` | 토큰마다 글자 `이름 값` (`16 16` 꼴) 과, 한 변이 그 값인 정사각형 | `SPACING` |
| `Radius` | 토큰마다 글자 `이름 값` (`xl 24` 꼴) 과, 한 변이 `SPACING["80"]` 이고 그 값을 `borderRadius` 로 준 정사각형 | `RADIUS`, `SPACING["80"]` |

**네 story 모두 값을 글자로 쓴다 (4회차, 비평 M3).** 값이 바뀌면 글자가 바뀌므로 도형 모양과 상관없이 스냅샷 diff 가 난다. 글자가 없으면 두 사고가 생긴다. (1) Radius 는 CSS 가 이웃한 반지름의 합이 변보다 크면 모든 반지름을 같은 비율로 줄이므로 (CSS Backgrounds 3 의 Overlapping Curves, 비평 M3 의 2), 변 `s` 에서 `r >= s/2` 인 토큰은 전부 같은 원이다. 겹치는 범위 안에서 값이 바뀌면 픽셀 diff 가 0 이다. (2) Typography 의 `letterSpacing -0.06` 같은 작은 변경이 diff 를 내는지는 Chromatic 의 anti-aliasing 무시 규칙 때문에 확신할 수 없다. 글자로 쓰면 숫자 글리프가 바뀐다 (§6-24). `Spacing` 은 지금 이름과 값이 같지만 (plan 1 Step 3) 디자이너가 `spacing.16` 의 값만 바꾸면 이름은 남고 값이 바뀌므로 둘 다 쓴다.

**Radius 의 변을 `SPACING["80"]` 으로 고정한다.** `d9f0213` 의 값(`RADIUS` 0, 4, 8, 12, 16, 24, 32, 9999, `SPACING` 최대 80, plan 1 Step 3) 에서 8개가 모두 다른 모양으로 그려지는 변은 `SPACING["80"]` 하나다. 48 이면 `xl`, `2xl`, `full` 이 같은 원이고 64 면 `2xl` 과 `full` 이 같다 (비평 M3 의 2). diff 는 글자가 잡으므로 이 고정은 디자이너가 모양을 피그마와 맞대 보기 위한 것이다. 이후 SHA 에서 `SPACING["80"]` 키가 사라지면 `as const` 객체의 없는 키 접근이라 typecheck 가 깨진다. 조용히 다른 변으로 바뀌지 않는다.

라벨은 템플릿 문자열 하나이고 분기가 없다. 그래서 순수 함수로 빼지 않고 단위 테스트도 두지 않는다. `flattenColors` 와 다른 점은 이것이다. 펴기가 리프를 버리면 그 색은 화면에서 **보이지 않게** 빠지지만, 라벨이 틀리면 틀린 글자가 리뷰하는 그 화면에 **보인다** (§5 수동 로컬 2~5).

규칙:

- CSF3. `Meta` 와 `StoryObj` 를 `@storybook/react-native-web-vite` 에서 타입으로 가져온다. `const meta = { title: "Foundations" } satisfies Meta;` 와 `export default meta` 는 CSF 가 요구하는 형식이다 (Step 7 의 규약 예외). story 는 각각 `render` 하나다
- `react-native` 의 `View`, `Text`, `StyleSheet` 만 쓴다. `expo-*` 를 import 하지 않는다
- **숫자와 색 리터럴 0개.** 견본 크기, 상자 크기, 간격은 `SPACING` 에서, 상자 채움색은 `COLORS.primary.normal` 에서 꺼낸다 (plan 1 테스트가 고정하는 키). 라벨 글자에는 스타일을 주지 않는다 (Typography 는 그 variant 스타일만). 표시할 값(`backgroundColor`, 정사각형 한 변, `borderRadius`, variant 스타일, 라벨의 값 글자)은 전부 토큰에서 온다
- 라벨의 구분자는 이름과 값 사이 공백 하나, Typography 의 값 사이 `/` 다. 숫자는 `String()` 그대로 쓰고 반올림이나 단위를 붙이지 않는다
- 고정 부분은 `StyleSheet.create`. 토큰마다 다른 style 객체와 목록은 **모듈 최상위에서 한 번** 만든다. 렌더마다 새로 만들지 않는다
- 줄은 `flexDirection: "row"` 와 `flexWrap: "wrap"` 으로 흘린다. 폭에 따라 줄바꿈만 달라진다. `useBreakpoint`, `useWindowDimensions`, `Dimensions` 를 쓰지 않는다 (§5 자동 9 가 grep 으로 본다)
- story 이름에 `Tablet`, `Phone`, `Mobile` 을 쓰지 않는다. 폭 래퍼 decorator 를 두지 않는다
- 피그마에만 있는 4개(§2)를 손으로 추가하지 않는다. 팔레트는 `theme.ts` 를 그대로 비춘다

검증: `npm run build-storybook` 이 exit 0 이고 아래가 `4` 다.

```bash
node -e 'const j=require("./storybook-static/index.json");console.log(Object.values(j.entries).filter(e=>e.type==="story").length)'
```

### Step 5: `tsconfig.json` 과 `.gitignore`

둘 다 실측으로 필요가 확인됐다. `/tmp` 의 빈 프로젝트에서 이 레포의 `tsc`, `oxlint`, `oxfmt` 바이너리로 확인했다.

| 실측 | 결과 | 귀결 |
| --- | --- | --- |
| `include: ["**/*.ts"]` 인 tsconfig 에서 `.storybook/main.ts` 에 타입 에러를 넣고 `tsc` | **exit 0.** `--listFilesOnly` 에 `.storybook/` 파일이 없다. 와일드카드가 점 디렉터리를 건너뛴다 | `include` 에 `".storybook/**/*.ts"` 를 추가한다. 이 레포가 `.expo/types/**/*.ts` 를 명시한 것과 같은 이유다. 안 넣으면 `main.ts` 의 타입이 깨져도 게이트가 초록이다 |
| 같은 상태에서 `oxlint`, `oxfmt --check` | 둘 다 `.storybook/` 을 검사한다 | 추가 설정 없음 |
| `storybook-static/` 에 포맷 안 된 JS 를 두고 `oxfmt --check` | **exit 1** (게이트 FAIL). `.gitignore` 에 넣으면 oxfmt 와 oxlint 가 둘 다 건너뛴다 | `.gitignore` 에 `storybook-static/` 을 추가한다. 안 넣으면 로컬에서 `build-storybook` 한 번 돌린 뒤 게이트가 빨개진다 |
| 비평의 소스 확인 (2026-11-27). Storybook 은 `debug-storybook.log` 를 cwd 에 쓰고 (`code/core/src/node-logger/logger/log-tracker.ts:15-16`, v10.6.9), `storybook init` 은 `.gitignore` 에 `*storybook.log` 를 넣는다 (`code/lib/create-storybook/src/commands/FinalizationCommand.ts:61-62`) | 이 계획은 init 을 쓰지 않는다 | `.gitignore` 에 `*storybook.log` 를 손으로 넣는다 |

`theme.stories.tsx` 는 `src/` 아래라 기존 `**/*.tsx` include 가 이미 잡는다.

`.gitignore` 에 넣는 두 줄은 이것이다.

```
# storybook
storybook-static/
*storybook.log
```

검증: `.storybook/main.ts` 에 `const x: number = "a";` 를 임시로 넣고 `npm run typecheck` 가 **FAIL** 한다. 되돌린다. `npm run build-storybook` 후 `.claude/scripts/check-gate.sh` 가 `PASS` 이고 `git status --porcelain | grep -E 'storybook-static|storybook\.log'` 가 0건이다.

### Step 6: `.github/workflows/chromatic.yml`

```yaml
name: Chromatic

# push 만 쓴다. fork 에서 온 PR 은 이 레포에 push 이벤트를 만들지 않아 시크릿에 닿지 않는다.
# pull_request_target 은 쓰지 않는다. base 레포 권한과 시크릿으로 PR 코드를 돌리게 된다.
on: push

permissions:
  contents: read

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - uses: chromaui/action@<SHA> # v18, <YYYY-MM-DD> 에 고정
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

`<SHA>` 는 builder 가 구현 시점에 아래로 얻은 40자 커밋 SHA 다. 날짜는 그 명령을 돌린 날이다.

```bash
gh api repos/chromaui/action/commits/v18 --jq .sha
```

2026-11-27 planner 실행 결과는 40자 SHA 하나였다. 태그가 움직이므로 이 값을 계획에 적지 않고 builder 가 다시 얻는다.

| 선택 | 근거 |
| --- | --- |
| `on: push` | Chromatic 이 권하는 트리거다. `pull_request` 는 임시 merge commit 위에서 돌아 베이스라인을 잃을 수 있다고 문서가 적는다 [^gha]. PR 브랜치에 push 할 때마다 돌고, 레포 연결이 그 빌드를 PR 의 상태 체크로 잇는다 [^ci] |
| `paths`, `paths-ignore`, `if:` 를 두지 않는다 | `UI Tests` 가 required 다 (Step 0-3). Chromatic 이 돌지 않은 커밋은 "Pending indefinitely" 다 [^mandatory]. docs 만 바꾼 PR 도 돌아야 머지된다 |
| fork PR | GitHub 시크릿은 fork 에 전달되지 않는다 [^gha]. push 트리거는 fork PR 에서 이 레포의 워크플로를 아예 돌리지 않는다. **fork PR 에는 Chromatic 이 없고 `UI Tests` 가 pending 으로 남는다** (§6-15). 받아들인다. 팀은 같은 레포에 브랜치를 push 한다 |
| 토큰 평문 금지 | 문서는 fork 를 위해 토큰을 워크플로에 평문으로 두는 길도 적지만 [^gha] public 레포 하드코딩 금지에 걸린다. 쓰지 않는다 |
| `permissions: contents: read` | 이 잡은 레포를 읽기만 한다. `GITHUB_TOKEN` 권한을 최소로 둔다. PR 상태 체크는 이 토큰이 아니라 Chromatic 의 레포 연결이 올린다 [^ci] |
| `fetch-depth: 0` | Chromatic 문서의 모든 예제가 전 이력을 받는다 [^gha]. 베이스라인을 git 조상에서 찾는다 [^baselines] |
| `node-version: 22` | 로컬 실측 `v22.23.4` 와 맞춘다. `chromatic@18.15.3` 의 engines 가 `>=22.0.0`, `vite@8.3.8` 이 `^20.19.0 \|\| >=22.12.0` 이다 |
| `checkout@v7`, `setup-node@v7` | GitHub 이 직접 만든 Action 이라 major 태그에 둔다. 두 major 태그가 존재함을 GitHub API 로 확인했다 (2026-11-27) |
| `chromaui/action` 은 커밋 SHA | **시크릿을 받는 서드파티 Action 이다.** GitHub 보안 가이드가 서드파티 Action 을 커밋 SHA 로 고정하라고 권한다. 움직이는 `v18` 태그는 태그가 다른 커밋으로 옮겨지면 토큰을 받는 코드가 조용히 바뀐다. 갱신은 수동이다 (§6-20) |
| `exitZeroOnChanges` 등 옵션 | 기본값을 쓴다. 시각 변경이 있어도 잡은 초록이고 [^gha], 게이트는 `UI Tests` 다 [^mandatory]. 잡을 실패시키지 않는 이유: Actions 잡의 결론은 Accept 뒤에도 빨간 채 남지만 `UI Tests` 는 Accept 하면 바뀐다 |
| Linux 바이너리 | `npm ci` 가 ubuntu 에서 깨지지 않는지 봤다. lockfile 에 `@rolldown/binding-linux-x64-gnu`, `lightningcss-linux-x64-gnu`, `@oxlint/binding-linux-x64-gnu`, `@oxfmt/binding-linux-x64-gnu` 가 있다 (실측) |

검증: §5 자동 7 의 grep.

### Step 7: 거짓이 되는 문서와 디자이너 안내

| 파일 | 지금 | 바꿀 내용 |
| --- | --- | --- |
| `.claude/skills/quizly-app-conventions/SKILL.md` 101행 | "`export default` 는 expo-router 파일에서만" | "`export default` 는 expo-router 파일과 Storybook 파일(`.storybook/*.ts`, `*.stories.tsx`)에서만. 둘 다 도구가 default export 를 요구한다". 안 고치면 `code-critic` 이 이 PR 의 두 파일을 규약 위반으로 적는다 |
| 같은 파일 스택 표 (27행 `플랫폼` 아래) | Storybook 행 없음 | `시각적 테스트 \| Storybook (`@storybook/react-native-web-vite`) + Chromatic. PR 마다 스냅샷을 baseline 과 비교한다. 웹 근사이고 기기 렌더링이 아니다` 1행 |
| 같은 파일 "태블릿에서 폰으로" 표 (73행 `터치 타겟` 아래) | 시각적 테스트의 폭 규칙 없음 | `시각적 테스트 \| Chromatic mode 가 없다. 모든 story 를 Chromatic 기본 viewport 폭 1200 하나로 찍고, 그 폭에서 `useBreakpoint()` 는 언제나 `'tablet'` 이다. **phone 배치는 스냅샷에 없다.** `useBreakpoint()` 로 배치가 바뀌는 컴포넌트의 story 를 처음 넣는 PR 이 tablet, phone 두 mode 를 같이 넣는다. 폭을 정하는 규칙은 `docs/ai/plan/storybook-chromatic.md` §6-1` 1행 (비평 M2). 이 표에 두는 이유: `planner` 가 가장 먼저 읽는 문서이고 (`planner.md:19`) 태블릿과 폰 규칙의 자리가 이 표다. `CLAUDE.md` 에는 이 표가 없고 두 곳에 두면 한쪽만 고쳐진다. 그래서 `CLAUDE.md` 에는 넣지 않는다 |
| 같은 파일 작업 흐름 표 (165행 `PR` 아래) | 머지 조건 없음 | `머지 \| `dev` 는 Chromatic `UI Tests` 통과를 요구한다 (classic branch protection rule). 시각 변경이 있으면 Chromatic 빌드에서 의도한 변경을 Accept 하고 의도하지 않은 변경은 고친다. admin 의 bypass 머지는 스냅샷 한도 소진 같은 막힘에만 쓰고, 그 PR 번호를 `chore: Chromatic 스냅샷 사용량 측정` 이슈에 댓글로 남긴다` 1행. 이슈는 번호가 아니라 제목으로 가리킨다 (Step 8 이슈 3 이 이 PR 보다 늦게 생길 수 있다) |
| `CLAUDE.md` 스택 표 (64행 아래) | 같음 | 같은 1행 |
| `CLAUDE.md` 명령 블록 (137행 아래) | 없음 | `npm run storybook` (로컬 Storybook), `npm run build-storybook` (정적 빌드) 2줄 |
| `CLAUDE.md` 작업 흐름 표 (164행 아래) | 같음 | 같은 머지 1행 |
| `README.md` | Expo 템플릿 기본 문서 | "디자이너 리뷰" 절을 추가한다. 내용은 아래뿐이다 |

README "디자이너 리뷰" 절에 넣는 것:

1. 링크. `dev` 에 머지된 최신 Storybook 은 `https://dev--<appid>.chromatic.com` 이다 [^perm]. `<appid>` 는 Step 0-4 의 칸에서 옮긴다. 진행 중인 PR 의 Storybook 은 그 PR 의 `Storybook Publish` 체크에서 연다
2. Foundations 에 색, 타이포, 간격, 라운딩이 있다. 앱의 `theme.ts` 를 그대로 그린 것이라 피그마 Variables, Styles 와 나란히 놓고 본다. 토큰마다 이름과 값이 글자로 붙어 있어 피그마의 숫자와 바로 맞대 본다
3. **빠져 보이는 것이 정상인 항목.** 두 종류로 나눠 쓴다
   - **SHA 에 묶인 것.** 문장을 SHA 에 묶어 쓴다. 꼴은 "`Quizly-Team/frontend@<40자 SHA>` 의 `tokens.json` 에는 피그마에만 있는 `glass/tint`, `glass/highlight`, `shadow/sheet`, `glass` effect style 이 없어서 안 보인다. `theme.ts` 머리의 SHA 가 이 SHA 와 다르면 이 목록은 그 SHA 에 대해 확인되지 않은 것이다" 다. `<40자 SHA>` 는 builder 가 Step 0-4 의 3 을 확인한 뒤 `theme.ts` 머리에서 옮긴다. 이렇게 쓰면 이후 SHA 갱신 PR 이 README 를 건드리지 않아도 (plan 1 Step 6 의 4번이 그 PR 에 다른 변경을 섞지 않는다) 문장이 거짓이 되지 않는다. 낡을 뿐이고, 낡은 것은 디자이너가 두 SHA 를 맞대 보면 안다 (비평 m1)
   - **SHA 와 무관한 것.** 앱이 일부러 내보내지 않는 그림자(boxShadow) 토큰, `Pretendard` 폰트, 다크 모드는 안 보인다 (plan 1 §2). 개수를 적지 않는다. SHA 가 바뀌면 개수가 바뀔 수 있다

   그 밖에 빠지거나 값이 다른 것이 리뷰 대상이다
4. **이 링크에서 리뷰하는 것:** 색 값, 간격과 라운딩 크기, 글자 크기와 굵기와 줄 높이. 컴포넌트가 생기면 배치와 태블릿, 폰 전환
5. **이 링크에서 리뷰하지 않는 것:** 아래 차이표의 네 항목. 기기에서 본다

**웹 렌더링과 기기 렌더링의 차이.** 디자이너가 링크에서 승인한 것을 기기 승인으로 오해하는 것이 리스크다. 대처는 리뷰 범위를 README 한 곳에 못 박는 것이다.

| 지점 | 웹 Storybook | 기기 | 근거 |
| --- | --- | --- | --- |
| 유리 효과 (`expo-glass-effect`) | **효과 없는 평범한 `View`** | iOS 만 유리. **Android 도 평범한 `View`** | 실측. `node_modules/expo-glass-effect/build/GlassView.js` 와 `GlassContainer.js` 가 `<View {...props} />` 하나이고 유리 구현은 `.ios.js` 에만 있다. `isLiquidGlassAvailable.js` 는 `false` 를 반환한다 |
| 폰트 | 브라우저 기본 폰트 | 시스템 폰트 | plan 1 이 `fontFamily: "Pretendard"` 를 버렸다 (폰트 미번들). Typography story 의 글자 폭이 피그마와 다르게 보이는 것은 이 때문이다 |
| 그림자 | CSS `box-shadow` | iOS `shadow*`, Android `elevation` | plan 1 이 `boxShadow` 토큰을 내보내지 않는다. 두 플랫폼 일치도 미실측 (plan 1 §6-5) |
| safe area | 인셋 0 | 노치와 홈 인디케이터 | 컴포넌트와 팔레트 stories 만 두므로 영향이 작다. 화면 stories 는 §2 |

유리 효과 표는 웹 Storybook 의 결함만이 아니다. **Android 가 출시 1순위인데 Android 에서도 유리가 안 그려진다.** 피그마의 Glass/Group, Glass/Item 이 Android 에서 어떻게 보여야 하는지는 디자이너가 정할 문제다 (Step 8 이슈 2).

### Step 8: 사람이 만들 이슈

하네스는 이슈를 만들지 않는다. 아래 제목으로 사람이 만든다. 명사형 어미다.

| # | 제목 | 근거 |
| --- | --- | --- |
| 1 | `chore: Storybook 과 Chromatic 도입` | 이 작업의 이슈. 이 PR 하나로 닫는다 |
| 2 | `feat: Glass 컴포넌트의 Android 대체 표현 정의` | Step 7 차이표. 디자이너 결정이다. Glass 계열 컴포넌트 계획의 **선행 조건**이다 |
| 3 | `chore: Chromatic 스냅샷 사용량 측정` | §6-8 (비평 m4). 이슈 담당자(assignee)를 만들 때 정한다. 본문에 할 일 두 가지. (1) 이 PR 머지 2주 뒤 Chromatic Billing 화면의 누적 사용량과 월말 추정치를 댓글로 적는다. mode 가 들어오는 PR 에서 한 번 더 적는다. 측정을 적으면 닫는다. (2) bypass 로 머지한 PR 은 번호와 이유를 이 이슈에 댓글로 남긴다. **이슈가 닫힌 뒤에도 같은 이슈에 단다.** 한 곳에 모여야 리셋 뒤 다시 뜬 diff 의 출처를 찾는다 |
| 4 | `chore: UI Tests 머지 차단 실측` | **갈래 A 이고 Step 0-4 표에서 (나) 를 골랐을 때만** 만든다. 시각 변경이 있는 첫 PR 에서 §5 Chromatic 4 의 갈래 P 기대 결과(Required 표시, 비활성 머지 버튼, bypass 체크박스, 체크박스로 머지 버튼이 열림)를 보고 결과를 적은 뒤 닫는다. 갈래 P 였거나 (가) 를 했으면 만들지 않는다 |

### Step 9: 게이트, 커밋, push, 브랜치 보호 순서

Run: `.claude/scripts/check-gate.sh --fix` 그다음 `.claude/scripts/check-gate.sh`
Expected: `ok typecheck`, `ok lint`, `ok test`, `ok format`, `PASS`

커밋 제목 예 `chore: Storybook 과 Chromatic 도입`. 제목만 쓴다. `git add -A` 를 쓰지 않고 아래를 명시한다.

```
package.json
package-lock.json
.storybook/main.ts
tsconfig.json
.gitignore
src/shared/constants/flattenColors.ts
src/shared/constants/flattenColors.test.ts
src/shared/constants/theme.stories.tsx
.github/workflows/chromatic.yml
.claude/skills/quizly-app-conventions/SKILL.md
CLAUDE.md
README.md
docs/ai/plan/storybook-chromatic.md  (그리고 이 작업의 다른 docs/ai 산출물)
```

**첫 push 는 두 조건이 참일 때만 한다.** (1) 브랜치가 `theme.ts` 를 담은 `dev` 에서 갈라졌다 (Step 0-4 의 1). (2) `CHROMATIC_PROJECT_TOKEN` 시크릿이 등록돼 있다. 워크플로가 브랜치에 들어간 순간부터 push 마다 돈다. 둘 중 하나라도 없으면 첫 빌드가 실패한다.

PR base `dev`, 본문에 `Closes #<이슈 1>`.

그다음은 **사람이** 이 순서로 한다. 각 단계의 기대 결과는 §5 수동 Chromatic 이다. 갈래 A 와 P 가 다른 단계는 둘로 나눠 적었다.

1. 첫 빌드가 끝나면 §5 Chromatic 2 의 표로 **갈래 A (auto-accept) 인지 P (pending) 인지 정한다.** 어느 갈래든 **아직 Accept 하지 않고 머지하지 않는다.** 표의 셋째 행(둘이 어긋나거나 `UI Tests` 가 없다)이면 멈추고 §6-23 을 연다
2. `dev` 에 classic branch protection rule 을 건다. Chromatic 문서의 절차를 지금 GitHub 화면 이름으로 옮긴 것이다 [^mandatory] [^gh-bpm]. Settings > Branches > **"Add classic branch protection rule"**, Branch name pattern `dev`, "Require status checks to pass before merging" 선택, 검색창에 `UI Test` 를 쳐서 Chromatic 의 `UI Tests` 체크를 고른다, **"Create"**. 다른 항목은 켜지 않는다. "Do not allow bypassing the above settings" 도 켜지 않는다. **"Add branch ruleset" 을 고르지 않는다** (Step 0-3). 걸고 나면 §5 Chromatic 4 의 `gh api` 두 줄로 확인한다
3. 막힘 확인
   - **P:** 이 PR 에서 한다. §5 Chromatic 4 의 P 기대 결과를 본다. bypass 체크박스는 켜서 머지 버튼이 열리는 것만 보고 **끄고 누르지 않는다**
   - **A:** 이 PR 에서는 `UI Tests` 옆 Required 표시와 성공 상태만 본다. 막힘 확인은 6 에서 한다
4. 디자이너가 팔레트를 피그마와 비교한다 (§5 Chromatic 5). **머지 전에 한다.** 변환 버그면 P 는 Accept 하지 않고 A 는 머지하지 않는다. plan 1 쪽 이슈를 만들고, 고친 `theme.ts` 가 `dev` 에 들어오면 `dev` 를 이 브랜치로 머지해 push 한다. 그 빌드에서 다시 2 의 확인부터 본다
5. **P:** 개발자가 Chromatic 빌드에서 4개를 Accept 한다. `UI Tests` 가 성공으로 바뀐다. **A:** 할 것이 없다. Build 1 이 이미 baseline 이다
6. **A 만.** Step 0-4 표에서 고른 쪽으로 막힘을 확인한다
   - **(가) 임시 PR.** 이 PR 브랜치에서 임시 브랜치를 딴다. 이름은 이 PR 브랜치 이름 뒤에 `-gate-probe` 를 붙인다. `theme.stories.tsx` 의 `Spacing` 라벨 구분자(이름과 값 사이 공백) 한 글자를 다른 글자로 바꿔 커밋하고 push 한다. base `dev` 로 PR 을 연다. **draft 로 열지 않는다.** "Draft pull requests cannot be merged" 라서 [^gh-draft] 머지 버튼이 막힌 이유가 required check 인지 draft 인지 구별되지 않는다 (비평이 제안한 draft PR 에서 바꾼 점). 제목 끝에 `(검증용, 머지 금지)` 를 붙인다. §5 Chromatic 6 의 (가) 기대 결과를 본 뒤 PR 을 닫고 `git push origin --delete <임시 브랜치>` 와 로컬 브랜치 삭제로 지운다. 그 빌드를 Accept 하지 않는다. 임시 브랜치는 `dev` 의 git 조상이 아니라서 그 빌드가 이후 baseline 에 끼지 않는다 [^baselines]
   - **(나) 미룸.** Step 8 이슈 4 를 만든다
   - 4 에서 변환 버그로 다시 push 했다면 그 빌드에서 diff 가 생겨 이 PR 이 pending 이 된다. 그때는 이 PR 에서 P 의 막힘 확인을 하고 (가), (나) 를 하지 않는다. 확인 뒤 디자이너 비교를 거쳐 그 diff 를 Accept 한다 (P 의 5 와 같다)
7. `UI Tests` 가 성공인 상태에서 머지한다. bypass 로 머지하지 않는다
8. 머지 직후 열려 있는 다른 PR 이 있으면, 그 브랜치에 이 워크플로가 없어 `UI Tests` 가 영원히 pending 이다. `dev` 를 그 브랜치로 머지해 오라고 작성자에게 알린다 (§6-21)

## 5. 검증

### 자동

1. `.claude/scripts/check-gate.sh` 가 `PASS`. 네 줄 모두 `ok`
2. `npx vitest run src/shared/constants/flattenColors.test.ts` 가 1개 통과. Step 3 의 음성 대조가 FAIL 했다가 되돌린 뒤 PASS
3. `npm run build-storybook` 이 exit 0. Step 4 의 `node -e` 출력이 `4`
4. `.storybook/main.ts` 에 타입 에러를 임시로 넣으면 `npm run typecheck` 가 FAIL 한다. 되돌린 뒤 PASS (Step 5)
5. `npm run build-storybook` 직후 `.claude/scripts/check-gate.sh` 가 `PASS` 이고 `git status --porcelain | grep -E 'storybook-static|storybook\.log'` 가 0건
6. **앱 번들이 Storybook 을 담지 않는다.** `npx expo export --platform android --source-maps --output-dir /tmp/qz-export` 뒤 `grep -rlE 'storybook|\.stories\.' /tmp/qz-export --include='*.map'` 이 0건. source map 의 `sources` 에 번들된 모듈 경로가 전부 들어 있다. story 경로 `src/shared/constants/theme.stories.tsx` 에는 `storybook` 이 없어서 `\.stories\.` 를 같이 찾는다. 0건이면 stories 와 Storybook 패키지가 앱에 없다는 뜻이다
7. **워크플로 정적 검사.** public 레포의 토큰 하드코딩을 막는 유일한 자동 검사라 음성 대조까지 돌린다. **세 줄 모두 exit 0 이 통과다.** 판정 기준은 exit code 하나다 (비평 m2)

   ```bash
   # 7-1. 트리거에 pull_request_target 이 없다. 주석 줄은 빼고 찾는다 (YAML 머리 주석이 이 단어를 담는다)
   ! grep -nE '^[^#]*pull_request_target' .github/workflows/chromatic.yml
   # 7-2. 토큰은 시크릿 참조 한 줄뿐이다. 개수가 정확히 1 이어야 exit 0
   test "$(grep -cF 'projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}' .github/workflows/chromatic.yml)" -eq 1
   # 7-3. .github 아래 어디에도 평문 토큰이 없다. with 의 projectToken 과 env 의 CHROMATIC_PROJECT_TOKEN 둘 다 본다
   ! grep -rnE '(projectToken|CHROMATIC_PROJECT_TOKEN):[[:space:]]*[^$[:space:]]' .github
   ```

   패턴 규칙. `\s` 를 쓰지 않고 POSIX 클래스 `[[:space:]]` 를 쓴다. `git grep -E` 는 이 기기의 git 2.54.0 에서 `\s` 를 지원하지 않아 1회차의 검사가 `projectToken: chpt_abc123` 을 못 잡았다 (비평 C1 재현). 또 **`git grep` 을 쓰지 않는다.** untracked 파일을 건너뛰므로 아직 스테이징하지 않은 워크플로에서는 어떤 패턴이든 매치 0 이고 `!` 로 거짓 PASS 다. 7-3 의 키에 `CHROMATIC_PROJECT_TOKEN` 을 더한 것은 Chromatic 문서가 CLI 직접 실행 예제에서 토큰을 `env` 로 넘기기 때문이다 (비평 m1). 시크릿 참조 줄의 `CHROMATIC_PROJECT_TOKEN }}` 뒤에는 콜론이 없어 매치되지 않는다.

   음성 대조. 아래가 전부 주석의 기대대로 나와야 검사를 믿는다. 레포 루트에서 그대로 붙여 돌린다. planner 가 2026-11-27 에 Step 6 의 YAML 을 그대로 /tmp 에 두고 시스템 grep (`/usr/bin/grep`, BSD 2.6.0) 으로 돌린 결과와 같다. 그 YAML 에서 7-1, 7-2, 7-3 은 모두 exit 0 이었다.

   ```bash
   P='(projectToken|CHROMATIC_PROJECT_TOKEN):[[:space:]]*[^$[:space:]]'
   W=.github/workflows/chromatic.yml
   # 7-1 의 패턴
   printf 'on: pull_request_target\n' | grep -nE '^[^#]*pull_request_target'            # 1행 매치. 7-1 이 FAIL 하는 입력
   printf 'on:\n  push:\n  pull_request_target:\n' | grep -nE '^[^#]*pull_request_target' # 3행 매치
   printf '# pull_request_target 은 쓰지 않는다\n' | grep -nE '^[^#]*pull_request_target'   # 매치 0
   # 7-2 는 2 이상도 잡는다
   cp "$W" /tmp/qz-w.yml; grep -F 'projectToken:' /tmp/qz-w.yml >> "$W"
   test "$(grep -cF 'projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}' "$W")" -eq 1; echo $?  # 1
   cp /tmp/qz-w.yml "$W"
   test "$(grep -cF 'projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}' "$W")" -eq 1; echo $?  # 0
   # 7-3 의 패턴
   printf '  projectToken: dummy\n' | grep -nE "$P"                                      # 1행 매치. 7-3 이 FAIL 하는 입력
   printf '    env:\n      CHROMATIC_PROJECT_TOKEN: chpt_abc123\n' | grep -nE "$P"        # 2행 매치. env 평문도 잡는다
   printf '      CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}\n' | grep -nE "$P"  # 매치 0
   printf '  projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}\n' | grep -nE "$P"       # 매치 0
   # 7-3 은 untracked 파일도 잡는다
   printf 'projectToken: dummy\n' > .github/probe.yml
   ! grep -rnE "$P" .github; echo $?                                                     # 1 (FAIL)
   rm .github/probe.yml
   ! grep -rnE "$P" .github; echo $?                                                     # 0 (PASS)
   ```

   끝나면 `cmp .github/workflows/chromatic.yml /tmp/qz-w.yml` 이 exit 0 이고 `.github/probe.yml` 이 없어야 한다. `chromatic.yml` 은 새 파일이라 `git status` 로는 되돌림을 확인할 수 없다.

8. `npm ls vite` 가 `8.x` 한 벌이다. `npm ls typescript` 가 루트 `6.0.x` 와 중첩 `5.x` 두 벌이고 `npx tsc --version` 이 `6.0.x` 다 (Step 1)
9. **팔레트에 숫자와 색 리터럴이 없고 폭을 읽지 않는다.** 앞 두 줄은 `layout-auditor` 의 고정 px 패턴을 파일 전체에 돌린다. 셋째 줄은 Step 0-5 의 전제 "팔레트는 폭에 반응하지 않는다" 를 기계로 고정한다 (비평 m3). 세 줄 모두 출력 0행이다

   ```bash
   grep -nE '(padding|margin|gap|borderRadius|fontSize|width|height)[[:space:]]*:[[:space:]]*[0-9]' src/shared/constants/theme.stories.tsx
   grep -nE "(color|backgroundColor|borderColor)[[:space:]]*:[[:space:]]*['\"]#" src/shared/constants/theme.stories.tsx
   grep -nE 'useBreakpoint|useWindowDimensions|Dimensions' src/shared/constants/theme.stories.tsx
   ```

10. **README 의 SHA 가 `theme.ts` 머리의 SHA 와 같고, 그 SHA 의 `tokens.json` 에 피그마에만 있는 4개가 없다** (비평 m1, Step 0-4 의 3). 레포 루트에서 돌린다. 네트워크가 필요하다. 인증 없는 `curl` 이다 (plan 1 Step 7-2 의 조회 블록과 같은 경로). **통과 조건은 출력이 정확히 아래 두 줄이고 exit 0 인 것이다**

   ```bash
   sha=$(head -3 src/shared/constants/theme.ts | grep -oE '[0-9a-f]{40}')
   echo "sha=${#sha} readme=$(grep -cF "${sha:-NOSHA}" README.md)"
   curl -sf "https://raw.githubusercontent.com/Quizly-Team/frontend/$sha/tokens/tokens.json" | node -e 'const t=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(JSON.stringify(t).toLowerCase().includes("glass"), "sheet" in (t["[DS] Semantic/Light"].shadow ?? {}))'
   ```

   ```
   sha=40 readme=1
   false false
   ```

   첫 줄의 `false` 는 `tokens.json` 어디에도 `glass` 가 없다는 뜻이다 (`glass/tint`, `glass/highlight`, `glass` effect style). 둘째는 `[DS] Semantic/Light` 의 `shadow` 아래 `sheet` 가 없다는 뜻이다. planner 실측 (2026-11-27, `/tmp` 스크래치). `d9f0213` 을 머리에 둔 대역 `theme.ts` 와 그 SHA 를 한 번 담은 README 에서 위 두 줄, exit 0. README 에 SHA 가 없으면 `readme=0`. 머리에 SHA 가 없으면 `sha=0 readme=0` 을 찍고 `curl` 이 GitHub 의 리다이렉트 HTML 을 받아 `JSON.parse` 가 `SyntaxError` 로 exit 1. 조용한 통과가 없다

### 단위 테스트 (순수 로직)

| 로직 | 어디서 |
| --- | --- |
| `flattenColors` 가 1단, 2단, 3단 리프를 빠짐없이 선언 순서대로 `/` 경로와 함께 내는가 | `flattenColors.test.ts` 신규 (Step 3) |

새 판정 함수, 파서, 포맷터는 이것 하나다. 나머지는 설정 파일과 렌더링이다. Step 4 의 값 라벨은 분기 없는 템플릿 문자열 하나라 테스트를 두지 않는다. 틀리면 그 틀린 글자가 리뷰 화면에 보인다 (Step 4, 수동 로컬 2~5).

### 수동: 로컬 Storybook (개발자)

1. `npm run storybook` → 터미널에 로컬 URL 이 뜬다. 브라우저에서 열면 사이드바에 `Foundations` 아래 `Colors`, `Typography`, `Spacing`, `Radius` 4개가 보인다
2. `Colors` 를 연다 → 견본마다 `경로 값` 글자가 붙어 있다. `shadow/` 아래 색 3개가 보인다 (plan 1 §2 가 boxShadow 만 빼고 color 3개는 남긴다). `glass/` 경로와 `shadow/sheet` 는 없다. **없는 것이 통과다** (§2)
3. `Typography` 를 연다 → variant 마다 한 줄이고 줄마다 글자 크기가 다르다. 줄 수가 `TYPOGRAPHY` 의 variant 수와 같다. `text-1rg/regular` 줄의 값 글자가 `16/24/-0.06/400` 이다 (plan 1 Step 4 의 4번이 고정하는 값)
4. `Spacing` 을 연다 → 정사각형 수가 `SPACING` 의 키 수와 같고 크기가 값 순서대로 커진다. 각 정사각형 옆에 `이름 값` 글자가 있다
5. `Radius` 를 연다 → 상자 수가 `RADIUS` 의 키 수와 같고 모든 상자의 변 길이가 같다. 각 상자 옆에 `이름 값` 글자가 있다 (`xl 24` 꼴). `none` 은 각진 사각형, `full` 은 원이고, `xl` 과 `2xl` 은 서로 다르고 둘 다 원이 아니다
6. 브라우저 창 폭을 줄인다 → 줄바꿈 위치만 바뀌고 견본 크기는 그대로다
7. 네 story 모두 개발자 도구 콘솔에 빨간 에러가 0건이다

### 수동: Chromatic (사람 설정 뒤, 이 PR 브랜치)

1. 브랜치를 push 한다 → GitHub Actions 탭에 `Chromatic` 워크플로가 뜨고 잡이 초록이다. 로그에 `Build 1` 로 시작하는 결과 줄이 있고, 그 아래 URL 이 `View build details at` 또는 `Continue setup at` 으로 시작한다 [^cli-onboard]. 어느 쪽이었는지 PR 댓글에 적는다. `Continue setup at` 이면 그 URL 을 열어 무엇을 요구하는지 적는다 (§6-23)
2. **갈래 판정.** PR 의 체크 목록에서 `UI Tests` 의 상태를, 1 의 Actions 로그에서 Build 1 결과 줄을 본다. 둘을 함께 보고 아래 표로 정한다

   | PR 의 `UI Tests` | Actions 로그의 Build 1 결과 줄 | 갈래 |
   | --- | --- | --- |
   | 성공 (초록 체크) | `Build 1 auto-accepted` | **A (auto-accept)** |
   | pending (노란 점) | `Build 1 completed` 와 accept 를 요구하는 문장 | **P (pending)** |
   | 위 두 행이 아니다 (둘이 어긋남, `UI Tests` 가 없음, 실패) | | **멈춘다.** 화면과 로그 줄을 그대로 PR 댓글에 적고 §6-23 을 연다 |

   어느 갈래든 `Storybook Publish` 는 성공이다. UI Review 를 켰으면 그 체크도 있다. 체크의 정확한 표시 이름과 갈래를 PR 댓글에 적는다 (§6-13)
3. Chromatic 웹에서 이 프로젝트의 Build 1 을 연다 → 스냅샷이 4장이고 story 마다 1장이다. mode 표시가 없다. P 면 4장이 Accept 를 기다린다. A 면 Accept 할 것이 없다. `Colors` 스냅샷 맨 아래에 `flattenColors(COLORS)` 의 마지막 경로가, `Typography` 스냅샷 맨 아래에 마지막 variant 가 보인다. 잘려 있으면 §6-12 다
4. Step 9 의 2 대로 `dev` 에 classic rule 을 건다 → 검색에 `UI Tests` 가 나온다. "Create" 뒤 아래 두 줄을 admin 계정의 `gh` 로 돌린다. 첫 줄이 `[["<2 에서 적은 체크 이름>"],false]`, 둘째 줄이 `0` 이면 통과다. `false` 는 admin 우회가 살아 있다는 뜻이고 `0` 은 ruleset 이 없다는 뜻이다. 보호를 걸기 전에는 첫 줄이 `Branch not protected (HTTP 404)` 다 (planner 실측 2026-11-27)

   ```bash
   gh api repos/Quizly-Team/quizly_app/branches/dev/protection --jq '[.required_status_checks.contexts, .enforce_admins.enabled]'
   gh api repos/Quizly-Team/quizly_app/rulesets --jq length
   ```

   그다음 **admin 계정으로** PR 페이지 머지 박스를 본다. 협업자 셋이 전원 admin 이라 admin 이 아닌 계정으로는 볼 수 없다 (Step 0-3)
   - **P:** `UI Tests` 옆에 Required 표시가 있고 pending 이다. 머지 버튼이 기본으로 비활성이다. 머지 박스에 bypass 를 뜻하는 체크박스가 보인다. **체크박스를 켜면 머지 버튼이 활성이 된다. 확인하고 끄고, 누르지 않는다.** 이것이 "pending 이면 막힌다" 와 "bypass 탈출구가 있다" (§6-8) 의 확인이다. 체크박스의 실제 문구를 PR 댓글에 적는다 (§6-24)
   - **A:** `UI Tests` 옆에 Required 표시가 있고 성공이다. 머지 버튼이 활성이다. 막힘 확인은 6 이다
   - Step 0-4 표에서 일부 계정을 `write` 로 내렸으면, 그 계정으로도 본다. P 에서 머지 버튼이 비활성이고 bypass 체크박스가 **없다**
   - 검색에 `UI Tests` 가 안 나오면 (P 에서만 생길 수 있다) §6-13 의 대체 순서로 간다
5. 디자이너가 `Storybook Publish` 체크의 링크를 연다 → Foundations 4개가 뜬다. 피그마와 비교한다. **어느 갈래든 머지 전에 한다.** 피그마에만 있는 4개의 부재는 통과다. 값이 다르면 `theme.ts` 머리의 SHA 의 `tokens.json` 값과 대조한다. `tokens.json` 과 같으면 변환은 맞고 피그마와 토큰이 어긋난 것이니 디자이너에게 넘기고 다음으로 간다. `tokens.json` 과 다르면 변환 버그다. **P 는 Accept 하지 않고, A 는 머지하지 않는다.** plan 1 쪽 이슈를 만든다 (핸드북 3단계의 "의도하지 않은 변경은 고친다"). A 에서 머지하지 않는 이유: Build 1 이 이미 baseline 이라 머지하면 틀린 팔레트가 `dev` 의 첫 baseline 과 `dev` permalink 가 된다. 고친 `theme.ts` 를 이 브랜치로 받아 push 하면 그 빌드에 diff 가 뜬다 (Step 9 의 4)
6. 갈래마다 다르다
   - **P:** 개발자가 빌드 화면에서 4장을 Accept 한다 → PR 의 `UI Tests` 가 성공으로 바뀌고 머지 버튼이 활성이다. Actions 잡은 다시 돌지 않는다
   - **A, (가) 임시 PR:** Step 9 의 6 대로 연 PR 에서 → 그 빌드는 Build 2 이상이고 `Spacing` 1장이 변경, 3장이 변경 없음이다. `UI Tests` 가 pending 이고 Required 표시가 있다. 머지 버튼이 비활성이고 bypass 체크박스가 보인다. 켜면 머지 버튼이 활성이 된다. 끄고 누르지 않는다. 글자 한 개 변경이 diff 로 잡혔다는 사실이 §6-24 의 확인이기도 하다. PR 을 닫고 브랜치를 지운 뒤 이 PR 의 `UI Tests` 가 여전히 성공이다. 그 빌드도 auto-accept 였다면 (가) 는 막힘을 보이지 못한 것이다. 그 사실을 PR 댓글에 적고 (나) 로 간다 (§6-23)
   - **A, (나) 미룸:** Step 8 이슈 4 가 열려 있다
7. 머지한다 → `dev` push 로 Chromatic 이 한 번 더 돈다. `https://dev--<appid>.chromatic.com` 이 Foundations 4개를 보여 준다
8. 로그아웃한 시크릿 창에서 7 의 링크를 연다 → 공개로 설정했으면 로그인 없이 Storybook 이 뜬다. 비공개로 설정했으면 로그인 화면이 뜬다. **Step 0-4 에서 고른 설정과 결과가 맞으면 통과**
9. UI Review 를 켰으면 디자이너 계정으로 PR 의 UI Review 를 연다 → 스냅샷에 댓글을 하나 남길 수 있고 개발자 계정에서 그 댓글이 보인다
10. **이 PR 뒤 첫 PR 에서** (변경 내용 무관) push 한다 → 스냅샷 4장이 "변경 없음" 이고 `UI Tests` 가 저절로 통과한다. 이 PR 을 squash 로 머지했어도 그렇다. "변경 있음" 으로 나오면 §6-11 이다

### 수동: 기기 (에뮬레이터와 시뮬레이터)

이 작업은 앱 런타임 코드를 바꾸지 않는다. 자동 6 이 번들 무변경을 증명하고, 기기 확인은 **앱이 전과 같이 뜨는지**만 본다.

1. 태블릿: `ifent_tab_a15` AVD 에서 `npm run android` → 홈에 "Quizly" 한 줄이 전과 같이 뜬다. Storybook UI 와 팔레트가 어디에도 없다
2. 폰: **Android 폰 AVD 가 없다.** AVD 생성이 선행 조건이다. 생성했으면 1 과 같은 조작과 기대 결과
3. iOS: 시뮬레이터 런타임이 0개다. `xcodebuild -downloadPlatform iOS` 가 선행 조건이다. 받았으면 태블릿(iPad)과 폰(iPhone) 시뮬레이터에서 `npm run ios` 로 1 과 같은 기대 결과

웹 스냅샷과 기기 렌더링의 차이를 재는 것은 `theme.ts` 를 쓰는 화면이 기기에 올라가야 가능하다 (§6-4).

## 6. 리스크와 미확인

| # | 항목 | 무엇을 재면 확정되나 |
| --- | --- | --- |
| 1 | **mode 폭은 이 PR 에서 정하지 않았다** (Step 0-5). 폭에 반응하는 첫 컴포넌트가 오면 정해야 한다. 2회차의 규칙에 비평 m4, m5 와 사람 결정 (e) 를 더해 여기 남긴다 | 그 컴포넌트 계획의 승인 전에 사람 또는 Figma MCP 를 가진 조정자 세션이 읽는다. builder 는 읽지 않는다 (`.claude/agents/builder.md:7` 의 `tools` 에 Figma MCP 가 없다). 읽을 것은 그 컴포넌트가 그려진 피그마 파일의 **세로(portrait) 태블릿 프레임과 세로 폰 프레임**이다. 앱이 `app.json:6` `"orientation": "portrait"` 라서 가로 프레임 폭은 앱이 그리지 않는 폭이다 (m5). 프레임 이름, node id, 폭을 적고 **피그마 파일은 이름만 적는다. URL 과 file key 를 public 레포 문서에 쓰지 않는다** (m4, 결정 (e)). 태블릿 폭은 `TABLET_MIN_WIDTH` 보다 커야 하고 폰 폭은 작아야 한다. 같으면 멈춘다 (2회차 M2, §6-19). `TABLET_MIN_WIDTH` 768 은 잠정값이라 바뀌면 이 비교를 다시 한다. mode 를 넣으면 mode 마다 새 baseline 이 생기고 [^modes] 그 PR 에서 Accept 가 한 번 필요하다. 기존 mode 없는 baseline 을 이어 가려면 문서가 기본 폭 이름의 mode 를 하나 더 두는 길을 적는다 [^modes]. 고를지는 그때 정한다 |
| 2 | **미승인인 plan 1 5회차에 기대고 있다.** Step 4 가 `COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS` 의 이름과 모양, `COLORS.primary.normal` 키, `SPACING["80"]` 키, `theme.ts` 머리의 40자 SHA 를 쓴다. 기준은 plan 1 5회차 Step 3 (`docs/ai/plan/1.md` 153~170행) 이다. 5회차는 `approved: false` 이고 비평은 4회차까지 rounds 3 revise 다 | 착수 시 머지된 `theme.ts` 의 export 와 머리를 본다. 다르면 builder 는 멈추고 이 계획을 고친다 (Step 0-4 의 1). plan 1 이 나중에 SHA 를 올려 네 export 의 값이 바뀌면 그 PR 에서 팔레트 스냅샷이 바뀌어 `UI Tests` 가 pending 이 된다. **그것이 의도한 동작이다** (§1). 그 PR 은 README 를 건드리지 않는다 (plan 1 Step 6 의 4번). README 의 빠짐 목록은 SHA 에 묶여 있어 거짓이 되지 않는다 (Step 7) |
| 3 | **Expo 58 모듈이 Vite 에서 도는지 ⚠️ 미실측.** `vite-plugin-rnw` 가 `expo`, `@expo` 접두 모듈을 트랜스파일하고 `EXPO_OS` 를 `"web"` 으로 define 한다 (Step 1). 그래도 Expo 의 웹 지원은 Metro 와 `babel-preset-expo` 기준이고, framework 의 Babel 은 `babelrc: false, configFile: false` 다. 이 PR 의 story 는 `expo-*` 를 import 하지 않아 여기서 드러나지 않는다 | 첫 컴포넌트가 import 하는 `expo-*` 모듈마다 `npm run build-storybook` 성공과 story 렌더를 본다. 실패하면 framework 옵션 `modulesToTranspile` 또는 Vite alias 를 보기 전에 사람에게 보고한다. 조용히 그 모듈을 story 에서 빼지 않는다 |
| 4 | **웹 스냅샷과 기기 렌더링의 실제 차이 ⚠️ 미실측.** Step 7 의 표는 소스와 plan 1 에서 추론한 지점이다. 팔레트는 폰트 차이를 첫날부터 드러낸다 | `theme.ts` 를 쓰는 첫 화면이 기기에 올라간 뒤 같은 토큰의 Chromatic 스냅샷과 태블릿 AVD, 폰 AVD 스크린샷을 나란히 둔다. 다른 점을 `docs/ai/qa/` 에 적고 README 의 "리뷰하지 않는 것" 을 그 결과로 고친다 |
| 5 | **reanimated 와 React Compiler 가 Storybook 에 안 붙는다.** framework 의 Babel 은 `babelrc: false, configFile: false` 다 (preset 소스). 애니메이션 컴포넌트는 `react-native-worklets/plugin` 을 `pluginReactOptions.babel` 에 넣어야 할 수 있다. 팔레트는 둘 다 쓰지 않는다 | 애니메이션이 있는 첫 컴포넌트에서 `build-storybook` 과 story 렌더를 본다 |
| 6 | **Glass 계열 컴포넌트는 웹 리뷰의 가치가 가장 낮다.** 웹과 Android 둘 다 효과 없는 판이다 (Step 7, 실측). `glass` effect style 은 토큰에도 없다 (§2) | Glass 계열 계획 전에 Step 8 이슈 2 가 선행이다. iOS 모습은 iOS 시뮬레이터 런타임을 받은 뒤 기기에서 본다 |
| 7 | **(a) 기기 Storybook 을 미룬 대가.** iOS 유리 효과와 실제 폰트 렌더링을 Chromatic 이 자동으로 보지 않는다 | 재검토 조건은 둘이다. (1) iOS 유리 효과를 PR 마다 자동으로 리뷰해야 할 때, (2) Chromatic React Native 가 viewport mode 또는 태블릿 기기 선택을 지원할 때. 그때 확인할 것: 기기 모델, RN 스냅샷 과금 방식(문서에 없음 [^billing]), 가용성("React Native 선택지가 안 보이면 지원팀에 연락" 이라는 문구 [^rn]). macOS 표준 러너는 public 레포에서 무료다 (GitHub 문서 "standard GitHub-hosted runners is free in public repositories") |
| 8 | **Free 플랜 한도와 required check 가 겹치면 모든 머지가 멈춘다.** 월 5,000 billed snapshots, 다 쓰면 리뷰와 테스트가 결제 주기 리셋까지 멈춘다 [^billing] [^pricing]. 한도에 닿으면 "Pending: the build can't complete, so no status is sent" 라 [^mandatory] `UI Tests` 가 required 인 `dev` 로 **어떤 PR 도 머지되지 않는다.** 소모는 지금 `4 story x 1 mode x 1 브라우저 x push 횟수` 다 | **이 레포의 월 사용량은 ⚠️ 미실측이다.** 측정은 Step 8 이슈 3 이 추적한다. 담당은 그 이슈의 assignee 다. 이 PR 머지 2주 뒤 Chromatic Billing 화면의 누적 사용량을 보고 월말 추정치를 그 이슈에 적는다. mode 가 들어오는 PR(§6-1)에서 다시 잰다. 한도에 닿으면 admin 이 bypass 로 머지한다. classic rule 의 기본값이라 설정 없이 된다 (Step 0-3). ruleset 이었다면 bypass list 에 Repository admin 이 없는 한 이 탈출구가 없다 (Step 0-3). 탈출구가 실제로 열리는지는 §5 Chromatic 4 (P) 또는 6 (A 의 가) 가 본다. **bypass 로 머지한 PR 은 번호와 이유를 Step 8 이슈 3 에 댓글로 남긴다** (비평 m4). 한도 소진 중에 머지된 시각 변경은 Accept 되지 않았으므로 리셋 뒤 다음 빌드에서 diff 로 다시 뜬다. 그 PR 작성자는 자기가 만들지 않은 diff 를 받는다 (Step 0-3 의 `UI Tests` 행이 required 의 이유로 든 현상). 그 목록으로 출처를 찾아 원래 작성자에게 Accept 를 넘긴다 |
| 9 | 한도에 가까워질 때의 레버 | TurboSnap(`onlyChanged: true`)은 복사된 스냅샷을 0.2 로 센다 [^billing]. 문서가 TurboSnap 을 기본적으로 webpack 의존성 그래프에 기대는 것으로 적어 [^gha] Vite 빌드에서 켜는 데 필요한 설정은 ⚠️ 미확인이다. 팔레트는 `theme.ts` 에 의존하므로 토큰이 바뀌지 않은 PR 에서는 복사 대상이 된다. 8 의 측정 뒤에 고른다. 경로 필터는 레버가 아니다 (§2) |
| 10 | **Free 플랜에서 UI Review, 공개 Storybook 이 되는지 ⚠️ 미확인.** 요금 페이지 표에서 Free 열을 확정하지 못했다 | 사람이 Step 0-4 의 설정을 할 때 Manage 화면에서 켜지는지 본다. UI Review 가 안 켜지면 디자이너 댓글을 PR 댓글로 받는다. `UI Tests` 게이트에는 영향이 없다 |
| 11 | **squash 머지와 베이스라인.** 레포가 merge, squash, rebase 를 모두 허용한다 (GitHub API 실측 2026-11-27). 문서는 squash/rebase 머지 때 "we'll use the accepted baselines of the most recent commit on the head branch of the PR" 라고 Git provider API 로 이어 준다고 적는다 [^baselines]. 같은 문서 계열이 GitHub app 이 없으면 `autoAcceptChanges` 를 권한다 [^gha] | §5 Chromatic 10. 머지 뒤 바꾸지 않은 story 가 "변경 있음" 으로 나오면 `autoAcceptChanges: "dev"` 를 추가할지 정한다. 지금 넣지 않는다 |
| 12 | **키가 큰 story 가 스냅샷에서 잘리는지 ⚠️ 미확인.** `Colors` 는 리프 수만큼, `Typography` 는 variant 수만큼 길다. 기본 viewport 높이는 900 이다 [^vp]. 스냅샷 문서는 "crops it to the dimensions of the UI" 라고만 적고 viewport 보다 긴 내용을 다 담는지 적지 않는다 [^snap] | §5 Chromatic 3 에서 두 스냅샷의 맨 아래 항목이 보이는지 본다. 잘리면 story 를 그룹 단위로 나눌지 사람이 정한다. 그때 고정 높이 숫자를 넣지 않는다 |
| 13 | **required check 를 고를 수 있는 시점과 정확한 체크 이름 ⚠️ 미확인.** GitHub 은 "an app that has recently set this check" 만 고를 수 있다고 적고 "recently" 를 정의하지 않는다 [^gh-bp]. pending 상태도 "set" 으로 치는지 모른다. Chromatic 문서는 체크 이름을 "UI Tests" 로, 검색 예시를 "UI Test" 로 적는다 [^ci] [^mandatory] | §5 Chromatic 4. 갈래 A 에서는 성공 상태가 이미 올라와 있어 이 문제가 작다. 갈래 P 에서 검색에 안 나오면 대체 순서로 간다. 먼저 Accept 해 `UI Tests` 가 성공으로 올라오게 한 뒤 보호를 건다. 그러면 상태가 갈래 A 와 같아지므로 "pending 이면 막힌다" 의 확인은 갈래 A 의 Step 9 의 6 을 따른다. Step 0-4 표의 (가) 또는 (나) 다. 실제 표시 이름은 §5 Chromatic 2 에서 적고 Step 7 의 문서 문구와 맞춘다 |
| 14 | **디자이너가 GitHub 계정이 없을 때 초대 경로 ⚠️ 미확인.** GitHub 연결 프로젝트는 권한을 GitHub 에서 동기화하고, 연결 안 된 프로젝트는 초대 코드를 쓴다 [^review] | 사람이 Chromatic Manage > Collaborators 에서 GitHub 밖 사용자를 넣을 수 있는지 본다. 공개 Storybook 이면 링크 열람에는 계정이 필요 없다 [^perm] |
| 15 | **fork PR 에는 Chromatic 이 안 돌고 `UI Tests` 가 영원히 pending 이다** [^mandatory] | 받아들인 리스크다. 외부 기여가 생기면 maintainer 가 그 브랜치를 이 레포로 가져와 push 한다 |
| 16 | **`chromaui/action` 이 `contents: read` 만으로 도는지 ⚠️ 미확인.** 문서 예제에는 `permissions` 블록이 없다 | 첫 빌드 로그. 권한 에러가 나면 에러가 요구하는 권한 하나만 추가한다 |
| 17 | **확정. oxfmt 는 YAML 을 검사한다.** `oxfmt 0.78.0` 이 `.github/workflows/*.yml` 을 검사 대상에 넣고, Step 6 의 YAML 을 그대로 넣은 파일은 `oxfmt --check` 를 통과한다. 들여쓰기를 망친 YAML 은 exit 1 이다 (planner 재현, 2026-11-27) | 닫힘. 게이트가 워크플로 파일의 포맷도 지킨다 |
| 18 | **TypeScript `~6.0.3` 과 Storybook 의존성의 peer** | `@storybook/react` 의 peer `typescript >= 4.9.x` 는 충족한다. `vite-plugin-rnw@0.0.11` 의 peer `typescript ^5` 는 충족하지 않아 `5.x` 가 중첩 설치된다 (Step 1). 루트 `tsc` 가 `6.0.x` 인지, typecheck 가 통과하는지를 §5 자동 1 과 8 로 확정한다. `skipLibCheck: true` 다 |
| 19 | **Chromatic 캡처 브라우저가 classic 세로 스크롤바를 그리는지 ⚠️ 미확인.** 그리면 RN Web 이 읽는 폭(`Math.round(visualViewport.width * visualViewport.scale)`, `react-native-web` 0.21.4 `dist/exports/Dimensions/index.js:44-53`)이 그 스크롤바 폭만큼 줄어든다. 팔레트는 폭에 반응하지 않아 이 PR 에서는 사고가 나지 않는다 | mode 가 들어오는 PR(§6-1)에서 다시 연다. 그때 태블릿 폭에서 768 을 뺀 여유를 적고, viewport 보다 긴 story 의 `tablet` 스냅샷이 태블릿 배치인지 본다. 개발자 도구 기기 모드는 overlay 스크롤바라 재현하지 못한다 |
| 20 | **`chromaui/action` SHA 고정의 갱신은 수동이다.** Dependabot 같은 자동 갱신이 이 레포에 없다 (`.github/` 없음) | 고정한 SHA 가 Chromatic 쪽 변경으로 깨지면 첫 빌드 로그에 나온다. 그때 Step 6 의 `gh api` 명령으로 다시 얻어 주석의 날짜와 함께 바꾼다. 자동 갱신 도입은 별 작업이다 |
| 21 | **보호를 건 뒤 이 워크플로가 없는 브랜치는 머지되지 않는다.** push 이벤트는 그 커밋에 들어 있는 워크플로 파일로 돈다. 이 PR 머지 전에 `dev` 에서 갈라진 브랜치에는 `chromatic.yml` 이 없어 Chromatic 이 돌지 않고 `UI Tests` 가 "Pending indefinitely" 다 [^mandatory] | Step 9 의 8. 해당 브랜치에 `dev` 를 머지해 오면 다음 push 부터 돈다. 2026-11-27 현재 원격 브랜치는 `dev`, `main` 둘이다 (GitHub API) |
| 22 | **단위 테스트가 머지 시점에 자동으로 강제되지 않는다.** check-gate 를 CI 에 두지 않았다 (§2). 이 PR 의 `flattenColors.test.ts` 도 그렇다. 지금 레포 전체가 같은 상태다 | 받아들인 리스크다. 로컬 `check-gate.sh` 와 하네스의 QA 가 막는다. CI 에 올리고 required 로 걸지는 별 작업에서 정한다 |
| 23 | **새 프로젝트의 Build 1 이 auto-accept 되는지 ⚠️ 미확인.** 근거는 공식 문서가 아니라 Chromatic CLI 저장소의 에이전트용 검증 문서다 (`chromaui/chromatic-cli` main `a89d8bd` 2026-11-25, `.agents/skills/verify-chromatic-cli/features/publish-build.md:51`, planner 가 `gh api` 로 원문 확인 2026-11-27) [^cli-onboard]. 공식 문서 `mandatory-pr-checks`, `branching-and-baselines` 는 첫 빌드를 다루지 않는다 (비평 C1). 딸린 미확인이 셋이다. (1) onboarding 모드에서 PR 상태 체크가 평소처럼 붙는지. (2) 로그의 `Continue setup at ...` 이 사람 작업을 더 요구하는지. (3) onboarding 이 Build 1 에서 끝나는지. Build 2 도 auto-accept 면 (가) 가 막힘을 보이지 못한다 | §5 Chromatic 1, 2 의 표로 확정한다. 판정 근거는 PR 의 `UI Tests` 상태와 Actions 로그의 Build 1 결과 줄 두 가지다. (1) 은 2 에서 `UI Tests` 가 보이는지로 확정한다. 없으면 표의 셋째 행이라 멈춘다. (2) 는 1 에서 그 URL 을 열어 요구 사항을 적는다. 그 작업이 PR 체크나 baseline 을 바꾸는 것이면 (예: 빌드 Accept, 체크 켜기) 하지 않고 멈춰 보고한다. (3) 은 §5 Chromatic 6 의 (가) 에서 Build 2 의 상태로 확정한다. 결과를 이 행에 적어 닫는다 |
| 24 | **GitHub 머지 박스의 표시 ⚠️ 미확인.** GitHub 문서는 admin 이 required check 를 우회해 머지하는 체크박스의 문구도, required check 옆의 "Required" 표시도 적지 않는다 (`about-protected-branches`, `merging-a-pull-request`, WebFetch 2026-11-27). 그리고 **글자 한 개 변경이 Chromatic diff 를 내는지** 미확인이다. Chromatic 은 기본으로 anti-aliasing 픽셀을 무시한다 (비평 M3 의 3) | §5 Chromatic 4 의 P 또는 6 의 (가) 에서 체크박스의 실제 문구와 Required 표시 유무를 PR 댓글에 적는다. 문구가 달라도 "켜면 머지 버튼이 열린다" 가 보이면 통과다. 체크박스가 아예 없으면 탈출구가 없는 것이라 §6-8 의 대응이 성립하지 않는다. 그때는 머지하지 않고 사람에게 보고한다. 글자 한 개 diff 는 (가) 의 `Spacing` 변경으로 확정한다. (나) 를 골랐으면 Step 8 이슈 4 가 확정한다 |
| 25 | **협업자 전원이 admin 이라 게이트는 의도적 bypass 로 풀린다** (`gh api`, 2026-11-27, 비평 M1) | 측정으로 안 풀린다. 사람 결정이다 (Step 0-4 표의 "협업자 권한"). 전원 admin 을 유지하면 §1 의 범위 (2) 가 그대로다. 일부를 `write` 로 내리면 그 계정에서 bypass 체크박스가 없는지 §5 Chromatic 4 로 본다. 어느 쪽이든 bypass 머지는 Step 8 이슈 3 에 남긴다 (§6-8) |
| 26 | **`OPACITY` 9값의 변경은 강제로 사람 눈에 오르지 않는다.** 팔레트에 없고 (§2), plan 1 Step 4 의 3번은 11값 중 `"14"`, `"100"` 과 범위 0..1 만 고정한다. `LAYOUT` 은 plan 1 Step 4 의 7번이 전체 고정이라 해당하지 않는다. 그 테스트도 CI 에서 강제되지 않는다 (§6-22) | 남는 장치는 SHA 갱신 PR 의 diff 를 사람이 읽는 것이다 (plan 1 Step 6 의 4번 끝 "값이 바뀐 사실과 이유를 PR diff 에서 사람이 본다"). `OPACITY` 를 쓰는 첫 컴포넌트가 오면 그 컴포넌트의 스냅샷이 값을 보이게 하는지, 또는 `Opacity` story 를 더할지 그 계획에서 정한다 |

**비평 반영 (4회차).** `docs/ai/plan-critique/storybook-chromatic.md` (rounds 3) 의 Critical 1, Major 3, Minor 4 를 전부 반영했다. 위치는 파일 머리의 개정 기록 4행이다. 제안과 다르게 반영한 곳이 둘이다. (1) C1 의 임시 PR 을 **draft 가 아닌 PR** 로 바꿨다. draft PR 은 머지할 수 없어 [^gh-draft] 막힘의 원인을 required check 와 구별하지 못한다. (2) M2 의 문구를 스택 행이 아니라 `quizly-app-conventions/SKILL.md` 의 "태블릿에서 폰으로" 표에 넣고, `CLAUDE.md` 에는 넣지 않았다. 이유는 Step 7 의 그 행이다. 비평의 "확인한 것" (a) 에서 (d) 는 이 회차에서 바뀌지 않았다. 반영하지 않은 지적은 없다.

**비평 반영 (3회차).** `docs/ai/plan-critique/storybook-chromatic.md` (rounds 2) 의 Minor 5건을 전부 반영했다. m1 과 m2 는 §5 자동 7 의 검사식과 음성 대조로, m3 은 Step 0-4 의 appid 칸으로 반영했다. m4 와 m5 는 지적 대상이던 2회차 Step 3 "읽은 값" 표가 Step 0-5 의 결정으로 이 PR 에서 사라져서, 그 표를 다시 만들 때의 규칙으로 §6-1 에 옮겼다. 반영하지 않은 지적은 없다. 2회차 §6-12 (stories 0개 빌드) 와 §6-13 (금지 사항과의 충돌) 은 Step 0-2 의 사람 결정으로 닫혀 표에서 뺐다. §6 의 번호는 3회차에서 다시 매겼다.

### 근거 URL (2026-11-27 확인)

[^hb]: https://storybook.js.org/tutorials/visual-testing-handbook/react/ko/introduction/ 컴포넌트 탐색기로 UI 를 격리하고 상태마다 story 로 저장한 뒤, 커밋마다 이미지 스냅샷을 승인된 기준 이미지와 비교한다. "이는 사람 눈의 정확성과 기계의 효율성을 합친 실용적인 접근법입니다." 장 순서는 소개, 컴포넌트 탐색기, 작업 흐름, 시각적 TDD, 자동화, 마무리다. 마무리 장에 이 번역본이 최신 Storybook 버전으로 갱신되지 않았다는 안내가 있다. 그래서 흐름은 핸드북을, 명령과 버전은 현재 공식 문서를 따른다
[^hb-explorer]: https://storybook.js.org/tutorials/visual-testing-handbook/react/ko/component-explorers/ "컴포넌트 탐색기는 비즈니스 로직과 애플리케이션 context로부터 UI문제를 분리합니다", "진정한 협업을 위해서는 이해관계자가 UI를 살펴보아야 합니다"
[^hb-auto]: https://storybook.js.org/tutorials/visual-testing-handbook/react/ko/automate/ "프로젝트에 개발 패키지로 크로마틱을 추가합니다" (`yarn add -D chromatic`), 로컬 실행 `yarn chromatic --project-token=<project-token>`, CI 는 "이 튜토리얼에서는 설정하지 않지만", PR checks 의 "🟡 UI Test", "의도적으로 변경한 경우에는 스냅샷을 받아들여 기준선을 업데이트합니다", "의도하지 않은 변경이라면 고쳐야 합니다", "버그가 수정되고 기준선이 최신 상태가 되면, 코드를 target 브랜치로 다시 merge할 수 있습니다". 브랜치 보호, required check, TurboSnap, CI YAML 언급 없음
[^ci]: https://www.chromatic.com/docs/ci/ "By default, you'll see UI Tests and Storybook Publish. If you enabled UI Review you'll also see a check for it.", "GitHub, Bitbucket, or GitLab projects that are linked to a repository get this feature out of the box.", "Configure CI to run your visual tests whenever you push code"
[^mandatory]: https://www.chromatic.com/docs/mandatory-pr-checks/ GitHub 절차(Settings, Branches, Add rule, Require status checks to pass before merging, 검색 예 "Chromatic, UI Test, UI Review"). "The UI Tests check is the merge gate, not the CI job", `exitZeroOnChanges` 일 때 "require the UI Tests check in your Git provider rather than relying on the CI job". 시각 변경은 "Pending: blocks merging until someone reviews and approves the changes", 스냅샷 한도 소진은 "Pending: the build can't complete, so no status is sent", Chromatic 단계를 건너뛰면 "Pending indefinitely: if Chromatic never runs, it never reports a status"
[^baselines]: https://www.chromatic.com/docs/branching-and-baselines/ "Baselines only update when changes are accepted by you or your team", 새 story 는 baseline 계산에서 빠지고 Accept 해야 baseline 이 된다, ancestor build 는 "the most recent ancestor (commit) in the git history that has had Chromatic run against it", squash/rebase 머지는 "we'll use the accepted baselines of the most recent commit on the head branch of the PR"
[^modes]: https://www.chromatic.com/docs/modes/ "Chromatic treats each mode as an individual entity, with its own unique baselines and specific approvals", 원래 baseline 을 유지하며 mode 를 더하는 예 `'1200px': { viewport: 1200 }`, mode 이름을 바꾸면 새 baseline
[^snap]: https://www.chromatic.com/docs/snapshots/ "takes a screenshot and crops it to the dimensions of the UI". viewport 보다 긴 내용의 처리와 스크롤바 언급 없음
[^cli-onboard]: https://github.com/chromaui/chromatic-cli/blob/a89d8bd/.agents/skills/verify-chromatic-cli/features/publish-build.md (main `a89d8bd`, 2026-11-25). 51행 "A brand-new project is in onboarding mode, with `.isOnboarding: true` in diagnostics. stdout says `Continue setup at https://www.chromatic.com/setup?appId=…` instead of `View build details at …`. Build 1 is `auto-accepted`". 38행 "`Build <N> auto-accepted` (first build), `Build <N> completed` (pending changes) or `Build <N> passed!` (no changes)". 공식 문서가 아니라 CLI 저장소의 검증 절차 문서다
[^gh-bpm]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule "click **Add classic branch protection rule**", "Under "Branch name pattern", type the branch name", "Select **Require status checks to pass before merging**", "In the search field, search for status checks", "Optionally, select **Do not allow bypassing the above settings**", "Click **Create**". 대안으로 rulesets 를 안내한다
[^gh-rs]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets "When you create a ruleset, you can allow certain users to bypass the rules in the ruleset", bypass 는 repository administrator 같은 역할, 팀, GitHub App 에 준다. admin 기본 면제 문장 없음. branch protection rule 과 "work alongside each other, and all applicable rules are enforced", 겹치면 "the most restrictive version of the rule applies"
[^gh-draft]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests "Draft pull requests cannot be merged"
[^gh-bp]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches "Required status checks must have a successful, skipped, or neutral status", "you can select an app that has recently set this check as the expected source of status updates", 기본값에서 보호 규칙은 admin 에게 적용되지 않고 "Do not allow bypassing the above settings" 로 바꾼다
[^rn]: https://www.chromatic.com/docs/react-native/ "Chromatic captures snapshots in the iOS Simulator on hosted macOS and the Android Emulator on hosted Linux". React Native for Storybook v9 이상 필요. FAQ 에 dark mode, locale, viewport modes 가 modes API 로 아직 지원되지 않고 TurboSnap 도 "Not yet". 상태 표기(GA, beta)는 페이지에 없다
[^rnci]: https://www.chromatic.com/docs/react-native/ci/ iOS 빌드 `macos-latest`, Android 빌드 `ubuntu-latest`, 업로드 잡 분리
[^rnw]: https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite 요구 RN 0.72 이상, RN Web 0.19 이상, Vite 5 이상. Expo 언급 없음. 설치 시 "Both" 를 권한다
[^rnsetup]: https://storybookjs.github.io/react-native/docs/intro/getting-started/manual-setup/ 설치 목록에 async-storage, safe-area-context, reanimated, gesture-handler, `@gorhom/bottom-sheet`, `react-native-svg`
[^rnrouter]: https://storybookjs.github.io/react-native/docs/intro/getting-started/expo-router/ `metro.config.js` 의 `withStorybook`, `app/storybook.tsx` 라우트, `Stack.Protected` 로 프로덕션 제외
[^vp]: https://www.chromatic.com/docs/modes/viewports/ "Chromatic defaults to a viewport of width 1200px and height 900px", 정수 폭 200 에서 2560, "If no height is specified, Chromatic will capture a snapshot based on the intrinsic height of the root container", 전역 modes 에 대해 "We don't recommend this in most cases because each viewport is treated independently and snapshots must be approved as such", mode 마다 별도 스냅샷과 베이스라인. 스크롤바 언급 없음
[^perm]: https://www.chromatic.com/docs/permalinks/ `https://<branch>--<appid>.chromatic.com`, 지원하지 않는 문자는 대시로 바뀐다, 공개면 "anyone with a link", 비공개면 collaborator 로그인
[^figma]: https://www.chromatic.com/docs/figma-plugin/ Figma 편집자 권한, Chromatic collaborator, Chromatic 에 게시된 story URL 필요. React Native 언급 없음
[^gha]: https://www.chromatic.com/docs/github-actions/ "Our recommendation is to run Chromatic's step on `push` events", `pull_request` 의 베이스라인 유실 가능성, "Forked repositories will not have access to them", 토큰 재발급, "By default, Chromatic exits with code `0` if changes are detected", TurboSnap 은 기본적으로 "relies on webpack's dependency graph", squash/rebase 와 `autoAcceptChanges`, "the GitHub Action typically auto-upgrades to the latest version"
[^review]: https://www.chromatic.com/docs/review/ UI Review 는 PR 에 묶이고 GitHub app 과 CI 가 필요. 연결 프로젝트는 권한 동기화, 미연결은 초대 코드
[^billing]: https://www.chromatic.com/docs/billing/ `visual snapshots = Tests x Builds x Browsers x Modes`, 5,000 소진 시 일시 정지, TurboSnap 복사본 0.2. RN 과금 언급 없음
[^pricing]: https://www.chromatic.com/pricing Free 월 5,000 billed snapshots, "Test on Chrome"

### 이 계획에서 조사하지 못한 것

- ⚠️ Storybook 을 이 레포에 실제로 설치해 빌드해 보지 않았다. 코드를 고치지 않는 단계라서다. peer 대조와 preset 소스 읽기까지가 확인 범위다. 첫 실측은 Step 4 다
- ⚠️ plan 1 이 머지된 뒤의 `theme.ts` 를 보지 못했다. 아직 없다. Step 4 는 plan 1 5회차 Step 3 (`docs/ai/plan/1.md` 153~170행) 의 모양을 전제한다 (§6-2)
- ⚠️ Chromatic 이 이 레포에서 올리는 체크의 실제 표시 이름, 첫 빌드 직후 required check 로 고를 수 있는지, 키 큰 스냅샷이 잘리는지는 첫 빌드 전에는 알 수 없다 (§6-12, §6-13)
- ⚠️ Chromatic onboarding 모드를 이 레포에서 겪어 보지 않았다. 근거는 CLI 저장소의 검증 문서 하나다 (§6-23)
- ⚠️ GitHub 머지 박스의 bypass 체크박스 문구와 Required 표시를 문서에서 찾지 못했다 (§6-24)
- 피그마 파일 이름은 레포 문서에 없다. 이 PR 은 피그마 파일을 가리킬 필요가 없도록 썼다
