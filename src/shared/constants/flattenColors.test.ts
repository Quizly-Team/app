import { expect, it } from "vitest";

import { flattenColors } from "./flattenColors";

it("중첩 경로를 / 로 잇고 리프를 선언 순서대로 모두 낸다", () => {
  expect(
    flattenColors({
      white: "#000001",
      primary: { normal: "#000002" },
      interaction: { primary: { pressed: "#00000324" } },
      shadow: { "key-strong": "#000004" },
    }),
  ).toEqual([
    ["white", "#000001"],
    ["primary/normal", "#000002"],
    ["interaction/primary/pressed", "#00000324"],
    ["shadow/key-strong", "#000004"],
  ]);
});
