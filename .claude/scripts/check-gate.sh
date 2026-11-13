#!/usr/bin/env bash
# quizly app 검증 게이트. typecheck, lint, test, format 네 가지를 한 번에 돌린다.
#
# 베이스라인이 없다. 신규 레포라 0건에서 시작했으므로 "증분 0" 이 아니라 "절대 0" 을
# 요구한다. 지적이 쌓이기 시작하면 그때 베이스라인을 도입할 게 아니라 그 자리에서 고친다.
#
# 사용:
#   .claude/scripts/check-gate.sh          전부 실행
#   .claude/scripts/check-gate.sh --fix    포맷은 고치고 나머지는 검사
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 2

FIX=0
[ "${1:-}" = "--fix" ] && FIX=1

FAILED=()

run() {
  local label="$1"; shift
  local out
  if out="$("$@" 2>&1)"; then
    echo "  ok   $label"
  else
    echo "  FAIL $label"
    echo "$out" | sed 's/^/       /'
    FAILED+=("$label")
  fi
}

echo "check-gate:"

run typecheck npx tsc --noEmit
run lint npx oxlint
run test npm test --silent

if [ "$FIX" = "1" ]; then
  npx oxfmt >/dev/null 2>&1 && echo "  ok   format (고침)"
else
  run format npx oxfmt --check
fi

if [ ${#FAILED[@]} -eq 0 ]; then
  echo "PASS"
  exit 0
fi

echo "FAIL: ${FAILED[*]}"
exit 1
