---
id: storybook-chromatic
verdict: pass
---

> layout-auditor 판정을 조정자가 옮겨 적었다 (2026-11-27). 감사 에이전트의 실행 환경이 리포트 파일 작성을 막아서, 사람 승인을 받고 보고 원문을 그대로 기록한다. 감사는 코드 읽기와 grep 으로 했고 `build-storybook` 과 렌더링은 돌리지 않았다.

## 대상

`src/shared/constants/theme.stories.tsx` 하나. 앱 화면(`src/app/`)은 바뀌지 않았다. Storybook 에서만 렌더링되는 토큰 팔레트다.

## 판정

Critical 0, Major 0.

1. **고정 px.** 숫자와 색 리터럴이 0개다. 견본은 `SPACING["48"]`, Radius 상자 변은 `SPACING["80"]`, 채움색은 `COLORS.primary.normal`, 간격은 `SPACING["16"]` 과 `SPACING["8"]` 이다. `SPACING["80"]` 은 `theme.ts` 95~108행에 있고, `RADIUS` 8개(`none` 0 에서 `full` 9999)가 모두 다르게 그려지는 변이라 계획 Step 4 와 맞다.
2. **화면 두 벌.** `Tablet`, `Phone`, `Mobile`, `useBreakpoint`, `useWindowDimensions`, `Dimensions`, `Platform` 이 0건이다. `.storybook/` 에는 `main.ts` 만 있고 `preview.ts`(mode, decorator)는 없다. 레이아웃은 `flexDirection: "row"` 와 `flexWrap: "wrap"` 뿐이라, 폭 1200 하나로 찍는다는 계획 Step 0-5 의 근거가 코드와 맞다. 다만 이 팔레트는 phone 폭의 줄바꿈을 한 번도 검증하지 않는다. 이 사실은 계획 Step 7 이 정본(`quizly-app-conventions/SKILL.md`)으로 옮긴다.
3. **터치 타겟.** `Pressable`, `Touchable`, `onPress` 가 0건이라 해당 없다. `theme.test.ts` 는 이 diff 에서 건드려지지 않았다.
4. **theme 생성물.** `git diff` 와 `git status` 에서 `src/shared/constants/theme.ts` 는 변경 없음이다. 머리 SHA 는 `d9f0213` 그대로다.

## 흰색 견본

`COLORS` 의 `white`(14행), `normal`(25행), `elevated`(27행)는 값이 `#ffffff` 라 흰 배경에 묻힌다. 레이아웃 결함이 아니고 계획 범위 안이다. Step 4 가 "꾸밈을 넣지 않는다" 이고 값 글자를 같이 쓰게 해서, 라벨 `경로 #ffffff` 로 식별과 diff 검출이 된다. 테두리를 주려면 새 토큰이나 고정값이 필요하다. 디자이너가 흰 견본 경계를 원하면 별 작업이다.

## 2회차 (2026-11-27)

대상은 미커밋 워킹트리의 `src/shared/constants/theme.stories.tsx` Colors 스토리 변경(섹션 그룹, 같은 폭 카드, 견본 테두리)이다. `flattenColors.ts` 의 `groupColors` 추가는 순수 함수라 UI 감사 대상이 아니다. 감사는 diff grep, 코드 읽기, `/tmp/colors-after.png`(1200 폭 헤드리스 렌더) 육안 확인으로 했다.

verdict: pass (Critical 0, Major 0)

1. **고정 px.** 새 숫자와 색 리터럴이 0개다. 카드 폭과 견본 변은 `SPACING["80"]`, 섹션 간격은 `SPACING["32"]`, 바깥 여백과 카드 간격은 `SPACING["16"]`, 섹션 내부 간격은 `SPACING["8"]`, 테두리 색은 `COLORS.line.normal` 이다. `borderWidth: StyleSheet.hairlineWidth` 는 플랫폼 상수라 예외로 인정한다. 글자는 `TYPOGRAPHY` 토큰을 쓴다. 토큰 키는 `theme.ts` 에 모두 있다.
2. **화면 두 벌.** `useWindowDimensions`, `Dimensions`, `Platform`, `useBreakpoint`, `Tablet`, `Phone`, `Mobile` 이 diff 에 0건이다. 배치는 `flexDirection: "row"` 와 `flexWrap: "wrap"` 뿐이다.
3. **터치 타겟.** `Pressable`, `Touchable`, `onPress` 가 0건이라 해당 없다. `theme.test.ts` 는 건드려지지 않았다.
4. **theme 생성물.** `git diff --name-only` 에 `src/shared/constants/theme.ts` 가 없다.

### 렌더 육안 판정

- 같은 폭 카드(80)가 섹션마다 왼쪽 정렬로 가지런히 놓이고, 한 행에 최대 5개(gray, fill)가 들어가 1200 폭에서 줄바꿈은 일어나지 않는다. 이름과 값 글자가 카드 폭 안에 들어가 잘리지 않는다(`alternative`, `key-strong`, `#1111110f` 확인).
- 흰 견본 3개(`static/white`, `background/normal`, `background/elevated`)는 옅은 테두리로 경계가 보인다. 1회차의 "흰 배경에 묻힌다" 지적이 해소됐다. 테두리는 기존 토큰(`line.normal`)이라 새 고정값이 아니다.
- 최상위 리프의 부모 `""` 섹션은 현재 `COLORS` 에 해당 항목이 없어 빈 제목이 그려지지 않는다.

### 사람이 눈으로 볼 것

1. 1200 폭 하나만 찍힌다. phone 폭(약 360)에서는 계산상 한 행에 3개씩 줄바꿈되는데 실제 렌더는 이 감사가 검증하지 못한다. 필요하면 Storybook 뷰포트에서 확인한다.
2. 알려진 한계: `theme.stories.tsx` 에 `flow` 와 `item` 스타일이 남아 있고 다른 스토리가 쓴다. 이번 diff 가 만든 고아가 아니다.
