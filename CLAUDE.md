# CLAUDE.md

Quizly 모바일 앱. 공부할 자료를 올려 문제를 만들고, 풀고, 오답을 복습하고, 모의고사를 보는 학습 앱이다. **태블릿을 기준 사이즈로 그리고 폰으로 줄인다.** 대상은 B2C 이고 iOS 와 Android 를 한 코드로 커버한다.

| 레포                   | 역할                                                           |
| ---------------------- | -------------------------------------------------------------- |
| `Quizly-Team/app`      | 이 저장소. 모바일 앱                                           |
| `Quizly-Team/backend`  | API (Java, Spring Boot)                                        |
| `Quizly-Team/frontend` | 웹. 1차 범위는 **서비스 소개와 문의**. 제품 기능은 앱으로 간다 |

## 하네스: quizly app 개발 파이프라인

**목표:** 태블릿에서 멀쩡하고 폰에서도 안 깨지는 앱을, 계획 비평과 구현 비평과 QA 를 거쳐 만든다.

**호출 조건:** 이 저장소의 코드를 바꾸는 작업을 요청받으면 `rh-dev-orchestrator` 스킬을 사용한다. 단계만 필요하면 `rh-plan` / `rh-implement` / `rh-qa` 를 직접 부른다. 단순 질문에는 직접 답해도 된다.

⚠️ **세션을 이 디렉터리에서 시작해야 한다.** `.claude/agents/` 와 `.claude/skills/` 는 세션 시작 시점에 등록된다. 상위 폴더에서 시작하면 에이전트가 `not found` 로 뜨고 하네스가 통째로 안 걸린다. 에이전트나 스킬 파일을 새로 만든 직후에도 세션을 다시 시작해야 반영된다.

```
Plan 비평  ->  〔사람 승인〕  ->  Implement 비평  ->  QA
```

| 역할             | 모델   | 산출물                          |
| ---------------- | ------ | ------------------------------- |
| `planner`        | opus   | `docs/ai/plan/<id>.md`          |
| `plan-critic`    | opus   | `docs/ai/plan-critique/<id>.md` |
| `builder`        | opus   | 소스 변경                       |
| `code-critic`    | opus   | `docs/ai/review/<id>.md`        |
| `layout-auditor` | sonnet | `docs/ai/review/<id>-layout.md` |
| `integration-qa` | opus   | `docs/ai/qa/<id>.md`            |

`code-critic` 과 `layout-auditor` 는 **병렬**로 돌고 **둘 다 통과**해야 QA 로 넘어간다. UI 변경이 없는 작업에서는 `layout-auditor` 를 부르지 않는다.

### 같이 쓰는 외부 스킬

규칙을 여기 복붙하지 않는다. 스킬 본문이 정본이고, 여기는 **언제 쓰는지**만 적는다.

| 스킬              | 언제                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------- |
| `ponytail`        | **코드를 쓰거나 고치거나 리뷰하는 모든 작업.** 가장 작은 완전한 변경을 강제한다       |
| `superpowers`     | 새 기능 설계는 `brainstorming`, 계획은 `writing-plans`, 버그는 `systematic-debugging` |
| `/code-review`    | PR 올리기 전                                                                          |
| `frontend-design` | 신규 화면을 설계할 때                                                                 |

**변경 이력:**

| 날짜       | 변경 내용               | 대상 | 사유                                                                                                                                                                       |
| ---------- | ----------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-13 | Harness v2 로 처음 구성 | 전체 | `if_ent_app` 의 rh 하네스를 이 스택에 맞게 재정의. `device-prober` 제거(B2C 라 고정 기기 없음), `layout-auditor` 추가(태블릿에서 폰 축소가 이 프로젝트의 지배적 사고 지점) |

## 스택

| 구분      | 값                                              |
| --------- | ----------------------------------------------- |
| 런타임    | Expo SDK 58, React Native 0.88, React 19.3      |
| 언어      | TypeScript `strict`                             |
| 라우팅    | expo-router (파일 기반, `src/app/`)             |
| 서버 상태 | TanStack Query (첫 API 호출이 생길 때 도입)     |
| 클라 상태 | 없다. 실제로 필요할 때 Zustand                  |
| 스타일    | `StyleSheet` + `src/shared/constants/theme.ts`  |
| Lint      | oxlint                                          |
| Format    | oxfmt                                           |
| 테스트    | vitest (순수 함수 전용)                         |
| 플랫폼    | **iOS 와 Android 한 코드.** 출시만 Android 먼저 |

New Architecture(JSI, Fabric, TurboModules)가 기본이다. 브릿지는 없다. 라이브러리를 고를 때 지원 여부를 확인한다.

**NativeWind 를 쓰지 않는다.** 안정판 `4.2.7` 의 peer 가 `tailwindcss` 하나뿐이라 Expo 58 과 RN 0.88 조합을 보장하지 않고, `5.x` 는 아직 RC 다. 같은 조직의 `if_ent_app` 이 그 RC 에서 밟은 함정 두 개가 **둘 다 빌드는 통과하고 화면만 조용히 비는** 형태로 실패했다.

## 디자인 토큰

**`src/shared/constants/theme.ts` 는 자동 생성물이다. 직접 수정하지 않는다.**

단일 소스는 웹 레포(`Quizly-Team/frontend` `dev` 브랜치)의 `tokens/tokens.json` 이다. 디자이너는 피그마 Tokens Studio 에서 **웹 레포로만** Push 한다. 앱은 `npm run tokens:build` 로 받아 변환한다.

⚠️ **미해결.** `layout.touch-min` 이 40 인데 Apple HIG 는 44pt, Material 은 48dp 를 요구한다. 디자이너 확인 항목이다 (`docs/ai/` 설계 문서 5.4.1). 테스트가 막고 있으니 **테스트를 고쳐서 통과시키지 않는다.**

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

- `app/` to `features/` to `shared/` 단방향. feature 간 직접 import 금지
- barrel export(`index.ts`) 쓰지 않는다
- **순수 로직은 `react-native` 를 import 하지 않는 모듈에 둔다.** vitest 가 RN 의 Flow 소스를 파싱하지 못한다. `src/shared/layout/breakpoint.ts`(순수)와 `useBreakpoint.ts`(RN)가 그 분리의 예다

## 백엔드 계약

상대는 `Quizly-Team/backend` 다. **앱에 맞게 개편 중이라 계약이 움직인다.**

| 항목    | 값                                                                             |
| ------- | ------------------------------------------------------------------------------ |
| 정본    | **컨트롤러 소스** (`gh api`, public 레포라 인증 불필요)                        |
| 호스트  | `https://api.quizly.co.kr`                                                     |
| Swagger | ⚠️ `/v3/api-docs` 가 `401 TOKEN_NOT_FOUND` 로 막혀 있다. 서버 변경 요청 미해결 |
| 🚫 금지 | 기존 웹 클라이언트 코드를 계약 근거로 쓰는 것                                  |

⚠️ **성공과 에러의 응답 모양이 다르다.** 성공은 DTO 를 그대로 주고(봉투 없음), 에러만 `{statusCode, timeStamp, ok, error:{message}, code}` 로 감싼다. 균일한 봉투를 가정하면 깨진다. 자세한 건 `quizly-be-contract` 스킬.

## 이 프로젝트의 금지 사항

| 금지                                       | 이유                                                     |
| ------------------------------------------ | -------------------------------------------------------- |
| `theme.ts` 직접 수정                       | 생성물이다. 다음 `tokens:build` 에 날아간다              |
| 화면을 태블릿용과 폰용 두 벌로 만들기      | 이후 모든 변경이 두 배가 된다                            |
| `.ios.tsx` / `.android.tsx` 로 화면 가르기 | "한 코드로 둘 다" 가 깨진다                              |
| 401 재발급 로직을 여러 곳에 두기           | 기존 웹이 3곳에 중복시켜 기술부채가 됐다                 |
| 설치만 하고 안 쓰는 의존성                 | 기존 웹의 zustand, chart.js 가 그랬다. 쓸 때 넣는다      |
| 실패를 조용히 삼키는 것                    | catch 하고 아무것도 안 하거나 빈 값이면 return 하는 코드 |
| 하드코딩된 키와 토큰                       | public 레포다                                            |
| `console.log` 커밋                         |                                                          |
| 매직 넘버                                  | 임계값은 상수 파일 한 곳에                               |
| `git add -A`                               | 워크트리 심볼릭 링크를 커밋해 CI 가 죽은 전례가 있다     |
| `.claude/` 를 gitignore 에 넣는 것         | 기존 웹 레포가 그래서 하네스를 통째로 잃었다             |

## 명령

```bash
npm run start          # Expo 개발 서버
npm run android        # 네이티브 빌드 + 설치
npm run ios            # 네이티브 빌드 + 설치 (iOS)
npm run prebuild       # android/, ios/ 재생성

npm run typecheck      # tsc --noEmit
npm run lint           # oxlint
npm test               # vitest run
npm run format         # oxfmt
npm run format:check   # oxfmt --check

.claude/scripts/check-gate.sh        # 위 4개를 한 번에. 절대 0건
.claude/scripts/check-gate.sh --fix  # 포맷만 고치고 검사
```

네이티브 패키지 추가/제거, `app.json` 의 권한/플러그인/방향 변경 시 리빌드가 필요하다. JS/TS 만 고쳤으면 불필요하다.

## 검증 환경 (2026-11-13 실측)

| 환경               | 상태                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| Android 태블릿 AVD | `ifent_tab_a15` (Android 15) 사용 가능                                          |
| Android 폰 AVD     | **없다.** 폰 확인하려면 AVD 생성이 선행 조건                                    |
| iOS 시뮬레이터     | Xcode 27.2 설치됨, **런타임 0개.** `xcodebuild -downloadPlatform iOS` 선행 필요 |
| iOS 실기기, 스토어 | Apple Developer 계정 미확보                                                     |

iOS 시뮬레이터는 **유료 계정 없이 된다.** 계정이 막는 건 실기기 설치와 스토어 배포뿐이다.

## 작업 흐름

**예외 없이 이슈 to 브랜치 to PR 이다.**

| 단계         | 규칙                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| 이슈         | 먼저 만든다. 제목은 **명사형 어미** (`fix: Completed 제거`). 서술형 `~다` 금지 |
| 브랜치       | `feat/#<번호>`, `fix/#<번호>`                                                  |
| PR           | **base 는 `dev`.** 본문에 `Closes #<번호>`                                     |
| 커밋         | **제목만.** 본문, `Co-Authored-By`, AI 서명 전부 금지                          |
| `docs/ai/**` | 코드와 **같은 커밋**에 넣는다. AI 작업을 블랙박스로 두지 않는다                |

작업 중 발견한 별개 버그도 즉시 이슈화한다.

커밋 타입: `feat` `fix` `bug` `refactor` `style` `docs` `test` `chore` `build` `perf`. `style` 은 **스타일 전용**이고 포매팅 변경이 아니다. `fix` 와 `bug` 는 별개다.

## 산문

한국어. 식별자와 경로는 영어. `—` 와 `·` 는 쓰지 않는다.
