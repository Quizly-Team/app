import { describe, expect, it } from "vitest";

import { resolveBreakpoint, TABLET_MIN_WIDTH } from "./breakpoint";

describe("resolveBreakpoint", () => {
  it("임계 폭 미만은 phone 이다", () => {
    expect(resolveBreakpoint(TABLET_MIN_WIDTH - 1)).toBe("phone");
  });

  it("임계 폭과 같으면 tablet 이다", () => {
    expect(resolveBreakpoint(TABLET_MIN_WIDTH)).toBe("tablet");
  });

  it("임계 폭 초과는 tablet 이다", () => {
    expect(resolveBreakpoint(TABLET_MIN_WIDTH + 1)).toBe("tablet");
  });

  it("임계 폭은 768 이다", () => {
    expect(TABLET_MIN_WIDTH).toBe(768);
  });
});
