---
name: quizly-be-contract
description: >
  quizly app 이 붙는 백엔드 Quizly-Team/backend 의 계약을 조회하고 대조하는 방법.
  성공 응답과 에러 응답의 비대칭, 컨트롤러 열거법, 도메인별 엔드포인트, 미결 계약 누적
  규칙을 다룬다. 배포 Swagger 가 인증으로 막혀 있어 컨트롤러 소스가 정본이다.
  사용할 때 - 서버에 보내는 payload 를 만들거나 고칠 때, 응답 타입을 정의할 때,
  에러 분기를 짤 때, "서버가 이걸 주나" 를 확인할 때, 계약 변경을 요청할 범위를 가를 때.
  앱 내부 컨벤션은 quizly-app-conventions 를 본다.
---

# quizly-be-contract

상대는 `Quizly-Team/backend` (Java 17, Spring Boot 3.4.5, MySQL, Spring Security + OAuth2 + JWT, Spring AI, Redis, Spring Batch).

**백엔드가 앱에 맞게 개편 중이다. 계약이 움직인다.** 이 문서의 표가 사실과 다르면 코드가 사실이고, 이 문서를 갱신한다.

## 정본은 컨트롤러 소스다

| 경로 | 상태 |
| --- | --- |
| 1차. 컨트롤러 소스 (`gh api`) | **정본.** public 레포라 인증 불필요 |
| 2차. 배포 Swagger | ⚠️ **막혀 있다** (아래) |
| 🚫 기존 웹 클라이언트 코드 | **근거로 쓰지 않는다.** 앱에 맞게 개편 중이라 어긋난다 |

### 배포 Swagger 실측 (2026-11-13)

호스트는 `https://api.quizly.co.kr` 이고 서버는 살아 있다.

| 엔드포인트 | 결과 |
| --- | --- |
| `GET /swagger-ui/index.html` | `200`. 정적 HTML 만 |
| `GET /v3/api-docs` | `401` `TOKEN_NOT_FOUND` |
| `GET /v3/api-docs/swagger-config` | `401` `TOKEN_NOT_FOUND` |

Spring Security 가 막고 있어 **WebFetch 로 스펙을 읽을 수 없다.**

**서버 변경 요청 1건 (미해결).** `/v3/api-docs` 를 인증 예외로 열면 조회가 한 번에 끝난다. 작은 SecurityConfig 변경이다. 열리면 이 절을 갱신하고 1차 경로를 Swagger 로 되돌린다.

### 컨트롤러 열거

```bash
gh api "repos/Quizly-Team/backend/git/trees/main?recursive=1" \
  --jq '.tree[] | select(.path|test("controller/.*Controller\\.java$")) | .path'
```

필요한 파일만 읽는다.

```bash
gh api repos/Quizly-Team/backend/contents/<경로> --jq .content | base64 -d
```

컨트롤러는 유스케이스 하나당 하나이고 도메인과 HTTP 동사로 나뉜다 (`<도메인>/controller/<verb>/<Verb><Noun>Controller.java`). 이름만 봐도 무슨 엔드포인트인지 알 수 있게 돼 있다.

실제 경로와 파라미터는 `@GetMapping` / `@PostMapping` 과 `@ModelAttribute` / `@RequestBody` 에서 읽고, 응답 모양은 `ResponseEntity<...>` 의 타입 인자가 가리키는 `dto/response/*.java` 에서 읽는다.

## ⚠️ 성공과 에러의 응답 모양이 다르다

이게 이 백엔드에서 가장 먼저 틀리기 쉬운 지점이다.

**성공: DTO 를 그대로 준다. 봉투가 없다.**

컨트롤러가 `ResponseEntity<ReadQuizzesResponse>` 를 반환한다. `{data: ...}` 같은 래퍼가 없다.

**에러: 봉투로 감싼다.** (`core/presentation/ErrorResponse.java`, `@JsonInclude(NON_NULL)`)

```json
{
  "statusCode": 401,
  "timeStamp": "2026-11-13T09:44:22.314800344+09:00",
  "ok": false,
  "error": { "message": "토큰이 존재하지 않습니다." },
  "code": "TOKEN_NOT_FOUND"
}
```

| 필드 | 내용 |
| --- | --- |
| `statusCode` | HTTP 상태 |
| `ok` | 에러에서는 항상 `false` |
| `error.message` | **한국어다.** 서버가 사용자 노출용 문구를 준다 |
| `code` | 분기에 쓸 식별자. `error.message` 가 아니라 **이걸로 분기한다** |

`@JsonInclude(NON_NULL)` 이라 null 필드는 **키 자체가 빠진다.** 앱 타입에서 옵셔널로 둔다.

**귀결.** 균일한 봉투를 가정하는 클라이언트를 만들면 안 된다. 성공은 DTO 직접 파싱, 에러는 `ErrorResponse` 파싱이다. 이 분기를 앱 전체에 한 곳(API 클라이언트)에만 둔다.

## 서버 아키텍처가 주는 힌트

읽을 때 알아두면 빠르다.

- 서비스는 유스케이스당 하나(`<Verb><Noun>Service`)이고 `execute(request)` 단일 메서드다
- **서비스는 비즈니스 실패에 throw 하지 않는다.** `success=false` + `errorCode` 를 반환하고 컨트롤러가 HTTP 결과를 정한다
- `ErrorCode` 는 서비스 클래스 안에 중첩 enum 으로 있다 (`<ServiceName>ErrorCode`). 컨트롤러의 `@ApiErrorCode(errorCodes = {...})` 가 그 작업에서 나올 수 있는 에러 목록이다. **에러 분기를 짤 때 여기를 본다**
- 페이지네이션은 `core/presentation/Pagination.java` 와 `BasePaginationRequest` 를 쓴다

## 도메인 지도 (2026-11-13 기준, 컨트롤러 31개)

| 도메인 | 내용 |
| --- | --- |
| `quiz` | 문제 생성(회원/게스트), OCR 생성, 조회, 오답 조회, 채점, 주제 수정 |
| `mock` | 모의고사 생성(일반/OCR) |
| `account` | 유저 정보, 온보딩, 대시보드, 오늘 요약, 닉네임, 프로필 이미지, 탈퇴 |
| `oauth` | 액세스 토큰 재발급, 리프레시 토큰 폐기 |
| `admin` | 데일리 퀴즈 CRUD, FAQ CRUD, 요약 배치 |
| `faq` | FAQ 조회 |
| `dailyquiz` | 데일리 퀴즈 조회 |
| `chatbot` | 챗 메시지 생성 |

**기존 웹이 쓰지 않는 도메인이 있다.** `chatbot`, `dailyquiz`, 그리고 OCR 계열 4개(`CreateOcrMemberQuizzesController`, `CreateOcrGuestQuizzesController`, `CreateMemberOcrMockExamController` 등). 앱 기획에서 쓸 수 있는 자산이라 `planner` 가 계획 단계에서 한 번 훑는다.

## 미결 계약

앱이 필요한데 서버에 없거나 모양이 안 맞는 것은 **`docs/ai/contract-gaps.md` 에 번호로 쌓는다.**

```markdown
## C-01 <한 줄 제목>

- 앱이 필요한 것:
- 서버 현재 상태: (컨트롤러 경로와 근거)
- 제안:
- 상태: open | 요청함 | 반영됨
```

**앱이 서버 부재를 우회하는 코드를 발명하지 않는다.** 클라이언트에서 조립하거나 여러 번 호출해 합치는 임시 방편은 서버가 바뀔 때 전부 부채가 된다. `planner` 가 §2 Non-goals 에 서버 변경 요청으로 분리한다.

## 하드 룰

- 계약을 확인할 때 **원문을 직접 연다.** 계획이나 리뷰의 "대조 완료" 서술을 믿지 않는다.
- 응답 타입 제네릭은 **실제** DTO 와 맞춘다. 틀려도 컴파일되고 런타임에 깨진다.
- 에러 분기는 `code` 로 한다. `error.message` 는 한국어 표시용이다.
- 조회가 404 면 경로를 추정하지 말고 트리를 다시 열거한다.
- 산문은 한국어, 식별자와 경로는 영어. `—` 와 `·` 는 쓰지 않는다.
