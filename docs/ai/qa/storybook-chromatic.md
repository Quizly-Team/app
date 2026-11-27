---
id: storybook-chromatic
verdict: pass
gate: PASS
---

> 2026-11-27, 브랜치 `chore/#11` 워킹트리 (HEAD `96a9aba` = `origin/dev`, 수정 7 + 신규 8). 코드는 고치지 않았다. 임시 산출물은 전부 `/tmp/qa-*` 에 두었고 `git status --porcelain` 은 QA 전후 같은 15줄이다 (이 파일 제외).

## 아키텍처

| 항목 | 결과 | 근거 |
| --- | --- | --- |
| 의존 방향 | 지켜졌다 | 새 코드는 `src/shared/constants/` 안에서만 import 한다 (`./theme`, `./flattenColors`). `src/app/*.tsx` 는 `shared` 를 import 하지 않는다. `src/features/` 는 없다 |
| RN 비의존 분리 | 지켜졌다 | 분기와 재귀가 있는 유일한 로직 `flattenColors.ts` 는 import 0개. `theme.stories.tsx` 에 남은 것은 분기 없는 템플릿 라벨과 `map` 뿐이다 (계획 Step 4 결정). 그 결과의 완전성은 아래 헤드리스 렌더로 2층에서 확인했다 |
| 네트워크 인라인 | 해당 없음 | 새 코드에 fetch 가 없다 |
| barrel export | 없다 | `find src -name index.ts` 0건 |
| 빈 디렉터리 | 없다 | 추적 대상 밖(`android/` 생성물, gitignore 됨)에만 있다. `.storybook/`, `.github/workflows/` 는 파일을 하나씩 들고 생겼다 |
| stories 위치 | 지켜졌다 | `src/shared` 밖의 `*.stories.*` 0건. `src/app/` 에 없어 expo-router 라우트가 되지 않는다 |

## 통합 정합성

| 경계 | 생산자 쪽 근거 | 소비자 쪽 근거 | 판정 |
| --- | --- | --- | --- |
| REST, 에러, 인증, 라우트 | 해당 없음 | 해당 없음 | 해당 없음 |
| 1. 토큰 to 팔레트 `COLORS` | `theme.ts:6-93`. `flattenColors` 를 쓰지 않는 독립 재귀로 편 리프 50개, 라벨 중복 0 | `npm run build-storybook` 결과물을 로컬 서버로 띄우고 헤드리스 Chrome (폭 1200) 으로 `foundations--colors` 를 렌더해 DOM 을 뽑았다. 라벨 50개 | **일치.** 누락 0, 초과 0, 중복 0, 순서 같음. 견본 50개의 인라인 `background-color` 를 hex(알파 포함)로 되돌리면 라벨 값과 50개 모두 같다 |
| `TYPOGRAPHY` | 42 variant. 기대 라벨 `크기/굵기 fontSize/lineHeight/letterSpacing/fontWeight` | 같은 방법. 라벨 42줄 | **일치.** 누락, 초과, 중복 0. 42줄 모두 인라인 `font-size`, `line-height`, `letter-spacing`, `font-weight` 가 라벨 값과 같다. `text-1rg/regular 16/24/-0.06/400` 확인 |
| `SPACING` | 12개 | 라벨 12개 | **일치.** 12개 모두 정사각형 `width` = `height` = 라벨 값 px. 순서 오름차순 |
| `RADIUS` | 8개 | 라벨 8개 | **일치.** 8개 모두 인라인 `border-radius` = 라벨 값 px |
| 제외 목록 | `theme.ts` export 6개 중 `OPACITY` 11, `LAYOUT` 4 | 네 DOM 에서 `touch-min`, `content-max`, `readable-max`, `panel`, `glass`, `shadow/sheet` 0건 | **일치.** 계획 §2 의 제외와 같다. 4 + 2 = 6 으로 남는 export 가 없다 |
| 토큰 원문 to `theme.ts` | `Quizly-Team/frontend@d9f0213...` `tokens/tokens.json` | `scripts/build-tokens.mjs` 를 `/tmp` cwd 에서 돌려 재생성 | **바이트 동일.** 팔레트가 비추는 값이 고정 SHA 원문에서 그대로 온다 |
| 2. README to 고정 SHA | `theme.ts:2` 의 40자 SHA. 그 SHA 의 `tokens.json` 원문 (curl 200, 122072 B) 세트 11개 전체를 경로와 값으로 훑었다 | `README.md` 의 `Quizly-Team/frontend@d9f02130e111aabcb2cb7b32829982f3767a4b7a` 1회 | **일치.** §5 자동 10 은 `sha=40 readme=1`, `false false`. 계획 검사식은 `[DS] Semantic/Light` 의 `shadow` 만 보지만, 전 세트에서 키나 값에 `glass`, `sheet`, `tint` 가 0건이라 4개 부재가 원문 전체에서 참이다. README 의 "boxShadow 토큰" 은 원문 `boxShadow` 3개, `theme.ts:4` "버린 리프 boxShadow 3" 과 같다 |
| 3. 워크플로 to GitHub Secret | `gh secret list -R Quizly-Team/quizly_app` 이름 `CHROMATIC_PROJECT_TOKEN` 하나 | `chromatic.yml:24` `secrets.CHROMATIC_PROJECT_TOKEN` | **일치** |
| 워크플로 to action | 고정 SHA `0a7067e...` 의 `action.yml`: input `projectToken`, `buildScriptName` 기본 `[build-storybook]`, `using: node24`. `commits/v18` 도 같은 SHA | `chromatic.yml` 의 `projectToken`, `package.json` 의 `build-storybook` | **일치.** `checkout@v7`, `setup-node@v7` 태그 존재. 레포 Actions `enabled`, `allowed_actions: all` |
| 워크플로 to 계획 Step 6 | 계획 YAML 블록 | 파일 | **일치.** diff 는 `<SHA>` 와 날짜 자리표시자 한 줄뿐. 트리거 `on: push` 하나, `permissions: contents: read` 하나. §5 자동 7 의 7-1, 7-2, 7-3 모두 exit 0 |
| 워크플로 to Chromatic GitHub app | 계획 Step 0-4 의 2 "Chromatic GitHub app 을 설치하고 UI Review 를 켠다" | `gh api orgs/Quizly-Team/installations` 전체 2개 (`vercel`, `claude`). 조회 계정 yura0302 는 조직 `admin active` 라 목록이 전체다 | **어긋남 (게이트 밖).** 아래 "게이트 PASS 인데 어긋난 곳" 1 |
| 문서 to 브랜치 보호 | `branches/dev/protection` 404 `Branch not protected`, `rulesets` 0 | `CLAUDE.md` 와 `SKILL.md` 의 머지 행 "`dev` 는 Chromatic `UI Tests` 통과를 요구한다" | **지금은 거짓.** 계획 Step 9 의 2 를 사람이 해야 참이 된다. 아래 2 |
| README 링크 to Chromatic | 계획 Step 0-4 표 appid `6b09346198120c6b2bc461a5` | `README.md` `dev--6b09346198120c6b2bc461a5` | **appid 일치.** permalink 는 지금 HTTP 404. `dev` 빌드가 아직 없으니 예상된 상태다. appid 자체가 맞는지는 Chromatic 접근 없이 확인할 수 없고 §5 Chromatic 7 이 확정한다 |
| 4. 앱 번들 격리 | 앱 진입점 `src/app/_layout.tsx`, `index.tsx` | `npx expo export --platform android --platform ios --source-maps` (리뷰어는 android 만 봤다). android map `sources` 1270, ios 1114 | **격리됨.** 두 플랫폼 모두 `storybook`, `.stories.`, `flattenColors`, `/.storybook/` 경로 0, `src/shared/` 0. 양성 대조로 `src/app/` 2개가 map 에 있다. `.hbc` 바이트코드 문자열 grep 도 `flattenColors`, `@storybook`, `storybook-root` 0건이고, 같은 grep 이 앱 글자 `Quizly` 는 1건 잡는다 |
| 자원 | 타이머, 구독, 핸들 없음 | 해당 없음 | 해당 없음 |

검사가 헛돌지 않는지 음성 대조를 같이 돌렸다. DOM 사본에 라벨 한 글자, 견본 색 한 채널, `border-radius` 1px 을 바꾸면 비교기가 셋 다 잡고 exit 1 이다. 콘솔 수집은 `console.error` 를 넣은 페이지로 양성 대조한 뒤 네 story 에서 0줄이다.

### 게이트 PASS 인데 어긋난 곳

1. **Chromatic GitHub app 이 조직에 설치돼 있지 않다.** 계획 Step 0-4 의 2 는 착수 조건으로 app 설치와 UI Review 켜기를 적었다. Chromatic 문서상 `UI Tests` 와 `Storybook Publish` 체크는 "projects that are linked to a repository get this feature out of the box" (docs/ci) 이고, app 설치는 UI Review 를 켤 때 요구된다 (docs/review "prompted to install the GitHub app"). 그래서 머지 게이트에는 영향이 없을 것으로 본다. 다만 UI Review 체크가 붙지 않고 §5 Chromatic 9 를 못 돌린다. 레포 연결(OAuth)은 GitHub API 로 볼 수 없어 첫 push 의 §5 Chromatic 2 에서 확정된다. 사람이 첫 push 전에 app 을 설치하거나, UI Review 를 이번에 안 켠다고 PR 에 적는다 (§6-10 의 Free 플랜 미확인과 같은 갈래)
2. **`CLAUDE.md` 와 `SKILL.md` 의 머지 행이 지금 GitHub 상태와 다르다.** `dev` 보호가 없다. 계획 Step 9 의 2 가 머지 전에 걸도록 순서를 정했으니 결함은 아니고 **머지 전 조건**이다. 보호를 걸지 않고 머지하면 두 정본 문서가 거짓이 된다. 머지 직전에 §5 Chromatic 4 의 `gh api` 두 줄로 `[["UI Tests"],false]` 와 `0` 을 본다
3. **로컬 브랜치 `chore/#11` 의 upstream 이 `origin/dev` 다** (`branch.chore/#11.merge refs/heads/dev`). `push.default` 가 기본 `simple` 이라 인자 없는 `git push` 는 이름 불일치로 거부되고 조용히 `dev` 에 들어가지는 않는다. 그래도 지금 `dev` 는 보호가 없다. 첫 push 는 `git push -u origin chore/#11` 로 upstream 을 바꿔서 한다

## 태블릿 체크리스트

이 작업은 앱 화면을 바꾸지 않는다. 앱이 전과 같이 뜨는지만 본다.

선행 조건: AVD `ifent_tab_a15` (Android 15, `google_apis_playstore_tablet`). 서버 주소와 로그인 계정은 필요 없다 (앱이 API 를 부르지 않는다). 네이티브 리빌드는 필요 없지만 설치를 위해 `npm run android` 를 쓴다.

1. `~/Library/Android/sdk/emulator/emulator -avd ifent_tab_a15` 로 부팅한다 → `adb devices` 에 `emulator-5554 device` 가 보인다
2. 레포 루트에서 `npm run android` → 빌드와 설치가 끝나고 앱이 열린다
3. 홈에 "Quizly" 한 줄이 전과 같이 뜬다. Storybook UI 와 Foundations 팔레트가 어디에도 없다
4. `adb shell dumpsys activity activities | grep -m1 mResumedActivity` → `kr.co.quizly.app` 이 보인다
5. `adb logcat -d -s ReactNativeJS:V | grep -ciE 'error|storybook'` → `0`

실패 시 볼 곳: Metro 터미널, `adb logcat -s ReactNativeJS:V ReactNative:V`.

## 폰 체크리스트

선행 조건 (둘 중 하나):

- **Android 폰 AVD 가 없다.** 설치된 시스템 이미지도 태블릿용 하나뿐이다. `sdkmanager "system-images;android-35;google_apis_playstore;arm64-v8a"` 그다음 `avdmanager create avd -n quizly_phone_a15 -k "system-images;android-35;google_apis_playstore;arm64-v8a" -d pixel_8` 이 선행 조건이다
- **iOS iPhone 시뮬레이터는 지금 있다.** 환경 표와 달리 iOS 27.2 런타임과 iPhone, iPad 기기가 설치돼 있다 (`xcrun simctl list runtimes`, 2026-11-27). 단 `ios/` 가 없어 `npm run ios` 가 prebuild 와 `pod install` (CocoaPods 1.17.0 있음) 을 먼저 돈다. `app.json` 에 `ios.bundleIdentifier` 가 없어 prebuild 가 식별자를 물을 수 있다. 이 PR 과 무관한 기존 상태다

절차:

1. Android 면 `emulator -avd quizly_phone_a15`, iOS 면 `npm run ios` 에서 iPhone 기기를 고른다
2. Android 면 `npm run android` → 앱이 열린다
3. 홈에 "Quizly" 한 줄이 전과 같이 뜬다. Storybook UI 와 팔레트가 없다
4. Android 는 태블릿 4, 5 와 같은 `adb` 명령과 기대 결과. iOS 는 Metro 터미널에 빨간 에러가 0건

실패 시 볼 곳: Metro 터미널, Android 는 `adb logcat -s ReactNativeJS:V`, iOS 는 `xcrun simctl spawn booted log stream --predicate 'process == "quizlyapp"'` (프로세스 이름은 prebuild 결과로 바꾼다).

번들에 Storybook 이 없다는 것은 위 통합 정합성 4 의 export 검사가 Android 와 iOS 둘 다 덮었다. 기기 확인은 그것을 반복하지 않는다.

## Chromatic (사람)

계획 `docs/ai/plan/storybook-chromatic.md` §5 "수동: Chromatic" 1 에서 10 과 Step 9 의 순서를 따른다. 갈래 A 와 P 판정은 §5 Chromatic 2 의 표, 디자이너 링크 확인은 §5 Chromatic 5 와 7, 8 이다. 그 앞에 위 "어긋난 곳" 1 (app 설치 여부)과 3 (upstream) 을 정리한다.

## 테스트로 덮인 것 / 안 덮인 것

| 대상 | 층 | 상태 |
| --- | --- | --- |
| `flattenColors` 의 1, 2, 3단 리프, `/` 구분자, 선언 순서 | 1 | 덮임. `flattenColors.test.ts` 1개 통과. vitest 목록에 잡힌다 |
| `theme.ts` 리프 수와 모양 (50, 42 등) | 1 | 덮임. 기존 `theme.test.ts` (plan 1) |
| 팔레트 네 story 의 완전성과 그려진 값 | 2 | 이 QA 에서 헤드리스 렌더로 한 번 확인했다. **자동화된 곳은 없다.** 이후 변경은 Chromatic 스냅샷 diff 가 잡지만, 처음부터 빠진 항목은 diff 가 아니라 디자이너 비교(§5 Chromatic 5)만 잡는다 |
| 라벨 템플릿 (`theme.stories.tsx`) | 1 불가 | RN 을 import 하는 모듈이라 단위 테스트 대상이 아니다. 분기가 없고 `Object.entries<TextStyle>` 가 모양 변경을 typecheck 로 막는다. 계획 Step 4 의 결정을 유지한다 |
| 앱 번들 격리 | 2 | 이 QA 에서 확인. CI 에 없다 |
| `npm ci` on ubuntu, `contents: read` 충분성, 스냅샷 잘림 | 3 (CI) | 안 덮임. 첫 push 의 Actions 로그가 확정한다 (§6-12, §6-16) |
| Chromatic onboarding, required check, bypass | 3 (사람) | 안 덮임. §5 Chromatic |

1층으로 덮을 수 있는데 2층이나 3층으로 올린 항목은 없다.

## Critical

없다.

## 그 밖에 알릴 것

- **환경 표가 낡았다.** `CLAUDE.md` "검증 환경" 과 `integration-qa` 정의의 iOS 행은 "런타임 0개" 인데 지금 iOS 27.2 가 있다. 표 갱신은 사람이 정한다. 이 QA 는 고치지 않았다
- 계획 §6-21 시점의 원격 브랜치는 `dev`, `main` 둘이었는데 지금 `docs/#9`, `feat/#1` 이 더 있다. 둘 다 머지된 PR(#10, #4)의 브랜치이고 열린 PR 은 0개라 Step 9 의 8 에 해당하는 대상이 지금은 없다
- 리뷰 m1 (`npm audit`) 은 다시 보지 않았다
