---
name: rh-dev-orchestrator
description: >
  quizly app(Expo/React Native 태블릿 우선 학습 앱) 개발 작업을 Plan 비평 -> 사람 승인 ->
  Implement 비평 -> QA 파이프라인으로 조율하는 최상위 오케스트레이터. 계획(planner)과
  비평(plan-critic)이 루프를 돌아 계획을 다듬고, 사람 승인 게이트를 거쳐, 구현(builder)과
  비평(code-critic + layout-auditor)이 루프를 돌고, QA(integration-qa)로 마무리한다.
  컨텍스트 격리로 구현과 검증을 독립 운영한다.
  트리거 - "이 작업 해줘", "기능 만들어줘", "이 이슈 구현", "버그 고쳐줘", "리팩토링 해줘",
  "개발 파이프라인 태워", "전체 흐름으로", "rh 돌려", "하네스 돌려", "계획부터 QA까지".
  후속 - "다시 실행", "재실행", "리뷰 반영", "QA 반영", "이어서", "보완해줘".
  단순 질문이나 단일 단계만 원하면 rh-plan / rh-implement / rh-qa 를 직접 쓰거나 직접 답한다.
---

# rh-dev-orchestrator, quizly app 개발 파이프라인

**실행 모드: 서브에이전트 위임.** 각 단계를 `Agent` 로 한 번씩 호출하고 산출물 파일로 핸드오프한다. 중간에 **사람 승인 게이트**가 있어 전체를 `Workflow` 스크립트 하나로 묶지 않는다.

한 개발 작업(`<id>`)을 **생성-비평 루프 3단계**로 처리한다.

```
Plan 비평  ->  〔사람 승인〕  ->  Implement 비평  ->  QA
```

핵심 가치는 **컨텍스트 격리**다. 각 역할은 별도 서브에이전트로 자기 컨텍스트를 가지며 산출물 파일로만 핸드오프한다. 특히 비평자(`plan-critic`, `code-critic`, `layout-auditor`)와 `integration-qa` 는 **생성자의 추론을 받지 않고** 산출물(plan / diff)만 본다. 생성자가 "이렇게 생각해서 이렇게 했다" 를 전달하면 비평자가 그 틀 안에서만 보게 되어 검증이 무의미해진다.

## 역할 맵

| 단계 | 에이전트 | 모델 | 산출물 |
| --- | --- | --- | --- |
| 1a. 계획 | `planner` | opus | `docs/ai/plan/<id>.md` |
| 1b. 계획 비평 | `plan-critic` | opus | `docs/ai/plan-critique/<id>.md` |
| 승인 게이트 | 사람 | - | plan `approved: true` |
| 2a. 구현 | `builder` | opus | 소스 변경 |
| 2b. 구현 비평 | `code-critic` | opus | `docs/ai/review/<id>.md` |
| 2b. 레이아웃 감사 | `layout-auditor` | sonnet | `docs/ai/review/<id>-layout.md` |
| 3. QA | `integration-qa` | opus | `docs/ai/qa/<id>.md` |

각 단계는 개별 스킬로도 존재한다: `rh-plan`, `rh-implement`, `rh-qa`.

> **레이어 전문가 빌드팀은 두지 않는다.** 저장소가 작고 화면 수가 적다. 구현은 `builder` 단독이다. 여러 모듈을 동시에 진행해야 하면 모듈 단위로 `builder` 를 병렬 호출하고 모듈마다 `integration-qa` 를 점진적으로 돌린다.

## Phase 0: 컨텍스트 확인 (시작 시 항상)

1. **작업 식별자 `<id>`** 를 파악한다. 이슈 번호 또는 `<타입>/<슬러그>` (예: `fix/token-refresh`). 없으면 사용자에게 묻고 멈춘다.
2. **범위 선분리 (생략 금지).** 요청에는 앱 밖 원인이 섞여 들어온다. 세 갈래로 나눠 한 줄로 확인한다.
   - **앱 코드**: 이 파이프라인 대상
   - **백엔드**: `Quizly-Team/backend` 소관. **서버 변경 요청**으로 분리
   - **웹**: `Quizly-Team/frontend` 소관 (서비스 소개와 문의). 분리
     앱 밖 항목을 조용히 앱 작업으로 끌어오지 않는다. planner 가 §2 Non-goals 에 적는다.
3. 작업 유형을 파악한다 (모두 같은 파이프라인, 진입 강조만 다름).
   - **기능 개발**: planner 부터 전체
   - **버그 수정 / 리팩토링**: planner 가 원인과 영향 추적에 집중
   - **QA 만**: 코드 변경 없이 `rh-qa` 단독
4. 기존 아티팩트(`docs/ai/{plan,plan-critique,review,qa}/<id>.md`)를 확인해 **초기 실행 / 부분 재실행 / 이어가기**를 판단한다.
5. 어느 모드로 갈지 한 줄로 확인하고 진행한다.

## Phase 1: Plan 비평

1. `planner` 호출 -> `docs/ai/plan/<id>.md`. 코드 영향 리서치와 서버 계약 대조까지 포함한다.
2. `plan-critic` 호출 -> `docs/ai/plan-critique/<id>.md`.
   - `sound` -> 승인 게이트로
   - `revise` / `block` -> **planner 재호출**("비평의 Critical/Major 반영") -> 재비평. `sound` 까지 루프
3. **승인 게이트 (사람 전용).** 계획 §1, §2 와 남은 비평 요점을 사용자에게 보여주고 명시적 동의를 받는다. 동의가 있을 때만 plan frontmatter 를 `status: approved` / `approved: true` / `approved_by` / `approved_at` 로 갱신한다.

루프가 3회를 넘으면 멈추고 사용자에게 상황을 보고한다. 계획과 비평이 서로 평행선이면 전제가 틀린 것이고, 그건 사람이 끊어야 한다.

## Phase 2: Implement 비평

1. `builder` 호출. 승인된 계획 §4 를 단계별로 구현하고 단계마다 `.claude/scripts/check-gate.sh` 를 통과시킨다.
2. `code-critic` 과 `layout-auditor` 를 **병렬 호출**한다.
   - `code-critic` -> `docs/ai/review/<id>.md` (타입, 계약, 자원, 보안, 과설계)
   - `layout-auditor` -> `docs/ai/review/<id>-layout.md` (고정 px, 화면 두 벌, 터치 타겟, theme 생성물)
   - **UI 변경이 없는 작업(순수 로직, API 레이어, 설정만)에서는 `layout-auditor` 를 부르지 않는다.**
3. **Phase 2 통과 조건은 `code-critic` 이 `approve` 그리고 `layout-auditor` 가 `pass` 다.** 둘 중 하나라도 걸리면 **builder 재호출**("두 리포트의 Critical 만 처리") -> 재검증. 둘 다 통과까지 루프.
4. 구현자가 "계획 범위 밖" 으로 판단한 지적은 코드로 처리하지 않고 planner 주석 사이클로 되돌린다.

## Phase 3: QA

1. `integration-qa` 호출 -> `docs/ai/qa/<id>.md`. 세 관점: **아키텍처**, **통합 정합성**(경계면 양쪽 동시 읽기), **동작 체크리스트 작성**(태블릿과 폰 분리).
2. `fail` 이면 builder 재호출 -> 재검증. `pass` 까지 루프.
3. Phase 2 통과 + `integration-qa` `pass` 면 사람에게 넘긴다.

**오케스트레이터와 서브에이전트는 절대 commit / push / PR 을 하지 않는다.**

## 데이터 전달 프로토콜

- **파일 기반:** `docs/ai/{plan,plan-critique,review,qa}/<id>.md`. 모든 단계가 감사 추적으로 남는다.
- 중간 아티팩트를 지우지 않는다 (사후 검증, 회귀 추적).
- `docs/ai/**` 는 코드와 **같은 커밋에** 사람이 올린다. AI 작업을 블랙박스로 두지 않는다.
- 단계 산출물은 `<id>` 당 하나. 재실행은 명시적 요청 시에만 덮어쓴다.

## 오류 처리

| 상황 | 대응 |
| --- | --- |
| 에이전트가 산출물 없이 끝남 | 한 번 재호출한다. 또 실패하면 멈추고 사용자에게 보고한다 |
| 사용량 한도, 인증 만료, 권한 거부 | **재시도하지 않는다.** 남은 한도만 쓴다. 부분 산출물을 직접 열어 어디까지 갔는지 확인하고 보고한다 |
| 게이트가 계속 FAIL | builder 를 반복 호출하지 않는다. 실패 출력을 그대로 사용자에게 보여준다 |
| 비평 루프가 3회 초과 | 멈추고 사용자 판단을 받는다 |
| 빈 곳을 오케스트레이터가 메울 때 | **직접 확인한 사실만** 반영한다. 에이전트의 판단(왜 제외했는지 등)을 추측해 채우면 감사 기록을 위조하는 셈이다 |

## 하드 룰

- 승인 게이트는 건너뛸 수 없다. `builder` 는 `approved: true` 없이 작동하지 않는다.
- 게이트는 `.claude/scripts/check-gate.sh` 이고 **절대 0건**을 요구한다. 베이스라인을 도입하지 않는다.
- 커맨드(`.claude/commands/`)를 만들지 않는다. 트리거는 이 스킬 description 으로 한다.
- 산문은 한국어, 식별자와 경로는 영어. `—` 와 `·` 는 쓰지 않는다.

## 테스트 시나리오

**정상 흐름.** 사용자가 "이슈 12번 구현해줘" 라고 한다. Phase 0 에서 `<id>` 를 `12` 로 잡고 범위를 앱 코드로 선분리해 한 줄로 확인한다. planner 가 계획을 쓰고 plan-critic 이 `revise` 를 내면 planner 를 재호출해 `sound` 까지 돌린다. 계획 §1, §2 를 보여주고 승인을 받아 `approved: true` 로 바꾼다. builder 가 단계별로 구현하며 게이트를 통과시키고, code-critic 과 layout-auditor 를 병렬로 돌려 `approve` 와 `pass` 를 받고, integration-qa 가 `pass` 와 태블릿/폰 체크리스트를 낸다. 사람에게 커밋을 넘긴다.

**오류 흐름.** 사용자가 "문제 목록이 안 뜬다" 라고 한다. Phase 0 의 범위 선분리에서 이게 앱 코드인지 서버인지 아직 모른다는 것이 드러난다. planner 가 `quizly-be-contract` 로 컨트롤러 원문을 열어 응답 모양을 확인한다. 앱의 제네릭이 실제 응답과 다르면 앱 코드 문제이므로 파이프라인으로 들어가고, 서버가 그 엔드포인트를 아직 안 냈으면 **서버 변경 요청으로 가르고 파이프라인을 돌리지 않는다.**
