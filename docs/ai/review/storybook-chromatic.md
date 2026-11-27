---
id: storybook-chromatic
verdict: approve
gate: PASS
---

## 판정 근거

diff 는 계획 §3 의 파일 12개와 정확히 같고 그 밖을 건드리지 않았다. `theme.ts`, `app.json`, `src/app/**`, `src/shared/layout/**`, `check-gate.sh` 는 변경이 없다. 새 파일 다섯 중 `.storybook/main.ts`, `chromatic.yml`, `flattenColors.ts`, `flattenColors.test.ts` 는 계획 본문과 같다. 다른 곳은 채워 넣은 SHA 와 날짜, 그리고 oxfmt 의 줄바꿈뿐이다. `theme.stories.tsx` 는 Step 4 의 규칙을 전부 지킨다. 게이트를 직접 돌려 네 줄 `ok` 와 `PASS` 를 봤다. `npm run build-storybook` 은 exit 0 이고 story 는 4개다. 그 직후 다시 돌린 게이트도 `PASS` 다. `chromaui/action` 의 고정 SHA 는 annotated tag `v18` 이 가리키는 커밋(`v18.15.3`)과 같다. 레포 전체에서 토큰 평문은 계획 문서의 예시 문자열뿐이다. Android export 의 source map 에서 storybook 과 stories 경로는 0건이고, 같은 map 에 `src/app/*.tsx` 는 있다. builder 가 보고한 이탈 셋은 모두 받아들인다. (a) 는 캐스팅이 아니라 할당 검사를 받는 제네릭이다. 오히려 계획 문장대로 쓰면 생겼을 `any` 를 막는다. Critical 과 Major 가 없어 approve 다.

## Critical

없다.

## Major

없다.

## Minor

### m1. `npm audit` moderate 7건 중 3건은 dev 전용이 아니고, 이 PR 이 만든 것도 아니다

`package-lock.json`. 7건은 두 묶음이다.

| 묶음 | 패키지 | lockfile 표시 | HEAD 에도 있나 |
| --- | --- | --- | --- |
| 새로 생김 4건 | `@storybook/react-native-web-vite`, `@storybook/react-vite`, `@joshwooding/vite-plugin-react-docgen-typescript`, `glob@13.0.7` | `dev: true` | 없다. 이 PR 이 들였다 |
| 기존 3건 | `expo`, `@expo/fingerprint`, `minimatch@10.2.6` | prod 트리 | 있다. HEAD 의 `package.json` 과 lockfile 로 `npm audit --package-lock-only` 를 돌리면 정확히 이 3건이다 |

`npm audit --omit=dev` 는 3건이다. 새 4건은 dev 전용이고 앱 번들에 없다 (§5 자동 6, 아래 확인 기록). 깨지는 시나리오: PR 본문에 "7건 모두 dev 전용" 이라고 적으면 사실이 아니다. 읽는 사람은 expo 쪽 3건을 이 PR 의 것으로 오해하거나, prod 트리에 걸린 기존 권고를 놓친다. PR 본문에는 "새로 생긴 4건은 dev 전용이다. 나머지 3건은 HEAD 부터 있던 expo 경로다" 로 적는다. `npm audit fix --force` 가 내놓는 해법은 `@storybook/react-native-web-vite@8.5.3`, `expo@52.0.49` 로 내리는 semver major 다. 쓰면 안 된다.

## 계획 범위 밖

1. **expo 경로의 기존 moderate 3건.** `minimatch` `>=7.0.0 <11.0.1` 의 "potential denial of service via globparts amplification" 이 `@expo/fingerprint` 를 거쳐 `expo` 에 걸린다. 이 PR 과 무관하다. 자동 해법은 expo 메이저 하향뿐이다. CLAUDE.md 의 "작업 중 발견한 별개 버그도 즉시 이슈화한다" 에 따라, 추적 이슈를 만들지 사람이 정한다. 이 PR 에서 `overrides` 로 손대지 않는다.

## builder 이탈 판정

### (a) `theme.stories.tsx:20` 의 `Object.entries<TextStyle>(weights)`: 받아들인다

강제 캐스팅과 같은 효과가 아니다. /tmp 에서 이 레포의 `node_modules` 와 `tsc 6.0.3` (`strict`) 로 확인했다.

- 명시 제네릭은 인자를 `{ [s: string]: TextStyle }` 에 **할당**할 수 있는지 검사한다. `as` 는 한쪽 방향으로만 겹쳐도 통과하는 **비교** 검사다. 값이 `{ fontSize: number | string }` 인 객체를 넣으면 `Object.entries<TextStyle>(x)` 는 TS2345 로 막히고, `x as Record<string, TextStyle>` 는 통과한다. `fontSize: "16"` 같은 틀린 토큰도 제네릭 쪽에서 TS2345 로 막힌다. 즉 다음 `tokens:build` 가 `TextStyle` 에 맞지 않는 값을 내면 typecheck 가 깨진다
- 제네릭을 빼면 `weights` 가 키가 다른 객체들(`bold` 계열과 `semibold` 계열)의 유니온이라서, `Object.entries` 가 `entries(o: {}): [string, any][]` 오버로드로 떨어진다. 그러면 `style` 이 `any` 다 (같은 실측에서 `0 extends 1 & T` 로 확인했다). 계획 Step 4 의 "`Object.entries` 두 번" 을 글자 그대로 쓰면 `any` 가 라벨과 `style` prop 으로 새고, 컨벤션 "`any` 금지" 에 걸린다. 이 제네릭이 그걸 막는다
- 잃는 것은 리터럴 타입(`16`)이 `number | undefined` 로 넓어지는 것뿐이다. 값이 빠진 토큰이 생기면 라벨에 `undefined` 가 **보인다**. 조용히 빠지지 않는다

### (b) `CLAUDE.md:143-144` 의 명령 2줄 위치: 받아들인다

계획은 "137행 아래", 즉 `npm run format:check` 바로 다음이었다. 거기 넣으면 바로 아래 줄 `check-gate.sh # 위 4개를 한 번에` 의 "위 4개" 가 일곱 줄짜리 묶음을 가리키게 되어 거짓이 된다. builder 는 check-gate 묶음 아래에 별도 묶음으로 넣었다. 명령과 주석 2줄의 내용은 계획과 같고, 위 문장도 참으로 남는다.

### (c) `CLAUDE.md` 의 스택 표와 작업 흐름 표 재정렬: 받아들인다

내용 변경은 없다. diff 의 각 줄에서 공백을 하나로 접어 비교하면, 지워진 줄과 더해진 줄이 일대일로 같다. 남는 것은 더한 두 행(65행 `시각적 테스트`, 169행 `머지`), 명령 2줄, 빈 줄 하나뿐이다. `git diff --ignore-all-space --stat CLAUDE.md` 는 7 insertions, 2 deletions 다. 그 2줄은 두 표의 구분선이고, 대시 길이만 바뀌었다. `git diff --word-diff` 에서도 기존 셀 글자에는 표시가 없다. `CLAUDE.md` 는 `.oxfmtrc.json` 의 `ignorePatterns` (`docs/**`, `.claude/**`) 밖이다. 그래서 정렬하지 않으면 게이트의 format 이 FAIL 한다. 강제된 변경이다.

## 확인 기록

| 항목 | 방법 | 결과 |
| --- | --- | --- |
| 게이트 | `.claude/scripts/check-gate.sh` 직접 실행 | typecheck, lint, test, format 모두 `ok`. `PASS`, exit 0 |
| Storybook 빌드 (§5 자동 3) | `npm run build-storybook` | exit 0. `storybook-static/index.json` 의 story 가 4개다 (`foundations--colors`, `--typography`, `--spacing`, `--radius`). 경고는 chunk 크기 하나뿐 |
| 빌드 뒤 게이트 (§5 자동 5) | 게이트 재실행, `git status --porcelain` grep | `PASS`, 0건. `storybook-static/` 는 ignored 다 |
| action SHA | `gh api repos/chromaui/action/git/ref/tags/v18` 가 tag object `ca77179` 를 주고, 그 object 를 따라가면 commit `0a7067e5ffc663a631b14db505d8a94b26e1bf2f` 다 (`v18.15.3`, 2026-11-24). `commits/v18` 도 같은 값이다 | `chromatic.yml:22` 와 같다. 레포는 fork 가 아니고 archived 도 아니다. action 은 번들된 `action/register.cjs` 를 `node24` 로 돈다 |
| `checkout@v7`, `setup-node@v7` | `git/ref/tags/v7` | 둘 다 있다 |
| 트리거와 권한 | 파일 읽기 | 트리거는 `on: push` 하나다. `pull_request` 와 `pull_request_target` 이 없다. fork 는 base 레포에 push 이벤트를 만들지 않으므로 시크릿에 닿지 않는다. `permissions` 는 `contents: read` 하나다. action 의 `token` input 은 넘기지 않는다 |
| §5 자동 7 | 7-1, 7-2, 7-3 원문 | 셋 다 exit 0. 음성 대조는 /tmp 사본에서 돌렸다. 7-2 는 중복 줄 1개로, 7-3 은 `env` 평문으로 둘 다 exit 1 이었다. builder 가 남긴 `/tmp/qz-w.yml` 과 지금 파일은 `cmp` 0 이다. `.github/probe.yml` 은 없다 |
| 토큰 평문 | `chpt_`, §5 자동 7-3 패턴, `--project-token` 값. `node_modules`, `.git`, `storybook-static` 을 빼고 레포 전체를 시스템 grep 으로 찾았다 (untracked 포함, `git grep` 아님). `storybook-static` 은 따로 찾았다 | 매치는 `docs/ai/plan/storybook-chromatic.md` 534, 546, 551, 552, 556행의 예시(`chpt_abc123`, `dummy`)뿐이다. 빌드 산출물은 0건, git 이력 `-S chpt_` 도 0건 |
| devDependency (§5 자동 8) | `package.json`, lockfile, `npm ls` | lockfile 에서 `storybook` 과 `@storybook/react-native-web-vite` 둘 다 `10.6.9`, `dev: true` 다. 기존 패키지는 버전 변경 0, 삭제 0 이고, 추가는 189개다. `vite` 는 8.3.8 한 벌이다. `react-native-web` 은 0.21.4 다. `typescript` 는 루트 6.0.3 과 중첩 5.9.3 (`vite-plugin-rnw`, `tsconfck`) 두 벌이다. `npx tsc --version` 은 6.0.3 이다 |
| CI 설치 | /tmp 에 `package.json` 과 lockfile 만 두고 `npm ci --dry-run --ignore-scripts` | exit 0. lockfile 에 `@esbuild/linux-x64` 를 포함한 Linux 바이너리가 있다 |
| New Architecture 와 리빌드 | 추가된 189개 패키지 디렉터리에서 `expo-module.config.json`, `react-native.config.js`, `android/`, `ios/`, `.podspec` 를 찾았다 | 0건이다. autolink 대상이 없어 리빌드가 필요 없다. install script 는 `esbuild` 하나다 |
| 앱 번들 (§5 자동 6) | `npx expo export --platform android --source-maps` 뒤 `grep -rlE 'storybook\|\.stories\.' --include='*.map'` | 0건. 같은 map 의 `sources` 1270개에 `/src/app/_layout.tsx`, `/src/app/index.tsx` 가 있으므로 검사는 살아 있다. `src/shared/**` 는 하나도 없다 |
| `flattenColors` (§5 자동 2) | 파일 읽기, vitest, 음성 대조 | import 가 0개다 (`react-native` 없음). 테스트는 계획 Step 3 의 입력, 기대값과 같다. 1 passed. /tmp 사본에서 `/` 를 `.` 로 바꾸면 1 failed |
| `flattenColors.ts:10` 의 `as [string, string]` | /tmp 에서 길이나 원소 타입이 틀린 배열 리터럴에 같은 단언을 붙였다 | 셋 다 TS2352. 배열 리터럴에 바로 붙인 튜플 단언이라 검사를 받는다. 강제 캐스팅이 아니다. 계획 본문의 코드이기도 하다 |
| tsconfig (§5 자동 4 대체) | `tsc --noEmit --listFilesOnly` | `.storybook/main.ts` 가 프로그램에 들어 있다. 리뷰어는 코드를 고치지 않으므로, 타입 에러를 넣는 대조 대신 이것으로 봤다 |
| 팔레트 리터럴 (§5 자동 9) | 세 줄 원문 | 셋 다 0행이다. 숫자는 전부 `SPACING["..."]` 의 키 문자열이다 |
| README SHA (§5 자동 10) | 원문 | `sha=40 readme=1`, `false false`, exit 0 |
| 금지 목록 | 새 파일과 추가한 문서 줄을 grep | `console.`, `any`, `!` 단언, `enum` 은 0건이다. `.ios.tsx`, `.android.tsx` 는 없다. 금지된 긴 대시와 가운뎃점도 없다. `export default` 는 `.storybook/main.ts` 와 `theme.stories.tsx` 둘뿐이고, 고친 규약(`SKILL.md:112`)의 예외에 든다 |
| 문서 | `SKILL.md` 28, 84, 112, 177행, `CLAUDE.md` 65, 143-144, 169행, README | 계획 Step 7 의 문장과 같다. README 차이표는 디자이너용이라 근거 열을 뺐고, 폰트 근거를 웹 칸에 합쳤다. 내용 손실은 없다 |

보지 않은 것. §5 수동(로컬 Storybook 화면, Chromatic, 기기)은 QA 와 사람의 몫이라 보지 않았다. 레이아웃 네 항목(고정 px, 화면 두 벌, 터치 타겟, theme 직접 수정)은 `layout-auditor` 의 몫이다.

## 2회차 (사람 피드백 반영)

대상은 `360123f` 위의 미커밋 워킹트리 diff 다. 파일은 `src/shared/constants/flattenColors.ts`, `flattenColors.test.ts`, `theme.stories.tsx`, `docs/ai/plan/storybook-chromatic.md` 넷이다. 근거는 계획 22~29행의 "구현 후 사람 피드백 (2026-11-27, PR #15)" 블록이다. 1회차에 approve 한 `360123f` 는 다시 보지 않았다.

### 판정 근거

diff 는 피드백 블록의 4항목을 했고, 그 밖의 코드는 건드리지 않았다. Typography, Spacing, Radius 는 소스 diff 가 없다. `react-native-web` 으로 정적 렌더해 보니 세 스토리의 마크업이 HEAD 판과 바이트 단위로 같았다. 값이 바뀐 스타일 키는 `swatch` 하나인데, HEAD 에서도 Colors 만 쓰던 키다. `groupColors` 가 든 파일은 import 가 0개이고, 함수에 `any`, `as`, `!` 가 없다. 새 테스트는 섹션 순서, 리프 순서, 리프 이름 자르기를 `toEqual` 로 고정한다. 순서를 깨뜨린 변형 5개를 넣으면 모두 이 테스트에서 FAIL 했다. 값 글자는 카드마다 독립 `Text` 로 남아 있다. 정적 렌더에서 값 50개와 섹션 제목 16개가 전부 텍스트 노드로 나왔고, `theme.ts` 값 한 글자를 바꾸면 Colors 마크업이 달라졌다. 섹션 제목의 `semibold` 선택은 맞다. 16, 18, 20 크기인 `text-1rg`, `text-1md`, `text-2md` 에는 `semibold`, `medium`, `regular` 만 있고 `bold` 는 22 (`text-1lg`) 부터 있다. 게이트는 `build-storybook` 앞뒤로 직접 두 번 돌렸고 두 번 다 `PASS` 였다. `build-storybook` 은 exit 0 이고 story 는 4개다. Critical 과 Major 가 없어 approve 를 유지한다. 다만 계획 문서에서 planner 로 돌려야 할 것이 둘 있다 (계획 범위 밖). 그중 1 은 머지 전에 사람이 정해야 한다.

### Critical

없다.

### Major

없다.

### Minor

#### m1. 제목과 카드 글자의 스타일이 피드백 블록에 없다. 그래서 Step 4 규칙과 어긋난 채 남았다

`theme.stories.tsx:89`, `:94`, `:95`. 제목에는 `TYPOGRAPHY["text-1md"].semibold` 를, 카드의 이름과 값에는 `TYPOGRAPHY["text-2xs"].regular` 를 줬다. 계획 343행의 Step 4 규칙은 "라벨 글자에는 스타일을 주지 않는다 (Typography 는 그 variant 스타일만)" 이다. 피드백 블록이 Colors 에서 바꾼 것은 "꾸밈을 넣지 않는다" 한 문장과 4항목뿐인데, 4항목 어디에도 글자 스타일이 없다. 코드로서 틀린 곳은 없다. 값은 토큰에서 오고 리터럴이 없다. 키가 사라지면 `as const` 라서 typecheck 가 깨진다. 깨지는 시나리오: plan 1 이 SHA 를 올리면서 `text-2xs/regular` 의 `lineHeight` 만 바꾼다고 하자. 색은 하나도 안 바뀌었는데 Colors 스냅샷에서 카드 50개의 글자 위치가 전부 diff 로 뜬다. 피그마와 맞대 보던 디자이너는 이 Colors diff 를 색 변경으로 읽을 수 있다. 새로 놓치는 변경은 없고 diff 가 늘 뿐이다. 고칠 곳은 코드가 아니라 피드백 블록이다. 5번째 항목으로 "제목은 `text-1md/semibold` (16~20 에 `bold` 가 없다), 카드 글자는 `text-2xs/regular`" 를 적어 계획과 코드를 맞춘다.

### 계획 범위 밖

1. **§6-24 의 "글자 한 개 변경이 Chromatic diff 를 내는가" 확인이 맡을 사람을 잃는다. 머지 전에 사람이 정한다.** 계획 29행. 블록은 Step 9 의 6 마지막 항목을 근거로, 이 PR 에서 갈래 P 의 막힘 확인을 하고 (가) 임시 PR 은 하지 않는다고 적었다. 막힘 자체와 bypass 체크박스 문구는 이 PR 의 pending 에서 볼 수 있다. 그런데 §6-24 의 둘째 미확인 "글자 한 개 변경이 Chromatic diff 를 내는지" 를 확정하는 경로는 둘뿐이다. (가) 의 `Spacing` 구분자 한 글자 변경, 또는 (나) 의 Step 8 이슈 4 다 (§6-24 대응 열). 이번 Colors diff 는 레이아웃 전체가 바뀐 것이라 한 글자 감도를 보여 주지 못한다. 깨지는 시나리오: 나중에 SHA 갱신 PR 이 `text-1rg/regular` 의 `letterSpacing` 을 `-0.06` 에서 `-0.05` 로 바꾸면 Typography 라벨에서 글리프 하나만 바뀐다. Chromatic 이 그 픽셀을 anti-aliasing 으로 무시하면 `UI Tests` 가 저절로 통과하고, 값 변경은 사람 눈에 오르지 않은 채 머지된다. §1 의 "네 export 의 값이 하나라도 바뀌면 diff" 가 검증 없이 남는다. 또 이 블록은 182행의 "(가) 사람 결정 2026-11-27" 을 이 경로에서 뒤집는다. 같은 구멍은 Step 9 의 6 마지막 항목에 원래 있었고, 블록은 그 선례를 따랐을 뿐이다. 선택지는 둘이다. (ㄱ) 이 PR 의 Colors diff 를 Accept 한 뒤 (가) 를 그대로 돌린다. (ㄴ) Step 8 이슈 4 를 만든다. planner 가 블록과 Step 9 의 6 마지막 항목에 둘 중 하나를 적는다. 사람의 지시가 실제로 (가) 생략까지 포함했다면 그 사실을 블록에 적는다.
2. **계획의 Colors 관련 문장 다섯 곳이 이번 diff 로 거짓이 됐다.** 블록은 Step 4 의 한 문장만 Colors 에서 바꾼다고 적었다. 하지만 아래 문장은 지금 코드와 다르다.
   - 328행 Step 4 표의 Colors 행: "견본 1개와 그 옆 글자 `경로 값`", 데이터 `flattenColors(COLORS)`. 지금은 섹션 제목이 부모 경로이고, 카드에 리프 이름과 값이 두 줄로 있으며, 데이터는 `groupColors(COLORS)` 다
   - 343행 "라벨 글자에는 스타일을 주지 않는다" (Minor m1)
   - 527행 §5 자동 2 의 "`flattenColors.test.ts` 가 1개 통과". 지금은 2 passed 다
   - 601~603행 §5 단위 테스트 표: 행이 `flattenColors` 하나이고 "새 판정 함수, 파서, 포맷터는 이것 하나다" 라고 적혀 있다
   - 608행 §5 수동 로컬 2 의 "견본마다 `경로 값` 글자가 붙어 있다"

   깨지는 시나리오: integration-qa 가 §5 자동 2 를 글자대로 돌리면 `2 passed` 가 나와 기대값과 다르다고 보고한다. 수동 로컬 2 를 따르는 사람은 견본 옆에 `경로 값` 한 줄이 없으니 실패로 적는다. 둘 다 거짓 FAIL 이라 루프가 한 번 헛돈다. planner 가 고친다. 고치기 전에 QA 를 돌린다면, 블록이 우선한다고 QA 에 알린다.

### 확인 기록 (2회차)

| 항목 | 방법 | 결과 |
| --- | --- | --- |
| 게이트 | `.claude/scripts/check-gate.sh` 직접 실행. `build-storybook` 앞뒤로 두 번 | 두 번 다 네 줄 `ok`, `PASS`, exit 0 |
| Storybook 빌드 | `npm run build-storybook`, Step 4 의 `index.json` 집계 | exit 0. story 4개 (`foundations--colors`, `--typography`, `--spacing`, `--radius`). 경고는 chunk 크기 하나뿐 |
| 빌드 산출물 | `git status --porcelain` 에서 `storybook-static`, `storybook.log` grep | 0건 |
| 단위 테스트 | `npx vitest run src/shared/constants/flattenColors.test.ts` | 2 passed |
| 음성 대조 | /tmp 사본의 `groupColors` 를 다섯 가지로 깨뜨렸다. (1) 섹션을 이름순 정렬 (2) 리프 순서 뒤집기 (3) 부모가 마지막에 나온 순서 (`delete` 뒤 `set`) (4) 리프 이름 대신 전체 경로 (5) 같은 부모가 연달아 나올 때만 묶기 | 다섯 다 `1 failed, 1 passed` 이고, 실패한 쪽은 새 테스트다. 원본으로 되돌리면 2 passed. 테스트의 `white`, `black` 이 `primary` 를 사이에 두고 떨어져 있어서 (3) 과 (5) 를 가른다 |
| 실제 COLORS | /tmp 에서 `groupColors(COLORS)` 출력 | 섹션 16개, 리프 50개 (`flattenColors` 와 같다). 순서는 `primary` 에서 `shadow` 까지 `theme.ts` 선언 순서다. 섹션을 다시 펴면 `flattenColors(COLORS)` 와 순서까지 같다. 최상위 리프가 없어서 `""` 섹션은 생기지 않는다 |
| 값 글자 렌더링 | /tmp 에서 `react-native` 를 `react-native-web` 으로 별칭하고 `renderToStaticMarkup` 으로 Colors 를 그렸다 | 값 50개가 모두 `>값<` 텍스트 노드로 있다. 제목 16개도 있다. `theme.ts` 사본의 `shadow.key-strong` 을 `#1a1a1a24` 에서 `#1a1a1a25` 로 바꾸면 Colors 마크업이 달라지고 새 값 글자가 나온다 |
| 다른 세 스토리 | HEAD 의 `theme.stories.tsx` 와 지금 파일을 같은 방법으로 렌더 | Typography, Spacing, Radius 마크업이 HEAD 와 같고 Colors 만 다르다. `styles.flow`, `item`, `column`, `fill`, `radiusBox` 는 diff 가 없다. 바뀐 `swatch` 는 HEAD 에서도 Colors 만 쓰던 키다 |
| 순수성 | `flattenColors.ts` 의 import grep | 0개 |
| 타입 | 변경 줄에서 `any`, `as`, `!` 단언, `enum`, `console.` grep | 0건. 파일에 남은 `as [string, string]` (10행) 은 1회차에 본 기존 코드다 |
| 리터럴 (§5 자동 9) | 세 줄 원문 | 셋 다 0행. 새 숫자는 전부 `SPACING` 키다. 테두리 두께는 `StyleSheet.hairlineWidth`, 색은 `COLORS.line.normal` 이다 |
| `semibold` | `theme.ts` 의 `TYPOGRAPHY` 크기별 굵기 키 | `text-1lg` (22) 이상은 `bold`, `medium`, `regular` 이다. `text-2md` (20) 이하는 `semibold`, `medium`, `regular` 이다. 16~20 에서 가장 굵은 키가 `semibold` 다 |
| `theme.ts` | `git diff HEAD -- src/shared/constants/theme.ts` | 변경 없음 |
| React key | 소스 | `section.parent` 는 Map 키라 유일하다. `card.name` 은 같은 객체의 키라 섹션 안에서 유일하다 |
| 산문 | 추가된 줄에서 긴 대시와 가운뎃점 grep | 0건 |

보지 않은 것. Chromatic 과 로컬 Storybook 화면은 QA 와 사람의 몫이다. 카드 폭 80 에서 글자가 줄바꿈되는지, 흰 배경 위 테두리 대비, 두 사이즈는 `layout-auditor` 의 몫이다. §5 자동 6 (앱 번들) 은 다시 돌리지 않았다. 이번 diff 는 앱이 import 하지 않는 두 파일 사이의 import 만 바꿨기 때문이다.
