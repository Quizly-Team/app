import type { TextStyle } from "react-native";
import { describe, expect, it } from "vitest";

import { COLORS, LAYOUT, OPACITY, RADIUS, SPACING, TYPOGRAPHY } from "./theme";

// 기대값은 전부 TOKENS_SHA 의 tokens.json 에서 센 값이다. theme.ts 를 보고 적지 않는다.

function countLeaves(node: unknown): number {
  if (typeof node !== "object" || node === null) return 1;
  return Object.values(node).reduce<number>((n, v) => n + countLeaves(v), 0);
}

describe("theme", () => {
  it("SPACING 이 토큰 스케일 12개와 같다", () => {
    expect(Object.values(SPACING)).toEqual([2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80]);
  });

  it("RADIUS 가 토큰 8개와 같다", () => {
    expect(RADIUS).toEqual({
      none: 0,
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      "2xl": 32,
      full: 9999,
    });
  });

  it("OPACITY 는 퍼센트가 아니라 0..1 이다", () => {
    for (const v of Object.values(OPACITY)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(OPACITY["14"]).toBe(0.14);
    expect(OPACITY["100"]).toBe(1);
  });

  it("TYPOGRAPHY 리프가 RN TextStyle 로 들어간다", () => {
    const style: TextStyle = TYPOGRAPHY["text-1rg"].regular;
    expect(style).toEqual({
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.06,
      fontWeight: "400",
    });
  });

  it("TYPOGRAPHY variant 리프가 42개다", () => {
    expect(Object.values(TYPOGRAPHY).flatMap((group) => Object.values(group))).toHaveLength(42);
  });

  it("COLORS 가 시맨틱 색 50개를 참조까지 풀어 담는다", () => {
    expect(countLeaves(COLORS)).toBe(50);
    expect(Object.keys(COLORS)).toHaveLength(12);
    expect(COLORS.primary.normal).toBe("#30a10e");
    expect(COLORS.fill.assistive).toBe("#5555550f");
    expect(COLORS.interaction.primary.pressed).toBe("#30a10e24");
    expect(COLORS.status.positive.normal).toBe("#2473fc");
  });

  // touch-min 목표는 44 (Apple HIG) 이고 현재 토큰은 40 이다. 미결은 §6-1.
  // TOKENS_SHA 를 올렸는데 토큰이 44 이상이면 이 테스트가 깨진다. 그때 44 하한 단언으로 교체하고 이 주석을 지운다.
  it("LAYOUT 이 토큰 현재값을 유지한다 (touch-min 40, 플랫폼 하한 44 는 미결)", () => {
    expect(LAYOUT).toEqual({
      "content-max": 1200,
      "readable-max": 840,
      panel: 420,
      "touch-min": 40,
    });
  });
});
