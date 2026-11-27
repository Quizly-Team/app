---
name: rh-implement
description: >
  quizly app 개발 파이프라인의 구현 단계, Implement 비평 루프. 승인된 계획
  (docs/ai/plan/<id>.md, approved:true)을 builder 가 단계별로 구현하고, code-critic 이
  워킹트리 diff 를 계획과 컨벤션에 대해, layout-auditor 가 태블릿과 폰 두 사이즈에 대해
  병렬로 적대적 비평해 둘 다 통과할 때까지 루프를 돈다.
  트리거 - "구현해줘", "만들어줘", "이 계획 구현", "rh-implement", "리뷰 반영해서 다시",
  "코드 비평", "레이아웃 감사", "승인됐으니 구현".
  계획은 rh-plan, QA 는 rh-qa, 전체는 rh-dev-orchestrator.
---

# rh-implement, 구현 단계

**실행 모드: 서브에이전트 위임.**

**승인된** 계획을 구현하고 diff 를 비평해 통과시킨다. 산출은 소스 변경 + `docs/ai/review/<id>.md` + (UI 변경 시) `docs/ai/review/<id>-layout.md`.

## 게이트 (필수)

`docs/ai/plan/<id>.md` 의 frontmatter 가 `approved: true` 가 아니면 **멈추고** 사용자에게 rh-plan 으로 승인부터 받으라고 안내한다. builder 는 미승인 계획에 작동하지 않는다.

## 절차

### 1. builder 호출

`builder` 가 계획 §4 를 단계별로 기계적으로 구현한다.

- 구현 **전에** `.claude/skills/quizly-app-conventions/SKILL.md` 와 계획 §3 이 지정한 references 를 Read 로 정독한다.
- 서버에 보내거나 받는 것이 바뀌면 `.claude/skills/quizly-be-contract/SKILL.md` 도 읽는다.
- 각 단계 끝에서 `.claude/scripts/check-gate.sh` 를 돌려 `PASS` 를 확인한다.
- 계획 §5 가 단위 테스트를 명시했으면 같이 쓴다.
- 검증이 실패하면 멈추고 보고한다. 계획 밖 수정을 즉흥으로 만들지 않는다.

여러 모듈을 동시에 진행해야 하면 모듈 단위로 builder 를 병렬 호출한다. 이 저장소에 레이어 전문가 팀은 두지 않는다.

네이티브 패키지 추가/제거, `app.json` 의 권한/플러그인/방향 변경이 있으면 **리빌드가 필요하다는 사실을 보고에 적는다.** JS/TS 만 바뀌었으면 Fast Refresh 로 충분하다.

### 2. code-critic 과 layout-auditor 병렬 호출

둘 다 워킹트리 diff 와 승인된 plan 만 본다(구현자 추론 없이).

**`code-critic`** -> `docs/ai/review/<id>.md`, `verdict`(approve / request-changes / block)

- diff 대 plan 준수, 범위 이탈
- `CLAUDE.md` 금지 사항
- **응답 타입이 실제 응답 모양과 맞는가.** 틀려도 컴파일되고 런타임에 깨진다
- 타입 안전 (`any`, 강제 캐스팅, `!`, `enum`)
- `theme.ts` 생성물을 손으로 고쳤는가
- 자원 해제 짝 (타이머, 구독, 파일 핸들. 중간 이탈 경로 포함)
- 보안 (하드코딩 키와 토큰, 로그에 찍히는 개인정보)
- 새 의존성의 New Architecture 지원
- 순수 로직인데 테스트가 없는지
- 게이트: `.claude/scripts/check-gate.sh` **PASS 필수. code-critic 이 직접 돌린다**

**`layout-auditor`** -> `docs/ai/review/<id>-layout.md`, `verdict`(pass / fail)

고정 px, 화면 두 벌, 터치 타겟 미달, theme 생성물 직접 수정 네 가지만 본다.

**UI 변경이 없는 작업(순수 로직, API 레이어, 설정만)에서는 호출하지 않는다.**

### 3. 루프

- `code-critic` `approve` **그리고** `layout-auditor` `pass` -> QA(rh-qa)로
- 둘 중 하나라도 걸리면 **builder 재호출**("두 리포트의 Critical 만 처리") -> 재검증. 둘 다 통과까지 반복
- 구현자가 "plan 범위 밖" 으로 판단한 지적은 코드로 처리하지 않고 planner 주석 사이클(rh-plan)로 되돌린다

3회를 넘으면 멈추고 사용자에게 보고한다.

## 하드 룰

- 승인된 plan 이 계약이다. 즉흥 편집 금지, 새 범위는 planner 로.
- 게이트는 **절대 0건**이다. 베이스라인을 도입하지 않는다.
- **실패하는 테스트를 고쳐서 통과시키지 않는다.** 터치 타겟 테스트처럼 미해결 결정을 막고 있는 테스트가 있다. 그걸 무력화하는 diff 는 Critical 이다.
- 구현자와 비평자는 절대 `git commit` / `git push` / `gh pr create` 를 하지 않는다.
- `git add -A` 를 쓰지 않는다.
- `docs/ai/**` 를 지우지 않는다.
- 산문은 한국어, 식별자와 경로는 영어. `—` 와 `·` 는 쓰지 않는다.
