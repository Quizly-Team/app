export type Breakpoint = "phone" | "tablet";

// shortcut: 768 은 토큰에 브레이크포인트가 없어 쓴 RN 관례값, 디자이너와 레이아웃 확정 때 재검토
export const TABLET_MIN_WIDTH = 768;

export function resolveBreakpoint(width: number): Breakpoint {
  return width >= TABLET_MIN_WIDTH ? "tablet" : "phone";
}
