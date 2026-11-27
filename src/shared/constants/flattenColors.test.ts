import { expect, it } from "vitest";

import { flattenColors, groupColors } from "./flattenColors";

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

it("부모 경로별로 묶고 섹션과 리프의 선언 순서를 지킨다", () => {
  expect(
    groupColors({
      white: "#000001",
      primary: { normal: "#000002", strong: "#000003" },
      interaction: {
        neutral: { hover: "#000004" },
        primary: { hover: "#000005", pressed: "#000006" },
      },
      black: "#000007",
    }),
  ).toEqual([
    [
      "",
      [
        ["white", "#000001"],
        ["black", "#000007"],
      ],
    ],
    [
      "primary",
      [
        ["normal", "#000002"],
        ["strong", "#000003"],
      ],
    ],
    ["interaction/neutral", [["hover", "#000004"]]],
    [
      "interaction/primary",
      [
        ["hover", "#000005"],
        ["pressed", "#000006"],
      ],
    ],
  ]);
});
