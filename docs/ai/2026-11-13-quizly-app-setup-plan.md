# Quizly 앱 초기 세팅 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `Quizly-Team/app` 레포를 만들고 Expo RN 프로젝트와 rh 하네스를 세워, 첫 기능 이슈를 받을 수 있는 상태로 만든다.

**Architecture:** 한 코드베이스에서 iOS 와 Android 를 빌드한다. 화면은 `src/app/`(expo-router), 공유 코드는 `src/shared/`. 스타일은 `StyleSheet` + 상수 스케일이고 태블릿과 폰은 브레이크포인트 1개로 갈린다. 개발 작업은 `.claude/` 에 커밋된 rh 파이프라인(Plan 비평 to 사람 승인 to Implement 비평 to QA)이 조율한다.

**Tech Stack:** Expo SDK 58.0.25, React Native 0.88.1, React 19, TypeScript strict, expo-router, TanStack Query, oxlint, oxfmt, vitest

**Spec:** `docs/ai/2026-11-13-quizly-app-setup-design.md`

## 실행 결과 (2026-11-13)

| 태스크 | 상태 | 커밋 |
| --- | --- | --- |
| 1. 레포 생성과 Expo 스캐폴드 | 완료 | `chore: Expo 프로젝트 스캐폴드와 설계 문서 추가` |
| 2. 검증 게이트와 첫 테스트 | 완료 | `chore: 검증 게이트와 브레이크포인트 추가` |
| 3. 토큰 변환과 3환경 레이아웃 | **보류.** 디자이너 확인 대기 | - |
| 4. rh 하네스 이식 | 완료 | `chore: rh 하네스 이식` |
| 5. 웹 레포 CLAUDE.md 정정 | 완료 | `Quizly-Team/frontend` PR #135 (Closes #134) |

### 계획과 실제가 달랐던 것

| 항목 | 계획 | 실제 |
| --- | --- | --- |
| 라우트 위치 | Task 1 Step 2 에서 `app/` 을 `src/app/` 으로 옮긴다 | `create-expo-app` 의 `default` 템플릿이 **이미 `src/app/`** 을 쓴다. 이동 불필요 |
| 브레이크포인트 모듈 | `breakpoint.ts` 한 파일에 순수 함수와 훅 | **모듈을 나눠야 했다.** 한 파일에 두면 테스트가 `react-native` 를 끌어와 vitest 가 RN 의 Flow 소스 파싱에 실패한다. 함수 분리로는 부족하고 import 그래프를 끊어야 한다. `breakpoint.ts`(순수) + `useBreakpoint.ts`(RN) |
| oxfmt | 설정 없이 쓴다 | `.oxfmtrc.json` 의 `ignorePatterns` 에 `docs/**` 와 `.claude/**` 를 넣었다. 안 넣으면 한국어 표가 든 문서를 재포맷한다 |
| 앱 식별자 | 언급 없음 | 템플릿 기본값이 `app` 이라 `slug`/`scheme` 을 `quizly`, Android 패키지를 `kr.co.quizly.app` 으로 바꿨다. `slug` 는 나중에 바꾸면 EAS 연결이 깨진다 |
| iOS 지원 | 언급 없음 | `ios.supportsTablet` 은 **미설정이면 false** 다 (`@expo/config-plugins` 의 `getSupportsTablet` 이 `!!config.ios?.supportsTablet`). 태블릿 우선 제품이라 켰다 |
| 아이콘과 스플래시 | 범위 밖 | 템플릿의 Expo 브랜딩 에셋을 지우면서 `app.json` 의 참조도 같이 지웠다. 디자인 수령 후 다시 넣는다 |

### 실행하며 새로 실측한 것

| 항목 | 값 |
| --- | --- |
| 스캐폴드 버전 | Expo `58.0.25`, RN `0.88.1`, React `19.3.0`, TypeScript `6.0.3` |
| New Architecture | **켜져 있다.** logcat 에 `Running "main" with {... "fabric":true}` |
| Android 태블릿 AVD | `ifent_tab_a15` (Android 15). 빌드와 설치 확인 |
| Android 폰 AVD | **없다.** Task 3 의 폰 검증에 선행 조건 |
| iOS 시뮬레이터 | Xcode 27.2 설치됨, **런타임 0개.** `xcodebuild -downloadPlatform iOS` 선행 필요 |
| 백엔드 응답 | ⚠️ **성공은 DTO 직접, 에러만 봉투.** 균일한 봉투를 가정하면 깨진다 |
| 토큰 레이아웃 값 | `touch-min 40`, `content-max 1200`, `readable-max 840`, `panel 420`. 브레이크포인트 토큰은 없다 |

### 남은 미결

1. **`layout.touch-min` 40 대 플랫폼 하한 44.** 디자이너가 토큰을 올려야 한다 (설계 5.4.1)
2. 태블릿과 폰 브레이크포인트 확정값. 잠정 768
3. 신규 디자인이 기존 토큰 세트를 그대로 쓰는지
4. 백엔드 `/v3/api-docs` 를 인증 예외로 열기 (서버 변경 요청)
5. Apple Developer 계정 결제 시점
6. 기존 웹 트래픽 규모 (랜딩 전환 시점 근거)

## Global Constraints

모든 태스크의 요구사항에 아래가 암묵적으로 포함된다. 값은 설계 문서에서 그대로 가져왔다.

| 항목 | 값 |
|---|---|
| 런타임 | Expo SDK `58.0.25`, React Native `0.88.1`, React 19. 로컬 Node `v22.23.4` |
| 언어 | TypeScript `strict` |
| 스타일 | `StyleSheet` + 상수 스케일. **NativeWind 미채택** (설계 5.3 실측 결과) |
| 디자인 토큰 | 웹 레포(`Quizly-Team/frontend` `dev` 브랜치)의 `tokens/tokens.json` 이 **단일 소스**다. 앱은 그걸 받아 `theme.ts` 를 생성한다 (설계 5.4) |
| 브레이크포인트 | **1개.** 폰과 태블릿. 잠정 `768`. 화면마다 `useWindowDimensions` 로 분기 금지 |
| 간격 | 고정 px 금지. 상수 스케일에서만 꺼낸다 |
| 터치 타겟 | ⚠️ 토큰은 `40`, 설계는 `44`. **미해결** (설계 5.4.1). 확정 전까지 `44` 를 바닥으로 쓴다 |
| 클라 상태 | 라이브러리를 넣지 않는다. 전역 클라 상태가 실제로 생길 때 Zustand |
| 서버 상태 | TanStack Query 를 **이 계획에서 설치하지 않는다.** 첫 API 호출이 생기는 작업에서 넣는다. 기존 웹이 zustand 를 설치만 하고 방치한 전례를 반복하지 않는다 |
| 라이브러리 추가 기준 | New Architecture 지원 여부를 확인한다. 미지원이면 interop 으로 우회하지 말고 다른 라이브러리를 찾는다 |
| 레포 | `Quizly-Team/app`, public. `main` + `dev` 2단. **PR base 는 `dev`** |
| `.claude/` | **커밋한다.** `.gitignore` 에 넣지 않는다 |
| `docs/ai/**` | 코드와 같은 커밋에 넣는다 |
| 커밋 | 제목만. 본문, `Co-Authored-By`, AI 서명 전부 금지 |
| 이슈/PR 제목 | 명사형 어미 (`fix: Completed 제거`). 서술형 `~다` 금지 |
| TypeScript | `any` 금지, non-null assertion(`!`) 금지, `enum` 대신 `as const` |
| 구조 | barrel export(`index.ts`) 금지. 디렉터리는 **코드가 들어갈 때 만든다** |
| 산문 | 한국어. 식별자와 경로는 영어. `—` 와 `·` 는 쓰지 않는다 |

## Review Focus

설계가 함의하지만 각 태스크의 주 산출물이 저절로 덮지 않는 것들이다. 각 줄의 테스트를 담당 태스크에 넣었다.

1. **`vitest` 는 테스트 파일이 0개면 exit 1 이다.** 신규 레포라 게이트가 첫 실행부터 FAIL 한다. `--passWithNoTests` 로 덮으면 테스트 설정이 깨져도 영구히 통과한다. → Task 2 가 게이트와 첫 실제 테스트를 같은 태스크에 묶는다
2. **브레이크포인트 임계 폭에서 정확히 어느 쪽인가.** 경계값이 미정의면 특정 태블릿 해상도에서 레이아웃이 요동한다. → Task 2 경계값 테스트
3. **`.claude/` 가 `.gitignore` 에 들어가 하네스가 사라지는 것.** 기존 `frontend` 레포에서 커밋 `7502eb7` 로 실제 일어났다 (설계 Anti-goal 2). → Task 1 검증 스텝
4. **`create-expo-app` 이 `AGENTS.md` 와 `.claude/settings.json` 을 생성한다.** 우리 하네스 `.claude/` 와 겹치고 지침이 두 곳으로 갈린다. → Task 1 이 `--no-agents-md` 를 쓴다
5. **하네스는 세션 시작 시점에 등록된다.** 상위 폴더에서 세션을 시작하면 에이전트가 `not found` 로 뜨고 통째로 안 걸린다. → Task 4 검증 스텝

---

## 파일 구조

| 경로 | 책임 |
|---|---|
| `src/app/_layout.tsx`, `src/app/index.tsx` | expo-router 루트와 첫 화면. 라우팅과 렌더링만 |
| `src/shared/layout/breakpoint.ts` | 폭에서 브레이크포인트를 정하는 순수 함수 + 훅 |
| `src/shared/layout/breakpoint.test.ts` | 위 순수 함수의 경계값 테스트 |
| `src/shared/constants/theme.ts` | 색, 간격 스케일, 라운딩, 터치 타겟 최소값. 디자인 단일 소스 |
| `src/shared/constants/theme.test.ts` | 설계가 못 박은 값(터치 타겟 44 등) 고정 |
| `.claude/agents/*.md` | 에이전트 6 |
| `.claude/skills/*/SKILL.md` | 스킬 6 |
| `.claude/scripts/check-gate.sh` | 검증 게이트 |
| `CLAUDE.md` | 하네스 호출 조건, 스택, 금지 사항, 변경 이력 |
| `docs/ai/` | 설계 문서와 이 계획, 이후 파이프라인 산출물 |

---

### Task 1: 레포 생성과 Expo 스캐폴드

**Files:**
- Create: 레포 `Quizly-Team/app` 전체
- Create: `docs/ai/2026-11-13-quizly-app-setup-design.md`, `docs/ai/2026-11-13-quizly-app-setup-plan.md`

**Interfaces:**
- Produces: `~/Desktop/app/` 작업 폴더, `main` 과 `dev` 브랜치, `src/app/_layout.tsx` 와 `src/app/index.tsx` 라우트, `package.json` 의 `expo` `~58.0.x`

- [ ] **Step 1: Expo 프로젝트 생성**

```bash
cd ~/Desktop
npx create-expo-app@latest app --template default --no-agents-md
```

`--no-agents-md` 는 Review Focus 4 다. 생략하면 `AGENTS.md` 와 `.claude/settings.json` 이 생겨 하네스 지침이 두 곳으로 갈린다.

- [ ] **Step 2: 라우트를 `src/app/` 으로 옮기고 데모 화면 제거**

`default` 템플릿은 루트 `app/` 에 탭 데모를 깐다. 폴더를 `src/app/` 으로 옮기고, 남기는 파일은 `_layout.tsx` 와 `index.tsx` 둘뿐이다. 나머지 데모 화면, 데모 컴포넌트, 데모 훅, 데모 상수는 지운다. `index.tsx` 는 텍스트 한 줄만 렌더링한다.

- [ ] **Step 3: 빌드가 되는지 확인**

Run: `cd ~/Desktop/app && npx expo run:android`
Expected: 에뮬레이터에 Step 2 의 텍스트 한 줄이 뜬다

- [ ] **Step 4: 레포 생성과 `dev` 브랜치**

```bash
cd ~/Desktop/app
gh repo create Quizly-Team/app --public --source=. --remote=origin --push
git push -u origin main:dev
gh repo edit Quizly-Team/app --default-branch main
```

- [ ] **Step 5: `.claude/` 가 무시되지 않는지 확인**

Run: `git check-ignore -v .claude ; echo "exit=$?"`
Expected: 출력 없음, `exit=1`. 즉 무시 대상이 아니다. `exit=0` 이면 `.gitignore` 에서 해당 줄을 지운다 (Review Focus 3)

- [ ] **Step 6: 설계 문서와 계획을 레포로 옮기고 커밋**

```bash
mkdir -p docs/ai
mv ~/Desktop/2026-11-13-quizly-app-setup-design.md ~/Desktop/2026-11-13-quizly-app-setup-plan.md docs/ai/
git add -A
git commit -m "chore: Expo 프로젝트 스캐폴드와 설계 문서 추가"
git push
```

⚠️ `git add -A` 는 이 레포가 비어 있는 첫 커밋에서만 쓴다. 이후에는 쓰지 않는다 (워크트리 심볼릭 링크를 커밋해 CI 가 죽은 전례가 있다).

---

### Task 2: 검증 게이트와 첫 테스트

게이트와 첫 테스트를 한 태스크로 묶는다. `vitest` 는 테스트 파일이 0개면 exit 1 이라 게이트만 먼저 넣으면 첫 실행부터 FAIL 한다 (Review Focus 1).

**Files:**
- Create: `src/shared/layout/breakpoint.ts`, `src/shared/layout/breakpoint.test.ts`, `.claude/scripts/check-gate.sh`
- Modify: `package.json` (scripts, devDependencies), `tsconfig.json` (strict)

**Interfaces:**
- Produces: `resolveBreakpoint(width: number): Breakpoint`, `useBreakpoint(): Breakpoint`, `type Breakpoint = 'phone' | 'tablet'`, `TABLET_MIN_WIDTH = 768`
- Produces: `npm run typecheck`, `npm run lint`, `npm test`, `npm run format`, `npm run format:check`, `.claude/scripts/check-gate.sh`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/shared/layout/breakpoint.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { resolveBreakpoint, TABLET_MIN_WIDTH } from './breakpoint'

describe('resolveBreakpoint', () => {
  it('임계 폭 미만은 phone 이다', () => {
    expect(resolveBreakpoint(TABLET_MIN_WIDTH - 1)).toBe('phone')
  })

  it('임계 폭과 같으면 tablet 이다', () => {
    expect(resolveBreakpoint(TABLET_MIN_WIDTH)).toBe('tablet')
  })

  it('임계 폭 초과는 tablet 이다', () => {
    expect(resolveBreakpoint(TABLET_MIN_WIDTH + 1)).toBe('tablet')
  })

  it('임계 폭은 768 이다', () => {
    expect(TABLET_MIN_WIDTH).toBe(768)
  })
})
```

경계가 `>=` 라는 것을 테스트가 못 박는다 (Review Focus 2).

- [ ] **Step 2: 테스트가 실패하는 것 확인**

Run: `npm i -D vitest && npx vitest run src/shared/layout/breakpoint.test.ts`
Expected: FAIL. `breakpoint` 모듈을 못 찾는다

- [ ] **Step 3: `resolveBreakpoint` 와 `useBreakpoint` 구현**

`src/shared/layout/breakpoint.ts` 에 넣는다.

- `TABLET_MIN_WIDTH = 768` 상수
- `type Breakpoint = 'phone' | 'tablet'`
- `resolveBreakpoint(width: number): Breakpoint` 순수 함수
- `useBreakpoint(): Breakpoint` 는 `useWindowDimensions()` 의 `width` 를 `resolveBreakpoint` 에 넘긴다

훅과 순수 함수를 분리해 두는 게 요점이다. 순수 함수만 테스트하면 RN 렌더러가 필요 없다.

`TABLET_MIN_WIDTH` 위에 한 줄 남긴다. 토큰에 브레이크포인트가 없어 앱이 정한 잠정값이라는 사실이다.

```ts
// shortcut: 768 은 토큰에 브레이크포인트가 없어 쓴 RN 관례값, 디자이너와 레이아웃 확정 때 재검토
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/shared/layout/breakpoint.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 5: 린터, 포매터, 타입체크 설치와 설정**

```bash
npm i -D oxlint oxfmt
```

`tsconfig.json` 에 `"strict": true` 를 켠다. `package.json` scripts 에 추가한다.

```json
"typecheck": "tsc --noEmit",
"lint": "oxlint",
"test": "vitest run",
"format": "oxfmt",
"format:check": "oxfmt --check"
```

- [ ] **Step 6: `check-gate.sh` 작성**

`.claude/scripts/check-gate.sh` 는 `/Users/yura/Desktop/if_ent_app/.claude/scripts/check-gate.sh` 를 그대로 가져오고 첫 줄 주석의 레포 이름만 바꾼다. typecheck, lint, test, format 네 개를 돌리고 하나라도 실패하면 exit 1 이다. **베이스라인을 도입하지 않는다. 절대 0건이다.**

```bash
chmod +x .claude/scripts/check-gate.sh
```

- [ ] **Step 7: 게이트 통과 확인**

Run: `.claude/scripts/check-gate.sh`
Expected: `ok typecheck`, `ok lint`, `ok test`, `ok format` 네 줄과 마지막에 `PASS`

- [ ] **Step 8: 커밋**

```bash
git add package.json package-lock.json tsconfig.json .claude/scripts/check-gate.sh src/shared/layout/
git commit -m "chore: 검증 게이트와 브레이크포인트 추가"
```

---

### Task 3: 토큰 변환과 3환경 레이아웃 검증 (보류)

⛔ **보류 중.** 사용자가 디자이너와 확정할 것이 있어 2026-11-13 에 멈췄다. Task 1, 2, 4, 5 는 이 태스크 없이 완결된다.

**디자이너와 확정할 것 3개.**

| # | 항목 | 왜 사람이 정해야 하나 |
|---|---|---|
| 1 | `layout.touch-min` 을 40 에서 44 이상으로 올릴지 | 40 은 Apple HIG 44pt 와 Material 48dp 둘 다 미달이다. 접근성은 깎지 않는다. 토큰을 고치는 게 맞고, 안 고치면 앱이 토큰을 우회해야 해서 "토큰이 단일 소스"가 깨진다 (설계 5.4.1) |
| 2 | 태블릿과 폰 브레이크포인트 값 | 토큰에 브레이크포인트가 없다. 잠정 768 을 썼다. `content-max 1200`, `readable-max 840`, `panel 420` 에서 역산할 수도 있다 |
| 3 | 신규 디자인이 기존 토큰 세트를 그대로 쓰는지 | 새 디자인이 들어오는데 토큰이 2026-11-05 이후 안 바뀌었다. 색과 타이포가 교체될 예정이면 변환 스크립트는 지금 짜도 되지만 화면 작업은 기다려야 한다 |

**Files:**
- Create: `scripts/build-tokens.mjs`, `src/shared/constants/theme.ts` (생성물), `src/shared/constants/theme.test.ts`
- Modify: `src/app/index.tsx`, `package.json` (`tokens:build` 스크립트)

**Interfaces:**
- Consumes: `useBreakpoint()`, `TABLET_MIN_WIDTH` from Task 2
- Produces: `COLORS`, `SPACING`, `RADIUS`, `OPACITY`, `TYPOGRAPHY`, `LAYOUT` (모두 `as const`)

- [ ] **Step 1: 토큰 소스를 받아오는 스크립트 작성**

`scripts/build-tokens.mjs`. 입력은 `https://raw.githubusercontent.com/Quizly-Team/frontend/dev/tokens/tokens.json`, 출력은 `src/shared/constants/theme.ts` 다. public 레포라 인증이 필요 없다.

웹의 `scripts/build-tokens.mjs` 에서 네 가지 로직을 가져온다. 하드코딩으로는 재현이 안 되는 것들이다.

1. 세트 재귀 병합 (얕은 병합이면 `gray` 가 덮여 `{gray.800}` 참조가 안 풀린다)
2. `deref` (`{line-height.3xl}` 같은 세트 간 참조 해석)
3. 타이포 합성 토큰 수동 해체 (style-dictionary 의 font shorthand 를 타면 속성이 깎인다)
4. 스페이싱 4px 그리드 검증 (벗어나면 빌드를 세운다)

버린다: Tailwind `@theme` 블록 전부, `data-theme` 다크 블록.

출력 파일 머리에 자동 생성 경고를 넣는다. `package.json` 에 `"tokens:build": "node scripts/build-tokens.mjs"` 를 추가한다.

- [ ] **Step 2: 실패하는 테스트 작성**

`src/shared/constants/theme.test.ts`. 생성된 값이 토큰과 맞는지 고정한다.

```ts
import { describe, expect, it } from 'vitest'
import { LAYOUT, RADIUS, SPACING } from './theme'

describe('theme (생성물)', () => {
  it('간격 스케일은 단조 증가한다', () => {
    const values = Object.values(SPACING)
    expect(values).toEqual([...values].sort((a, b) => a - b))
  })

  it('간격 스케일은 토큰과 같다', () => {
    expect(Object.values(SPACING)).toEqual([
      2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80,
    ])
  })

  it('라운딩 full 은 9999 다', () => {
    expect(RADIUS.full).toBe(9999)
  })

  it('터치 최소값이 플랫폼 하한을 지킨다', () => {
    expect(LAYOUT['touch-min']).toBeGreaterThanOrEqual(44)
  })
})
```

마지막 테스트는 **지금 FAIL 한다.** 토큰이 40 이기 때문이다. 그게 의도다. 디자이너가 토큰을 올리면 통과하고, 안 올리면 게이트가 계속 막아서 이 결정이 조용히 묻히지 않는다.

- [ ] **Step 3: 변환 실행과 테스트 통과 확인**

Run: `npm run tokens:build && npx vitest run src/shared/constants/theme.test.ts`
Expected: 처음 3개 PASS. `touch-min` 테스트는 토큰이 44 이상으로 올라간 뒤 PASS

- [ ] **Step 4: `index.tsx` 를 검증용 화면으로 만들기**

`useBreakpoint()` 와 `theme` 상수로 한 화면에서 2단과 1단이 갈리는 레이아웃을 만든다. 태블릿 2열, 폰 1열이고 **같은 컴포넌트 안에서 전환한다** (설계 Anti-goal 1). 터치 가능한 요소 하나를 넣고 `minHeight` 와 `minWidth` 를 `LAYOUT['touch-min']` 으로 준다.

- [ ] **Step 5: 세 환경에서 안 깨지는지 확인**

Run: `npx expo run:android` (태블릿 AVD), `npx expo run:android` (폰 AVD), `npx expo run:ios`
Expected: 태블릿 2열, 폰 1열, iOS 시뮬레이터에서 같은 화면. 잘림, 겹침, 넘침이 없다

iOS 시뮬레이터는 Apple Developer 계정 없이 된다. Xcode 만 있으면 된다.

- [ ] **Step 6: 게이트와 커밋**

Run: `.claude/scripts/check-gate.sh`
Expected: `PASS`

```bash
git add scripts/build-tokens.mjs package.json src/shared/constants/ src/app/index.tsx
git commit -m "feat: 웹 디자인 토큰 변환과 브레이크포인트 레이아웃 적용"
```

---

### Task 4: rh 하네스 이식

**Files:**
- Create: `.claude/agents/{planner,plan-critic,builder,code-critic,integration-qa,layout-auditor}.md`
- Create: `.claude/skills/{rh-dev-orchestrator,rh-plan,rh-implement,rh-qa,quizly-app-conventions,quizly-be-contract}/SKILL.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: Task 2 의 `.claude/scripts/check-gate.sh`, Task 3 의 `theme.ts` 와 `breakpoint.ts` (conventions 스킬이 참조한다)

- [ ] **Step 1: 에이전트 5개 이식**

`/Users/yura/Desktop/if_ent_app/.claude/agents/` 의 `planner`, `plan-critic`, `builder`, `code-critic`, `integration-qa` 를 가져와 프로젝트 고유 내용만 바꾼다. `device-prober.md` 는 가져오지 않는다 (B2C 라 실측할 고정 기기가 없다).

바꾸는 것: 레포 이름, 스택 표, 검증 경로(센서와 STOMP 가 아니라 레이아웃과 REST), 참조 스킬 이름.

- [ ] **Step 2: `layout-auditor` 에이전트 작성**

변경된 화면마다 태블릿과 폰 두 사이즈를 확인하고 설계 5.5 규칙 위반을 잡는다. 모델은 sonnet.

잡는 것 네 가지: 고정 px 사용, 화면을 두 벌 만든 분기, 44 미만 터치 타겟, `theme.ts` 를 우회한 하드코딩 색과 간격.

산출물은 `docs/ai/review/<id>-layout.md` 이고 판정은 `pass` 또는 `fail`.

- [ ] **Step 3: rh 스킬 4개 이식**

`rh-dev-orchestrator`, `rh-plan`, `rh-implement`, `rh-qa` 를 `if_ent_app` 에서 가져온다. 파이프라인 구조는 그대로다.

`rh-dev-orchestrator` 에서 바꾸는 것:
- 역할 맵에서 `device-prober` 행을 지우고 `layout-auditor` 행을 넣는다
- Phase 0 의 범위 선분리 세 갈래를 **앱 코드 / 백엔드(`Quizly-Team/backend`) / 운영**으로 바꾼다
- Phase 2 통과 조건을 `code-critic` 이 `approve` **그리고** `layout-auditor` 가 `pass` 로 바꾼다. 둘은 병렬 호출이고, UI 변경이 없는 작업에서는 `layout-auditor` 를 부르지 않는다

- [ ] **Step 4: `quizly-app-conventions` 스킬 작성**

설계 5.2, 5.4, 5.5, Global Constraints 를 담는다. 디렉터리와 의존 규칙(`app/` to `features/` to `shared/` 단방향, feature 간 직접 import 금지, barrel export 금지), 네이밍, TypeScript 규칙, 그리고 **태블릿에서 폰 축소 규칙 4개**.

**디자인 토큰 규칙**도 넣는다 (설계 5.4).

- `src/shared/constants/theme.ts` 는 **자동 생성물이다.** 직접 수정하지 않는다
- 토큰 단일 소스는 웹 레포(`Quizly-Team/frontend` `dev`)의 `tokens/tokens.json` 이다. 디자이너는 웹 레포로만 Push 한다
- 갱신은 `npm run tokens:build`. 크로스 레포 CI 를 만들지 않는다
- 색, 간격, 라운딩, 타이포를 `theme.ts` 밖에 하드코딩하지 않는다
- ⚠️ `layout.touch-min` 이 40 이고 플랫폼 하한(44)에 미달이다. 미해결 항목이다 (설계 5.4.1). 테스트가 막고 있으므로 임의로 테스트를 고쳐 통과시키지 않는다

NativeWind 를 쓰지 않는 이유를 한 줄로 남긴다. 안정판 `4.2.7` 의 peer 가 `tailwindcss` 하나뿐이고 Expo 와 RN 조합을 보장하지 않는다. 나중에 누가 다시 꺼내지 않도록.

**라이브러리 추가 기준**도 이 스킬에 넣는다 (설계 5.2.1). RN 0.76 부터 New Architecture 가 기본이고 브릿지는 제거됐다. 새 라이브러리를 고를 때 New Architecture 지원을 확인하고, 미지원이면 interop 으로 우회하지 말고 다른 라이브러리를 찾는다. 대안이 없으면 그 기능을 범위에서 뺄지 사람이 판단한다. 확인 경로는 React Native Directory 의 New Architecture 배지와 각 라이브러리 README 다. `planner` 가 새 라이브러리를 계획에 넣을 때 §4 에 이 확인을 적는다.

- [ ] **Step 5: `quizly-be-contract` 스킬 작성**

설계 5.7 을 담는다.

- 1차 조회 경로: `gh api "repos/Quizly-Team/backend/git/trees/main?recursive=1"` 로 컨트롤러를 열거하고 필요한 파일만 읽는다. public 레포라 인증이 필요 없다
- ⚠️ 배포 Swagger(`https://api.quizly.co.kr/v3/api-docs`)는 `401 TOKEN_NOT_FOUND` 로 막혀 있다. 하네스가 WebFetch 로 읽을 수 없다
- 기존 웹 클라이언트 코드를 계약 근거로 쓰지 않는다
- 미결 계약은 `docs/ai/contract-gaps.md` 에 번호로 쌓는다
- 백엔드에 기존 웹이 안 쓰는 도메인이 있다: `chatbot`, `dailyquiz`, OCR 계열 4개

- [ ] **Step 6: `CLAUDE.md` 작성**

`if_ent_app/CLAUDE.md` 구조를 따른다. 하네스 호출 조건, ⚠️ 세션을 레포 폴더에서 시작하라는 경고, 같이 쓰는 외부 스킬 표, 스택, 금지 사항, 백엔드 계약, 코드 규약, 작업 흐름, 명령, 검증 경로, 변경 이력.

외부 스킬 표에 넣는 네 개:

| 스킬 | 언제 |
|---|---|
| `ponytail` | 코드를 쓰거나 고치거나 리뷰하는 모든 작업 |
| `superpowers` | 새 기능 설계(`brainstorming`), 계획(`writing-plans`), 디버깅(`systematic-debugging`) |
| `code-review` | PR 올리기 전 `/code-review` |
| `frontend-design` | 신규 화면 설계 |

규칙을 복붙하지 않는다. 스킬 본문이 정본이고 여기는 **언제 쓰는지**만 적는다.

- [ ] **Step 7: 커밋하고 세션 재시작**

```bash
git add .claude/ CLAUDE.md
git commit -m "chore: rh 하네스 이식"
git push
```

세션을 종료하고 `~/Desktop/app` 에서 다시 시작한다. `.claude/agents/` 와 `.claude/skills/` 는 세션 시작 시점에 등록된다 (Review Focus 5).

- [ ] **Step 8: 하네스가 실제로 걸리는지 확인**

Run: 새 세션에서 "하네스 돌려" 라고 입력
Expected: `rh-dev-orchestrator` 가 뜨고 Phase 0 에서 작업 식별자를 묻고 멈춘다. 에이전트 `not found` 가 없다

---

### Task 5: 웹 레포 CLAUDE.md 정정

**Files:**
- Modify: `/Users/yura/Desktop/frontend/CLAUDE.md` (하네스 섹션)

**Interfaces:**
- 없음. 다른 레포이고 앱 레포에 의존하지 않는다

- [ ] **Step 1: 현재 상태 확인**

Run: `cd ~/Desktop/frontend && ls .claude 2>&1 ; git log --oneline -1 -- .claude`
Expected: `No such file or directory` 와 커밋 `7502eb7 chore: gitignore에 claude 폴더 추가`

문서에 적힌 9에이전트 파이프라인의 실물이 없다는 것을 확인하는 스텝이다.

- [ ] **Step 2: 하네스 섹션 교체**

`CLAUDE.md` 의 "하네스: Quizly 개발 워크플로우" 섹션을 지우고 아래로 바꾼다.

- 이 레포의 1차 범위는 **서비스 소개와 문의**다. 제품 기능은 앱(`Quizly-Team/app`)으로 간다
- 파이프라인 하네스를 두지 않는다. `ponytail` 과 `frontend-design` 과 `/code-review` 를 쓴다
- 변경 이력 표에 한 줄 추가. 2026-11-13, 하네스 섹션을 실물에 맞게 축소, 사유는 `.claude/` 가 `7502eb7` 에서 gitignore 로 들어가 실물이 사라졌고 1차 웹 범위가 랜딩 2페이지로 줄었기 때문

기존 아키텍처 섹션과 컨벤션 섹션은 **건드리지 않는다.** 그 내용은 아직 사실이다.

- [ ] **Step 3: 빌드가 깨지지 않았는지 확인**

Run: `npm run build`
Expected: 통과. 문서만 고쳤으므로 당연하지만, 이 레포의 검증 게이트가 `npm run build` 뿐이라 한 번 돌린다

- [ ] **Step 4: 이슈를 만들고 브랜치에서 커밋**

```bash
gh issue create --repo Quizly-Team/frontend --title "docs: 하네스 섹션 현행화"
git switch -c docs/#<번호>
git add CLAUDE.md
git commit -m "docs(#<번호>): 하네스 섹션을 실물에 맞게 축소"
git push -u origin docs/#<번호>
gh pr create --base dev --body "Closes #<번호>"
```

PR base 는 `dev` 다. 추론하지 않는다.

---

## 이 계획에 없는 것

세팅이 아니라 기능 작업이라 뺐다. 조용히 빠진 게 아니라는 걸 남겨둔다.

| 항목 | 어디로 |
|---|---|
| 웹 랜딩 1개 + 문의 1개 (설계 5.10) | 세팅 다음 기능 작업. 기존 `frontend` 레포에서 이슈로 시작한다 |
| TanStack Query 설치와 API 레이어 | 첫 API 호출이 생기는 작업 |
| EAS Build 설정 | Apple 계정 확보 후. 그때까지 로컬 `expo run:*` 으로 충분하다 |
| 앱 아이콘, 스플래시, 앱 이름 | 디자인 수령 후 |
