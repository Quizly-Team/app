import { useWindowDimensions } from "react-native";

import { type Breakpoint, resolveBreakpoint } from "./breakpoint";

// react-native 를 import 하는 쪽은 이 파일 하나다. breakpoint.ts 를 순수하게 두어야
// vitest 가 RN 의 Flow 소스를 파싱하지 않고 경계값을 테스트할 수 있다.
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return resolveBreakpoint(width);
}
