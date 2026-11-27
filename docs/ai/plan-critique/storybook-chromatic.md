---
id: storybook-chromatic
verdict: sound
rounds: 4
---

## 판정 근거

부탁받은 네 축 중 (a) 는 통과다. `flattenColors` 가 전제하는 `COLORS` 모양은 plan 1 4회차 Step 3 과 맞는다. 고정 SHA 의 실제 `tokens.json` 으로 같은 모양의 `as const` 객체를 만들어 이 레포의 `tsc 6.0.3` 에 넣어 봐도 맞았다. 2단과 3단이 섞여 있어서 재귀 함수가 필요하고, 순수 모듈로 뺀 것도 규칙에 맞는다. (d) 에서도 SHA 고정과 정면으로 부딪히는 곳은 없다. 막히는 것은 (c) 다. 3회차의 핵심 결정은 "이 PR 에서 required check 를 걸고, 첫 빌드가 pending 인 상태로 머지 차단을 확인한다" 인데 두 전제가 사실과 다르다. 하나, Chromatic CLI 저장소는 새 프로젝트의 첫 빌드가 auto-accept 된다고 적는다. 그러면 Step 9 의 사람 순서와 §5 Chromatic 2, 4, 5, 6 은 적힌 대로 실행할 수 없다. 둘, 이 레포의 협업자 셋이 전원 admin 이다. 그래서 "admin 이 아닌 계정" 으로 하는 확인을 할 수 없고, 게이트는 admin 이 체크박스 하나로 풀 수 있는 형태가 된다. 게다가 계획이 적은 GitHub 화면 경로가 지금 GitHub 과 달라서, 사람이 ruleset 쪽을 고르면 §6-8 의 탈출구가 사라진다. (b) 에서 하드 룰과 충돌하는 곳은 없다. 다만 "기본 폭 하나, phone 배치는 스냅샷에 없다" 는 사실이 다음 planner 가 읽는 정본 문서에 남지 않는다. 그 밖에 팔레트가 잡는 토큰 변경의 범위가 §1 의 굵은 글씨 주장보다 좁다. Critical 1, Major 3 이라 `revise` 다.

## Critical

### C1. 새 Chromatic 프로젝트의 첫 빌드는 auto-accept 된다. 계획은 pending 을 전제로 순서를 짰다

**계획의 전제:** 135행 "이 PR 의 첫 빌드에서 story 4개가 전부 새 스냅샷이라 `UI Tests` 가 자연스럽게 pending 이다". 이 전제 위에 다음이 서 있다.
- 460~463행 (Step 9 사람 순서 1~3): pending 을 본다, 보호를 건다, 디자이너 비교 뒤 4개를 Accept 한다
- 546행 (§5 Chromatic 2): `UI Tests` 가 pending
- 548~550행 (§5 Chromatic 4, 5, 6): pending 상태에서 머지 차단을 확인한다, Accept 하지 않고 plan 1 이슈를 만든다, Accept 하면 통과로 바뀐다

**근거:**
- `chromaui/chromatic-cli` main `a89d8bd` (2026-11-25), `.agents/skills/verify-chromatic-cli/features/publish-build.md:51` 원문: "A brand-new project is in onboarding mode, with `.isOnboarding: true` in diagnostics. ... Build 1 is `auto-accepted`". 같은 파일 38행은 출력을 "`Build <N> auto-accepted` (first build), `Build <N> completed` (pending changes) or `Build <N> passed!`" 로 가른다
- 같은 저장소의 `node-src/ui/messages/info/buildSummary.stories.ts` 에서 `FirstBuildPassed` 픽스처는 `number: 1`, 상태 기본값 `PASSED`, `isOnboarding: true` 다
- 공식 문서 `mandatory-pr-checks` 와 `branching-and-baselines` 는 프로젝트 첫 빌드를 다루지 않는다 (WebFetch 2026-11-27). 계획이 인용한 [^baselines] 의 "새 story 는 Accept 해야 baseline" 은 첫 빌드에 대한 문장이 아니다

**결과:** 사람은 Step 9 의 1 에서 초록 `UI Tests` 를 보고 멈춘다. §6-13 의 대체 순서는 끝 상태가 같지만, 발동 조건이 "검색에 안 나오면" (582행) 뿐이라 이 경우를 덮지 못한다. 이 PR 에서 "pending 이면 막힌다" 를 확인한다는 약속(135행 굵은 글씨, 548행)을 지킬 수 없다. §5 Chromatic 5 의 "Accept 하지 않고" 도 의미가 없다. 첫 빌드가 이미 baseline 이 됐기 때문에 변환 버그가 있었다면 그대로 첫 baseline 이 된다.

**고칠 것:** Step 9 과 §5 Chromatic 을 두 결과(auto-accepted, pending)로 갈라 쓴다. auto-accepted 일 때는 이렇게 한다.
1. 디자이너 비교를 **머지 전**에 한다. 변환 버그면 머지하지 않는다. 고친 PR 에서 diff 가 뜬다
2. 성공 상태가 올라온 직후 보호를 건다. 이 경우 Step 0-3 의 근거 3 은 오히려 쉬워진다
3. "pending 이면 막힌다" 는 다른 경로로 확인한다. 예: 이 PR 브랜치에서 임시 브랜치를 따고 `theme.stories.tsx` 한 줄을 바꿔 push 한 뒤, base `dev` 로 draft PR 을 연다. pending 과 머지 차단을 확인하고 PR 을 닫고 브랜치를 지운다. 커밋이 남지 않고 스냅샷 4장이 든다. 또는 시각 변경이 있는 첫 PR 로 미루고 Step 8 에 추적 이슈를 둔다. 어느 쪽인지는 사람이 고른다

onboarding 모드에서 PR 상태 체크가 평소처럼 붙는지와 CLI 가 출력하는 "Continue setup at ..." 이 사람 작업을 더 요구하는지는 확인이 필요하다. §6 에 미확인으로 넣는다.

## Major

### M1. 팀 전원이 admin 이고 Step 9 의 2 가 적은 GitHub 화면 경로가 낡았다. bypass 탈출구를 확인하는 단계가 없다

**근거:**
- `gh api 'repos/Quizly-Team/app/collaborators?affiliation=all'` 결과는 `fnzl54`, `yura0302`, `yeonchaepark` 셋이고 셋 다 `role_name: admin` 이다 (2026-11-27). `dev` 와 `main` 은 `protected: false`, `rulesets` 는 `[]` 다
- 계획 461행은 "Add rule" 과 "Save changes" 라고 적는다. Chromatic 문서의 표기를 그대로 옮긴 것이다. GitHub 문서 `managing-a-branch-protection-rule` 의 지금 버튼은 "Add classic branch protection rule" 이고 마지막 버튼은 "Create" 다. 같은 문서가 대안으로 rulesets 를 안내한다 (WebFetch 2026-11-27)
- GitHub `about-rulesets` 문서에서 ruleset 은 bypass 를 명시적으로 준 역할만 우회한다. admin 을 기본으로 면제한다는 문장은 없다. 계획 138행이 기대는 "기본값에서 admin 에게 적용되지 않는다" 는 classic rule 의 성질이다

**결과:**
1. §5 Chromatic 4 (548행) 의 "admin 이 아닌 계정에서 머지 버튼이 비활성이다" 를 해 볼 계정이 없다
2. 전원이 admin 이고 bypass 를 허용하면(138행), 게이트는 "기본은 막히고 체크박스 하나로 풀린다" 가 된다. §1 (28행) 의 "토큰 변경이 사람 눈을 거치지 않고는 머지되지 않는다" 와 Step 0-3 (126행) 의 required 근거에 이 전제가 적혀 있지 않다
3. 사람이 Settings > Branches 에서 "Add branch ruleset" 을 고르면 §6-8 (한도 소진), §6-15 (fork PR), §6-21 (워크플로 없는 브랜치) 의 탈출구가 모두 사라진다. 한도가 차면 리셋 때까지 어떤 PR 도 머지되지 않는다
4. §5 어디에도 bypass 가 실제로 되는지 보는 단계가 없다. 한도 소진 리스크에 대한 대응이 이 탈출구 하나뿐이다

**고칠 것:** Step 9 의 2 를 "Add classic branch protection rule" 과 "Create" 로 쓰고 ruleset 은 쓰지 않는다고 적는다. §5 Chromatic 4 는 admin 계정 기준으로 바꾼다. 기대 결과는 "머지 버튼이 기본으로 비활성이고, bypass branch protections 체크박스가 보인다" 다. 전원이 admin 이라 게이트가 의도적 bypass 로 풀린다는 사실을 Step 0-3 에 적는다. 그것을 받아들일지, 일부 계정을 write 로 내릴지는 사람이 정할 항목으로 올린다.

### M2. "기본 폭 1200 하나, phone 배치는 스냅샷에 없다" 와 mode 도입 조건이 정본 문서에 남지 않는다

**근거:**
- Step 7 이 정본에 넣는 문구(396~397행)는 "PR 마다 스냅샷을 baseline 과 비교한다. 웹 근사이고 기기 렌더링이 아니다" 와 머지 조건뿐이다. mode 도입 조건은 이 계획의 §1 (30행), Step 0-5 (171행), §6-1 (570행) 에만 있다
- `.claude/agents/planner.md:17-24` 의 "반드시 읽는 것" 에 다른 계획 문서는 없다
- `src/shared/layout/breakpoint.ts:7` 이 `width >= TABLET_MIN_WIDTH` (768) 이다. 기본 폭 1200 에서는 언제나 `tablet` 이다
- `.claude/agents/layout-auditor.md:42` 가 이름에 `Tablet`, `Phone` 이 붙은 것을 잡는다. 폰 배치를 스냅샷으로 남길 길은 mode 하나뿐이다

**결과:** `useBreakpoint` 를 쓰는 첫 컴포넌트의 planner 는 정본에서 "시각적 테스트가 있다" 만 읽는다. 그대로 story 를 붙이면 phone 배치는 한 번도 찍히지 않고 `UI Tests` 는 초록이다. 이 프로젝트에서 가장 흔한 사고인 "태블릿만 보고 폰 빼먹기" 가 게이트 안에서 일어난다. (b) 의 하드 룰(`rh-plan/SKILL.md:60`)과는 이 PR 에서는 충돌하지 않는다. 그러나 이 PR 이 다음 PR 의 충돌을 예약한다.

**고칠 것:** Step 7 이 고치는 스택 행(SKILL.md 와 CLAUDE.md)에 한 구절을 더한다. 예: "mode 없음. Chromatic 기본 폭 1200 하나로 찍는다. `useBreakpoint` 를 쓰는 컴포넌트의 story 를 처음 넣는 PR 이 tablet, phone mode 를 함께 넣는다 (`docs/ai/plan/storybook-chromatic.md` §6-1)".

### M3. 팔레트가 잡는 토큰 변경의 범위가 §1 주장보다 좁다. Radius story 는 상자 변 길이에 따라 값 변경을 놓친다

**근거:** 28행의 굵은 글씨 "토큰 변경이 사람 눈을 거치지 않고는 머지되지 않는다", 그리고 105행 Step 0-2 D 의 근거 (2).

1. §2 44행이 `OPACITY` 와 `LAYOUT` 을 팔레트에서 뺀다. 그래서 가장 기다리는 토큰 변경인 `touch-min` 40 에서 44 로의 변경(plan 1:148, plan 1 §6-1)이 스냅샷에 나오지 않는다. 그 PR 에서는 plan 1 의 `theme.test.ts` 값 고정(plan 1:172, 186-191)이 깨지므로 안전에 구멍이 나지는 않는다. 그래도 §1 의 문장은 거짓이다
2. Step 4 는 Radius 상자의 변 길이를 정하지 않는다. 297행에도 없고 303행은 "`SPACING` 에서" 라고만 적는다. CSS 는 이웃한 반지름의 합이 변보다 크면 모든 반지름을 같은 비율로 줄인다 (CSS Backgrounds 3, Overlapping Curves). 그래서 변 s 에서 r 이 s/2 이상인 토큰은 모두 같은 원으로 그려진다. 토큰은 RADIUS `xl 24`, `2xl 32`, `full 9999` (plan 1:145) 이고, 변 길이 후보는 SPACING `48, 64, 80` (plan 1:144) 이다. 변이 48 이면 셋이 같은 원이고, 64 면 `2xl` 과 `full` 이 같다. 8개가 모두 갈리는 변은 `SPACING["80"]` 하나뿐이다. 겹치는 범위 안에서 값이 바뀌면(예: 변 48 에서 `2xl` 이 32 에서 28 로) 픽셀 diff 가 0 이라 `UI Tests` 가 저절로 통과한다. §5 수동 5 (539행) 는 `none` 과 `full` 만 본다
3. Typography, Spacing, Radius 는 이름만 쓰고 값은 쓰지 않는다 (294~297행). Chromatic threshold 문서는 "By default, Chromatic detects anti-aliased pixels and ignores them" 라고 적는다. `letterSpacing -0.06` 처럼 작은 변경이 diff 를 내는지는 **확인이 필요하다**

**고칠 것:** 네 story 모두 Colors 처럼 값 글자를 같이 쓴다 (예: `xl 24`, `text-1rg/regular 16/24/-0.06/400`). 값이 바뀌면 글자가 바뀌므로 도형 모양과 상관없이 diff 가 난다. 디자이너가 피그마 Variables 의 숫자와 맞대 보기도 쉬워진다(README 4번 "글자 크기와 굵기와 줄 높이"). 리터럴이 아니라 토큰에서 온 값이라 Step 4 의 "숫자 리터럴 0개" 와도 충돌하지 않는다. §1 과 Step 0-2 의 문장은 "팔레트가 그리는 네 export 의 변경" 으로 좁힌다.

## Minor

- **m1. (d) README 3번이 SHA 갱신 뒤 거짓이 되는데 고칠 자리가 없다.** 407행은 "`glass/tint` ... 는 `tokens.json` 에 없어서 안 보인다" 를 지금 SHA 기준의 사실로 적는다. 그런데 plan 1:221 은 SHA 를 올리는 PR 의 diff 를 SHA 한 줄, `theme.ts`, `theme.test.ts` 로 묶고 "다른 변경을 섞지 않는다" 라고 적는다. 디자이너가 재Push 한 뒤 SHA 를 올리면 README 가 거짓이 된다. `boxShadow` 로 들어오면 여전히 안 보이지만 "tokens.json 에 없어서" 라는 이유가 틀린다(plan 1 §6-14). README 문구를 "`theme.ts` 머리의 SHA 기준" 으로 쓰거나, plan 1 쪽 예외 목록에 README 를 더하라고 넘긴다
- **m2. (d) plan 1 참조 문구가 낡았다.** 144행과 571행은 "개정 중", 622행은 "plan 1 3회차 Step 3 의 모양을 전제한다" 라고 적는다. plan 1 은 이미 4회차다(plan 1:17). 4회차 Step 3 표(plan 1:141-148)는 이 계획의 전제와 같다(아래 확인). builder 가 Step 0-4 의 1 을 대조할 기준이므로 "plan 1 4회차 Step 3" 으로 고정한다. plan 1 4회차는 아직 비평을 받지 않았다(`docs/ai/plan-critique/1.md:3-4` revise, rounds 3). 다만 Step 0-4 의 머지 조건이 막아 주니 문구만 고치면 된다
- **m3. (b) "팔레트는 폭에 반응하지 않는다" 를 자동으로 검사하지 않는다.** 근거는 Step 4 의 규칙("`View`, `Text`, `StyleSheet` 만")과 §5 수동 로컬 6 뿐이다. §5 자동 9 에 `! grep -nE 'useBreakpoint|useWindowDimensions|Dimensions' src/shared/constants/theme.stories.tsx` 한 줄을 더하면 Step 0-5 의 전제가 기계로 고정된다
- **m4. (c) 한도 측정을 추적할 곳이 없고, bypass 뒤 무엇이 남는지 적혀 있지 않다.** 577행의 "도입 2주 뒤 Billing 화면" 은 담당도 추적물도 없다. Step 8 의 이슈 1 은 이 PR 로 닫힌다. 한도가 차서 bypass 로 머지한 변경은 리셋 뒤 다음 빌드에서 diff 로 다시 뜬다. 126행이 required 를 거는 이유로 든 바로 그 현상이다. Step 8 에 측정 이슈를 두고, §6-8 에 "bypass 한 PR 목록을 남긴다" 한 줄을 더한다

## 확인한 것

### (a) `flattenColors` 와 plan 1 의 `COLORS`

| 주장 | 확인 결과 |
| --- | --- |
| plan 1 이 정본으로 적은 export 모양 | plan 1:141-148 (4회차). `COLORS` 는 중첩이고 최상위 12, 리프 50. `TYPOGRAPHY["text-3xl"].bold = { fontSize, lineHeight, letterSpacing, fontWeight }`. `SPACING` 과 `RADIUS` 는 평평한 숫자 레코드. 이 계획 144행의 전제와 같다. 4회차 변경 목록(plan 1:22)에서 Step 3 은 "파일 머리" 만 바뀌었다 |
| 실제 토큰의 모양 | `gh api` 로 얻은 `d9f02130e111aabcb2cb7b32829982f3767a4b7a` 의 `tokens.json` 을 받아 `[DS] Semantic/Light` 의 `$type: color` 리프를 셌다. 50개다. 깊이는 2단 33개, 3단 17개, 1단 0개. 최상위 그룹 12개. `$value` 는 전부 문자열(참조 또는 hex)이다. 리프이면서 그룹인 경로 0, 키 안의 `/` 0, 정수형 키 0. 그래서 `Object.entries` 순서가 선언 순서와 같다 |
| 시그니처가 `as const` 중첩 객체를 받는다 | 위 모양 그대로 `as const` 객체를 생성했다. `expo/tsconfig.base.json` 을 extends 하고 `strict` 를 켠 스크래치 프로젝트에서 이 레포의 `tsc 6.0.3` 으로 `flattenColors(COLORS)` 를 typecheck 했다. exit 0 |
| 런타임 결과 | 같은 객체에서 50개가 나왔다. 처음은 `primary/normal`, 끝은 `shadow/key-strong` 이다. Step 3 테스트의 입력은 계획의 기대 배열과 같은 값을 냈다 |
| 필요한 함수인가 | 필요하다. 2단과 3단이 섞여 있어서 `Object.entries` 를 두 번 고정으로 돌리면 3단 17개를 놓친다. 재귀가 필요하고 분기가 있는 순수 로직이다. story 는 RN 을 import 하므로 RN 이 없는 모듈로 빼야 vitest 가 돈다(`CLAUDE.md` 구조 절, `rh-plan/SKILL.md:58-59`). 위치 `src/shared/constants/` 는 plan 1 의 `theme.test.ts` 와 같은 폴더라 따로 문제 삼지 않았다 |
| `Meta`, `StoryObj` 를 framework 에서 가져온다 | `@storybook/react-native-web-vite@10.6.9` `dist/index.d.ts:3` 이 `export * from "@storybook/react"` 다 |

### (b) mode 제거와 두 사이즈 규칙

- `rh-plan/SKILL.md:60` 은 "검증에 태블릿과 폰 두 사이즈를 모두 적는다" 이다. §5 기기 절(560~562행)에 태블릿, 폰(AVD 선행 조건), iOS 가 있다. 이 PR 은 앱 런타임을 바꾸지 않고 §5 자동 6 이 번들 무변경을 본다. **이 PR 에서 충돌은 없다.** 문제는 다음 PR 쪽이고 M2 로 올렸다
- 팔레트가 폭에 반응하지 않는다는 근거는 Step 4 의 import 제한, 폭 decorator 금지, `flexWrap` 만 허용하는 규칙(302, 305, 306행)과 §5 수동 로컬 6 이다. 수동 확인은 할 수 있다. 자동 검사는 없어서 m3 으로 올렸다
- `app.json:6` 이 `"orientation": "portrait"` 다. §6-1 의 세로 프레임 규칙과 맞는다

### (c) required check 와 사람 작업

- 사람 작업이 분리돼 있다. §3 72행, Step 9 의 "그다음은 **사람이**" (458행), `builder.md:57` 의 "`git commit` / `git push` / `gh pr create` 를 절대 하지 않는다" 가 서로 맞물린다
- Chromatic `mandatory-pr-checks` 의 상태 목록(시각 변경 pending, 한도 소진 시 상태 없음, 실행 안 되면 무기한 pending)은 [^mandatory] 의 인용과 같다 (WebFetch 2026-11-27)
- 요금 페이지: Free 는 5,000 billed snapshots 이고 Chrome 만이다. UI Review 와 공개 게시가 Free 에 포함되는지는 페이지 텍스트로 확정할 수 없다. §6-10 이 미확인으로 남긴 것이 맞다
- 경로 필터를 쓰지 않는 판단(378행)은 "Pending indefinitely" 와 맞는다. §6-21 의 원격 브랜치가 `dev`, `main` 둘이라는 것도 확인했다

### (d) plan 1 의 SHA 고정

- §5 Chromatic 5 (549행)는 값이 다르면 "plan 1 이 고정한 SHA 의 `tokens.json`" 과 대조한다. plan 1:51, 98-100 과 맞는다
- SHA 갱신 PR 의 diff 범위(plan 1:221)와 이 계획의 게이트는 충돌하지 않는다. Chromatic 의 Accept 는 diff 를 만들지 않는다. 이 계획은 `scripts/build-tokens.mjs`, `theme.ts`, `theme.test.ts` 를 건드리지 않는다 (70행, 커밋 목록 439~451행)
- Step 7 이 가리키는 줄 번호를 지금 파일로 확인했다. CLAUDE.md 64, 137, 164행과 SKILL.md 27, 101, 165행이 계획의 서술과 같다. plan 1 Step 7 이 고치는 CLAUDE.md 74, 76행과 SKILL.md 57, 59, 62행은 이보다 앞에 있다. 줄이 밀려도 계획이 "`플랫폼` 아래" 같은 앵커를 같이 적었으니 찾을 수 있다

### 2회차 Minor 반영

| 2회차 | 확인 결과 |
| --- | --- |
| m1 7-3 키 범위 | 484행 패턴이 `(projectToken|CHROMATIC_PROJECT_TOKEN):...` 이다. 계획 YAML(341~364행)을 스크래치에 그대로 두고 `/usr/bin/grep` 으로 돌렸다. 7-1, 7-2, 7-3 모두 exit 0 이었다. env 평문은 1행 매치, env 시크릿 참조는 0행이다. **닫힘** |
| m2 7-2 판정 기준 | 482행이 `test "$(grep -cF ...)" -eq 1` 이다. **닫힘** |
| m3 appid | Step 0-4 의 칸(153~155행)이 있고, 비어 있으면 builder 가 멈춘다. **닫힘** |
| m4, m5 피그마 | 표가 이 PR 에서 사라졌다. 규칙은 §6-1 에 옮겨 남았다. 레포의 피그마 URL 은 0건이다(위 2회차 비평 본문의 도메인 언급 1건만 있다). **닫힘** |

### 그 밖

- 레포 사실: `.github/` 가 없다. `.gitignore` 에 storybook 항목이 0건이다. `builder.md:7` 의 tools 에 Figma MCP 가 없다. 계획의 서술과 같다
- 서버 계약: 백엔드를 타지 않는다. `quizly-be-contract` 로 조회할 대상이 없다
- 금지 사항: `theme.ts` 를 고치지 않는다. 플랫폼 파일, `git add -A`, 토큰 평문, `.claude/` gitignore 가 없다. 새 위반은 찾지 못했다

---

# 4회차 비평 (계획 4회차 개정 대상, 2026-11-27)

verdict: **sound**

## 판정 근거

3회차의 Critical 1, Major 3, Minor 4 는 모두 닫혔다. 첫 빌드를 갈래 A 와 P 로 가른 순서(계획 495~509행)와 §5 Chromatic 2 의 판정표(609~613행)는 auto-accept 와 pending 어느 쪽이 와도 실행할 수 있다. 둘이 어긋나면 멈추는 셋째 행도 있다. classic rule 과 admin 기준 확인(617~628행)은 지금 레포 상태와 맞는다. 보호 없음, ruleset 0, 협업자 셋 전원 admin 이다. 임시 PR 을 draft 로 열지 않는 판단도 근거가 맞다. 이번 개정이 새로 만든 결함은 넷을 찾았다. 모두 bypass 탈출구나 사람 판단으로 넘어갈 수 있고 틀린 결과를 내지 않아서 Minor 로 둔다. Critical 0, Major 0 이라 `sound` 다.

## 지난 지적 반영 확인

| 지적 | 반영 위치 | 판정 |
| --- | --- | --- |
| C1 | Step 0-3 근거 2 (138행), Step 9 의 1~6 (497~507행), §5 Chromatic 1~6 (606~633행), §6-23 (675행). 3회차의 고칠 것 셋도 들어갔다. 머지 전 디자이너 비교는 Step 9 의 4, 성공 직후 보호는 Step 9 의 2, 다른 경로의 막힘 확인과 사람 선택은 Step 9 의 6 과 Step 0-4 표 (171행) 다. onboarding 미확인 둘은 §6-23 의 (1), (2) 이고 (3) Build 2 가 더해졌다 | 닫힘 |
| M1 | Step 0-3 규칙 종류 표 (141~151행), 전원 admin 문단 (153행). Step 9 의 2 (498행) 가 "Add classic branch protection rule", "Create", ruleset 금지, "Do not allow bypassing" 끔을 적는다. §5 Chromatic 4 (617~628행) 는 admin 기준 기대 결과와 bypass 가 머지 버튼을 여는지를 본다. 사람 결정 칸은 172행 | 닫힘 |
| M2 | Step 7 (427행) 이 `quizly-app-conventions/SKILL.md` "태블릿에서 폰으로" 표에 행을 더한다. 표 머리는 SKILL.md:64, 앵커 `터치 타겟` 은 SKILL.md:73 이다. `planner.md:19` 의 1번이 이 파일이다. `CLAUDE.md` 에는 이 표가 없다 (grep 0건). 내 제안(스택 행, 두 파일)과 다르지만 한 곳에 두는 쪽이 낫다 | 닫힘 |
| M3 | §1 (29, 31행) 과 Step 0-2 (108행) 가 네 export 로 좁혔다. Step 4 표 (317~320행) 는 네 story 모두 값 글자를 쓰고 Radius 변을 `SPACING["80"]` 로 고정한다. §2 (47행) 와 §6-26 (678행) 은 `OPACITY`, `LAYOUT` 을 뺀 근거와 남는 구멍을 적는다. 근거로 든 plan 1 단언은 plan 1:198 (OPACITY 2값), 199 (`text-1rg`), 202 (LAYOUT 전체) 에 그대로 있다 | 닫힘 |
| m1 | README 3번 (439행) 을 SHA 에 묶었고 §5 자동 10 (571~584행) 이 본다 | 닫힘 |
| m2 | "5회차" 로 고쳤다 | 다시 낡았다 (n2) |
| m3 | §5 자동 9 셋째 줄 (568행) | 닫힘 |
| m4 | Step 8 이슈 3 (465행), §6-8 (660행), Step 7 머지 행 (428행) | 닫힘 |

## 임시 PR 을 draft 로 열지 않는 판단

근거가 맞다. GitHub 문서 `about-pull-requests` 원문이 "Draft pull requests cannot be merged" 다 (WebFetch 2026-11-27). (가) 가 보려는 것은 §5 Chromatic 6 (632행) 의 "머지 버튼이 비활성이고 bypass 체크박스가 보인다. 켜면 머지 버튼이 활성이 된다" 다. draft 에서는 required check 와 상관없이 머지가 막히므로 이 관찰 자체가 성립하지 않는다. 3회차에 draft 를 제안한 이유는 실수 머지 방지였다. 일반 PR 이어도 `UI Tests` 가 pending 인 동안은 bypass 체크박스를 켜지 않으면 머지되지 않는다. 제목 표시(505행)와 관찰 직후 닫기도 있다. 남는 틈은 Build 2 도 auto-accept 되어 초록이 되는 경우다. 그때도 닫고 (나) 로 간다고 적혀 있다 (632행). 505행의 "구별되지 않는다" 보다 "관찰할 것이 없다" 가 정확하지만 결론은 같다.

## Critical

없음.

## Major

없음.

## Minor

- **n1. 보호를 건 뒤 이 PR 이 머지될 때까지 `dev` 로 가는 다른 PR 은 bypass 로만 머지된다. Step 9 의 4 가 바로 그런 PR 을 요구한다.** Step 9 의 2 (498행) 에서 보호를 걸고 7 (508행) 에서 머지한다. 그 사이 `dev` 에는 `chromatic.yml` 이 없다 (`.github/` 없음, 실측). 그래서 `dev` 에서 딴 브랜치에서는 Chromatic 이 돌지 않고 `UI Tests` 가 "Pending indefinitely" 다. §6-21 (673행) 의 대처 "`dev` 를 그 브랜치로 머지해 오면" 은 이 구간에서 효과가 없다. Step 9 의 4 (502행) 와 §5 Chromatic 5 (629행) 의 변환 버그 경로는 "고친 `theme.ts` 가 `dev` 에 들어오면" 을 전제한다. 그 plan 1 수정 PR 이 이 경우에 해당한다. 디자이너 비교를 기다리는 만큼 구간이 길어진다. 전원 admin 이라 bypass 로 풀리고 결과는 틀리지 않는다. 고칠 것: §6-21 에 "Step 9 의 2 부터 7 사이" 를 더하고, 그 구간의 PR (특히 plan 1 수정 PR) 은 admin bypass 로 머지하고 이슈 3 에 남긴다고 적는다. 갈래 A 에서는 보호를 Step 9 의 4 뒤, 6 앞으로 옮기면 구간이 줄어든다. 2026-11-27 현재 열린 PR 은 0개이고 원격 브랜치는 `dev`, `main` 둘이다
- **n2. plan 1 참조가 한 회차 뒤졌다.** plan 1 은 이 계획을 저장한 1분 뒤 6회차가 됐다 (`docs/ai/plan/1.md:19`, 파일 시각 15:09 와 15:10). 159, 654, 715행의 "plan 1 5회차 Step 3 (`docs/ai/plan/1.md` 153~170행)" 은 지금 Step 2 를 가리킨다. Step 3 은 167~184행이다. 159행과 654행의 "비평 rounds 3" 도 지금은 rounds 4 다 (`docs/ai/plan-critique/1.md:4`). 내용은 바뀌지 않았다. 6회차 Step 3 표 (plan 1:171~178) 의 네 export 모양은 같다. 머리가 4줄이 됐지만 SHA 는 2행 그대로라 §5 자동 10 의 `head -3` 은 여전히 맞다 (plan 1:26, 169). 다만 builder 가 줄 번호로 찾으면 엉뚱한 곳을 연다. "plan 1 의 `### Step 3: theme.ts export 모양`" 처럼 제목으로 가리키면 다시 낡지 않는다. 같은 김에 §5 자동 10 (571행) 의 "plan 1 Step 7-2 의 조회 블록과 같은 경로" 는 틀린 서술이다. Step 7-2 블록 (plan 1:294~297) 은 `api.github.com` 이고 raw URL 은 plan 1:126 (Step 1 입력) 이다
- **n3. (가) 에서 `Spacing` 이 "변경 없음" 으로 나오는 결과의 갈래가 없다.** 632행은 "그 빌드도 auto-accept" 인 경우만 다룬다. 글자 하나를 바꿨는데 diff 가 없으면 막힘을 보이지 못한다. 동시에 Step 4 (322행) 와 §1 의 "값 글자가 바뀌면 diff" 전제가 반증된다. 공백 자리에 글리프가 새로 생기는 변경이라 그럴 가능성은 낮다. §6-24 (676행) 에 "변경 없음이면 머지하지 않고 보고한다. §1 의 범위 문장을 다시 본다" 한 줄이면 된다
- **n4. 임시 PR 의 이슈 연결이 적혀 있지 않다.** `CLAUDE.md:158` 은 "예외 없이 이슈 to 브랜치 to PR" 이다. 505행은 브랜치 이름과 제목만 정한다. 본문에 `Refs #<이슈 1>` 을 쓰고 `Closes` 는 쓰지 않는다는 한 줄을 두면 이 예외가 기록에 남는다

## 확인한 것

- **레포 상태 (`gh api`, 2026-11-27).** `branches/dev/protection` 은 `Branch not protected (HTTP 404)` 다. `rulesets` 는 `0`, 협업자는 `fnzl54`, `yura0302`, `yeonchaepark` 셋이고 전원 `admin` 이다. 열린 PR 0개, 원격 브랜치는 `dev` 와 `main` 이다. 617행의 "보호 전 첫 줄" 서술, 153행, 673행과 같다
- **617행의 `gh api` 두 줄.** 비 TTY 에서 `--jq` 배열 출력은 `["app",false,true]` 같은 한 줄 JSON 이다. 기대 모양 `[[...],false]` 과 같은 꼴이다. TTY 에서의 표시 형식은 확인하지 않았다
- **§5 자동 10 의 판정식.** `d9f02130e111aabcb2cb7b32829982f3767a4b7a` 의 raw `tokens.json` 에 그대로 돌렸고 `false false` 가 나왔다. SHA 가 비면 `node` 가 JSON 파싱 에러로 죽는다. 조용한 통과가 없다
- **`SPACING["80"]` 이 사라지면 typecheck 가 깨진다 (324행).** `as const` 객체에 없는 키를 이 레포의 `tsc --strict` 에 넣었다. `TS7053`, exit 2 다
- **Radius 변 80 (324행, §5 수동 5).** RADIUS 값 (plan 1:175) 에서 `2xl` 32 와 `xl` 24 는 모두 40 미만이라 원이 되지 않는다. `full` 9999 만 원이다. 8개가 모두 갈린다
- **Typography 라벨 (318행, §5 수동 3).** `16/24/-0.06/400` 은 plan 1:199 의 고정값 `{ fontSize: 16, lineHeight: 24, letterSpacing: -0.06, fontWeight: "400" }` 과 같다. `String("400")` 이라 문자열 `fontWeight` 여도 글자가 같다
- **Step 7 앵커 (425~431행).** SKILL.md 27 (`플랫폼`), 73 (`터치 타겟`), 101 (`export default`), 165 (`PR`), CLAUDE.md 64, 137, 164 가 계획 서술과 같다. `planner.md:19`, `layout-auditor.md:42` 도 같다
- **금지 사항.** `theme.ts` 를 고치지 않는다. 플랫폼 파일과 화면 두 벌이 없다. 커밋은 파일을 명시한다 (475~489행). 토큰 평문이 없다. 새 위반을 찾지 못했다
- **범위.** 백엔드를 타지 않는다. 이번 회차에서 §2 에 새로 들어온 행은 `OPACITY`, `LAYOUT` 하나다. 사람 결정이 정한 범위(색, 타이포, 간격, 라운딩)와 plan 1 의 테스트 고정을 근거로 든다. 꼭 필요한데 밀어낸 것으로 보지 않았다
