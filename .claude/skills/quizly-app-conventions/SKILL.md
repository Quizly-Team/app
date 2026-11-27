---
name: quizly-app-conventions
description: >
  quizly app(Expo/React Native 태블릿 우선 학습 앱)의 코드 컨벤션과 금지 사항. 디렉터리
  구조와 의존 규칙, 디자인 토큰 생성물 취급, 태블릿에서 폰으로 줄이는 레이아웃 규칙,
  TypeScript 규칙, 라이브러리 추가 기준, 검증 게이트를 다룬다.
  사용할 때 - 이 저장소의 코드를 쓰거나 고치거나 리뷰할 때, 파일을 어디에 둘지 정할 때,
  스타일을 입힐 때, 라이브러리를 고를 때, "이렇게 해도 되나" 를 판단할 때.
  서버 계약은 quizly-be-contract 를 본다.
---

# quizly-app-conventions

## 스택

| 구분 | 값 |
| --- | --- |
| 런타임 | Expo SDK 58, React Native 0.88, React 19.3 |
| 언어 | TypeScript `strict` |
| 라우팅 | expo-router (파일 기반, `src/app/`) |
| 서버 상태 | TanStack Query (첫 API 호출이 생길 때 도입) |
| 클라 상태 | **없다.** 전역 클라 상태가 실제로 생길 때 Zustand |
| 스타일 | `StyleSheet` + `src/shared/constants/theme.ts` 상수 |
| Lint | oxlint |
| Format | oxfmt (설정은 `.oxfmtrc.json`, `docs/**` 제외) |
| 테스트 | vitest (순수 함수 전용) |
| 플랫폼 | **iOS 와 Android 한 코드.** 출시만 Android 먼저 |

**NativeWind 를 쓰지 않는다.** 안정판 `4.2.7` 의 peerDependencies 가 `{tailwindcss: ">3.3.0"}` 하나뿐이라 Expo 58 과 RN 0.88 조합을 보장하지 않는다. `5.0.0-rc.1` 은 아직 RC 다. 같은 조직의 `if_ent_app` 이 그 RC 에서 밟은 함정 두 개가 **둘 다 빌드는 통과하고 화면만 조용히 비는** 형태로 실패했다. 나중에 누가 다시 꺼내려면 안정판 peer 를 먼저 확인한다.

## 구조

```
src/app/            expo-router. 라우팅과 화면만. 비즈니스 로직 금지
src/features/       기능 단위 모듈
src/shared/
  layout/           브레이크포인트
  constants/        theme.ts (생성물)
  api/ lib/ ui/
docs/ai/            설계와 파이프라인 산출물. 코드와 같은 커밋에 넣는다
```

디렉터리는 **코드가 들어갈 때 만든다.** 빈 폴더를 미리 두지 않는다.

### 의존 규칙

- `app/` to `features/` to `shared/` 단방향. feature 간 직접 import 금지. 공유가 필요하면 `shared/` 로 올린다
- barrel export(`index.ts`) 쓰지 않는다
- **순수 로직은 `react-native` 를 import 하지 않는 모듈에 둔다.** vitest 가 RN 의 Flow 소스를 파싱하지 못해서 테스트가 통째로 실패한다. `src/shared/layout/` 이 그 분리의 예다. `breakpoint.ts` 는 순수하고 `useBreakpoint.ts` 만 RN 을 import 한다

## 디자인 토큰

**`src/shared/constants/theme.ts` 는 자동 생성물이다. 직접 수정하지 않는다.**

| 항목 | 값 |
| --- | --- |
| 단일 소스 | `Quizly-Team/frontend` 의 `dev` 브랜치 `tokens/tokens.json` (Tokens Studio, DTCG) |
| 디자이너 경로 | 피그마에서 웹 레포 `design-tokens` 브랜치로 Push. **웹 레포로만 Push 한다** |
| 앱 갱신 | `npm run tokens:build`. 수동이다. 크로스 레포 CI 를 만들지 않는다 |
| 금지 | 색, 간격, 라운딩, 글자 크기를 `theme.ts` 밖에 하드코딩하는 것 |

⚠️ **미해결.** `layout.touch-min` 이 40 인데 Apple HIG 는 44pt, Material 은 48dp 를 요구한다. 설계 문서 5.4.1 이 디자이너 확인 항목으로 올려둔 상태다. `theme.test.ts` 가 이걸 막고 있다. **테스트를 고쳐서 통과시키지 않는다.** 토큰을 올리는 게 해결이다.

## 태블릿에서 폰으로

기준 사이즈는 **태블릿**이고 폰은 축소판이다. 이 저장소에서 가장 자주 날 사고가 여기서 난다.

| 규칙 | 내용 |
| --- | --- |
| 브레이크포인트 | **1개만.** `useBreakpoint()` 가 `'phone' | 'tablet'` 을 준다. 화면마다 `useWindowDimensions` 로 직접 분기하지 않는다 |
| 간격 | 고정 px 금지. `theme.ts` 의 스케일에서만 꺼낸다 |
| 2단에서 1단 | **한 컴포넌트 안에서** 전환한다. 화면을 두 벌 만들지 않는다 |
| 터치 타겟 | 누를 수 있는 요소는 `minHeight` 와 `minWidth` 를 `theme.ts` 의 터치 최소값으로 준다 |

허용하는 형태는 이렇다.

```tsx
const bp = useBreakpoint();
const columns = bp === "tablet" ? 2 : 1;
```

금지하는 형태는 이렇다.

```tsx
// 한 번 갈라지면 이후 모든 변경이 두 배가 된다
return bp === "tablet" ? <TabletHome /> : <PhoneHome />;
```

참고용 레이아웃 토큰이 있다. `content-max 1200`, `readable-max 840`, `panel 420`. `panel` 은 디자이너가 "2단 화면 오른쪽 고정 패널 폭" 으로 정의했다.

## TypeScript

- `any` 금지. `unknown` + 타입 가드
- `interface` 기본, `type` 은 유니온/인터섹션/유틸리티에만
- Non-null assertion(`!`) 금지. `?.` 와 `??` 를 쓴다
- `enum` 대신 `as const` 객체
- **서버 응답은 타입을 정의한 뒤 쓴다.** 제네릭이 실제 응답 모양과 다르면 컴파일되고 런타임에 깨진다. 기존 웹에서 반복된 버그라 여기 적는다

## 컴포넌트

- 함수 컴포넌트, 화살표 또는 함수 선언. `export default` 는 expo-router 파일에서만
- 스타일은 `StyleSheet.create`. 인라인 객체를 렌더마다 새로 만들지 않는다
- 비즈니스 로직은 훅으로 분리한다. 컴포넌트는 렌더링만
- 컴포넌트 안에 컴포넌트를 중첩 정의하지 않는다
- **플랫폼별로 화면을 가르지 않는다.** `.ios.tsx` / `.android.tsx` 는 쓰지 않는다

## 라이브러리 추가

RN 0.76 부터 New Architecture(JSI, Fabric, TurboModules)가 기본이고 **브릿지는 제거됐다.** 흔히 인용되는 "JS 브릿지로 네이티브를 호출한다" 는 그 이전 구조다.

| 상황 | 대응 |
| --- | --- |
| New Architecture 지원 | 그대로 쓴다 |
| 미지원 | interop layer 로 돌아갈 수는 있지만 성능과 수명이 불확실하다. **다른 라이브러리를 찾는다** |
| 대안 없음 | 그 기능을 범위에서 뺄지 사람이 판단한다. 조용히 interop 으로 가지 않는다 |

확인 경로는 React Native Directory 의 New Architecture 배지와 각 라이브러리 README 다. `planner` 가 새 라이브러리를 계획에 넣을 때 §4 에 확인 결과를 적는다.

## 네이밍

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 폴더 | 소문자 또는 kebab-case | `layout`, `mock-exam` |
| 라우트 파일 | kebab-case | `mock-exam.tsx` |
| 컴포넌트 파일 | PascalCase | `QuizCard.tsx` |
| 훅 파일 | `use{Feature}` | `useBreakpoint.ts` |
| 그 외 | camelCase + 역할 접미사 | `quiz.api.ts`, `auth.store.ts` |
| 상수 | UPPER_SNAKE_CASE | `TABLET_MIN_WIDTH` |
| Boolean | `is` / `has` / `can` / `should` | `isSubmitted` |
| 핸들러 | `handle{Event}` | `handleSubmit` |

## 금지 사항

| 금지 | 이유 |
| --- | --- |
| `theme.ts` 직접 수정 | 생성물이다. 다음 `tokens:build` 에 날아간다 |
| 화면을 태블릿용과 폰용 두 벌로 만들기 | 이후 모든 변경이 두 배가 된다 |
| `.ios.tsx` / `.android.tsx` 로 화면 가르기 | "한 코드로 둘 다" 가 깨진다 |
| 401 재발급 로직을 여러 곳에 두기 | 기존 웹이 3곳에 중복시켜 기술부채가 됐다. 한 곳에만 둔다 |
| 설치만 하고 안 쓰는 의존성 | 기존 웹의 zustand, chart.js 가 그랬다. 쓸 때 넣는다 |
| 실패를 조용히 삼키는 것 | catch 하고 아무것도 안 하거나 빈 값이면 return 하는 코드 |
| 하드코딩된 키와 토큰 | public 레포다 |
| `console.log` 커밋 | |
| 매직 넘버 | 임계값은 상수 파일 한 곳에 |
| `git add -A` | 워크트리 심볼릭 링크를 커밋해 CI 가 죽은 전례가 있다 |

## 검증

| 명령 | 내용 |
| --- | --- |
| `.claude/scripts/check-gate.sh` | typecheck + lint + test + format. **절대 0건.** 베이스라인 없음 |
| `.claude/scripts/check-gate.sh --fix` | 포맷만 고치고 나머지는 검사 |
| `npm run android` / `npm run ios` | 네이티브 빌드와 설치 |

네이티브 패키지 추가/제거, `app.json` 의 권한/플러그인/방향 변경 시 리빌드가 필요하다. JS/TS 만 고쳤으면 불필요하다.

## 작업 흐름

**예외 없이 이슈 to 브랜치 to PR 이다.**

| 단계 | 규칙 |
| --- | --- |
| 이슈 | 먼저 만든다. 제목은 **명사형 어미** (`fix: Completed 제거`). 서술형 `~다` 금지 |
| 브랜치 | `feat/#<번호>`, `fix/#<번호>` |
| PR | **base 는 `dev`.** 본문에 `Closes #<번호>`. 결론만 간결하게, 긴 근거는 `docs/ai/` 로 빼고 링크 |
| 커밋 | **제목만.** 본문, `Co-Authored-By`, AI 서명 전부 금지 |
| `docs/ai/**` | 코드와 **같은 커밋**에 넣는다 |

작업 중 발견한 별개 버그도 즉시 이슈화한다.

### 커밋 타입

`feat` `fix` `bug` `refactor` `style` `docs` `test` `chore` `build` `perf`

`style` 은 **CSS 와 스타일 전용**이다. 포매팅 변경이 아니다. `fix` 와 `bug` 는 별개다.

## 산문

한국어. 식별자와 경로는 영어. `—` 와 `·` 는 쓰지 않는다.
