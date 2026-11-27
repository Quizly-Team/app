/**
 * Quizly-Team/frontend 의 tokens/tokens.json (Tokens Studio, DTCG) 을
 * src/shared/constants/theme.ts 로 변환한다. 실행: npm run tokens:build
 *
 * 브랜치가 아니라 커밋 SHA 에 고정해 받는다. 갱신 절차는 quizly-app-conventions 의 디자인 토큰 절.
 */
import fs from "node:fs";
import path from "node:path";

const TOKENS_SHA = "d9f02130e111aabcb2cb7b32829982f3767a4b7a";

const TOKEN_SET_ORDER = [
  "global",
  "[DS] Primitive/Value",
  "[DS] Semantic/Light",
  "[DS] Semantic/Dark",
  "[DS] Typography/Value",
  "[DS] Opacity/Value",
  "[DS] Spacing/Value",
  "[DS] Radius/Value",
  "[DS] Layout/Value",
];

// [DS] Semantic/Light 에 있어도 되는 $type. 여기 없는 타입이 들어오면 출력에서 조용히 빠지지 않게 멈춘다.
const SEMANTIC_LIGHT_TYPES = [
  "color",
  "typography",
  "fontSizes",
  "letterSpacing",
  "boxShadow",
  "paragraphSpacing",
  "textCase",
  "textDecoration",
  "dimension",
];

// 웹 scripts/build-tokens.mjs 의 deref 깊이 한계와 같다.
const DEREF_MAX_DEPTH = 6;

// 2px 단위를 허용한다. spacing.2 가 의도된 반 스텝이다 (docs/ai/plan/1.md §6-8).
const SPACING_STEP_PX = 2;

const FONT_WEIGHT = {
  Bold: "700",
  SemiBold: "600",
  Medium: "500",
  Regular: "400",
  Light: "300",
};

const SRC = `https://raw.githubusercontent.com/Quizly-Team/frontend/${TOKENS_SHA}/tokens/tokens.json`;
const OUT = "src/shared/constants/theme.ts";
const DARK = "[DS] Semantic/Dark";
const LIGHT = "[DS] Semantic/Light";

if (!/^[0-9a-f]{40}$/.test(TOKENS_SHA)) {
  throw new Error(`TOKENS_SHA 는 40자 커밋 SHA 여야 한다: "${TOKENS_SHA}"`);
}

const res = await fetch(SRC);
if (!res.ok) throw new Error(`${SRC} 응답 ${res.status}`);
const raw = JSON.parse(await res.text());

const order = raw.$metadata?.tokenSetOrder;
if (JSON.stringify(order) !== JSON.stringify(TOKEN_SET_ORDER)) {
  throw new Error(`tokenSetOrder 가 TOKEN_SET_ORDER 와 다르다: ${JSON.stringify(order)}`);
}

const isLeaf = (v) => typeof v === "object" && v !== null && "$value" in v;

// Primitive 와 Semantic 이 둘 다 gray 그룹을 갖는다. 얕은 병합이면 {gray.800} 이 안 풀린다.
const merge = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = typeof v === "object" && v !== null && !isLeaf(v) && out[k] ? merge(out[k], v) : v;
  }
  return out;
};

// 참조 해석 전용 트리. 출력에 쓰지 않는다.
const tree = TOKEN_SET_ORDER.filter((s) => s !== DARK).reduce((acc, s) => merge(acc, raw[s]), {});

const deref = (v, depth = 0) => {
  const m = /^\{([^}]+)\}$/.exec(String(v).trim());
  if (!m) return v;
  if (depth > DEREF_MAX_DEPTH) throw new Error(`참조 깊이 ${DEREF_MAX_DEPTH} 초과: ${v}`);
  const node = m[1]
    .split(".")
    .reduce((n, k) => (typeof n === "object" && n !== null ? n[k] : undefined), tree);
  if (!isLeaf(node)) throw new Error(`풀리지 않는 참조: ${v}`);
  return deref(node.$value, depth + 1);
};

const fontWeight = (v) => {
  const name = deref(v);
  if (!Object.hasOwn(FONT_WEIGHT, name)) throw new Error(`모르는 fontWeight: ${v}`);
  return FONT_WEIGHT[name];
};

const setPath = (obj, keys, value) => {
  let node = obj;
  for (const k of keys.slice(0, -1)) node = node[k] ??= {};
  node[keys.at(-1)] = value;
};

const colors = {};
const typography = {};
const dropped = {};
let colorCount = 0;
let typographyCount = 0;

const walk = (node, keys) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (!isLeaf(v)) {
      walk(v, [...keys, k]);
      continue;
    }
    const at = [...keys, k];
    if (!SEMANTIC_LIGHT_TYPES.includes(v.$type)) {
      throw new Error(`${LIGHT} 의 모르는 $type "${v.$type}": ${at.join(".")}`);
    }
    if (v.$type === "color") {
      setPath(colors, at, deref(v.$value));
      colorCount++;
    } else if (v.$type === "typography") {
      const t = v.$value;
      setPath(typography, at, {
        fontSize: deref(t.fontSize),
        lineHeight: deref(t.lineHeight),
        letterSpacing: deref(t.letterSpacing),
        fontWeight: fontWeight(t.fontWeight),
      });
      typographyCount++;
    } else {
      dropped[v.$type] = (dropped[v.$type] ?? 0) + 1;
    }
  }
};
walk(raw[LIGHT], []);

const scalar = (set) =>
  Object.fromEntries(
    Object.values(raw[set]).flatMap((group) =>
      Object.entries(group).map(([k, v]) => [k, v.$value]),
    ),
  );

const spacing = scalar("[DS] Spacing/Value");
const radius = scalar("[DS] Radius/Value");
const opacity = Object.fromEntries(
  Object.entries(scalar("[DS] Opacity/Value")).map(([k, v]) => [k, v / 100]),
);
const layout = scalar("[DS] Layout/Value");

const assertSpacingStep = (values) => {
  const off = values.filter((v) => v % SPACING_STEP_PX !== 0);
  if (off.length) {
    throw new Error(`간격 토큰이 ${SPACING_STEP_PX}px 단위가 아니다: ${off.join(", ")}`);
  }
};
assertSpacingStep(Object.values(spacing));

const count = (o) => Object.keys(o).length;
const summary =
  `colors ${colorCount}, typography ${typographyCount}, spacing ${count(spacing)}, radius ${count(radius)}, ` +
  `opacity ${count(opacity)}, layout ${count(layout)}. 버린 리프 ` +
  Object.entries(dropped)
    .map(([type, n]) => `${type} ${n}`)
    .join(", ");

const key = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));

const literal = (v, indent) => {
  // deref 는 문자열 전체 참조만 푼다. 부분 참조와 스칼라 세트의 참조는 출력 직전 여기서 막는다.
  if (typeof v === "string" && v.includes("{")) throw new Error(`풀리지 않는 참조: ${v}`);
  if (typeof v === "string" || (typeof v === "number" && Number.isFinite(v)))
    return JSON.stringify(v);
  if (typeof v !== "object" || v === null) throw new Error(`내보낼 수 없는 값: ${String(v)}`);
  const pad = "  ".repeat(indent + 1);
  const body = Object.entries(v)
    .map(([k, x]) => `${pad}${key(k)}: ${literal(x, indent + 1)},\n`)
    .join("");
  return `{\n${body}${"  ".repeat(indent)}}`;
};

const exportConst = (name, v) => `export const ${name} = ${literal(v, 0)} as const;\n`;

const out = [
  "// 자동 생성 파일이다. 직접 수정하지 않는다.",
  `// 소스: Quizly-Team/frontend@${TOKENS_SHA} tokens/tokens.json`,
  "// 생성: npm run tokens:build",
  `// ${summary}`,
  "",
  exportConst("COLORS", colors),
  exportConst("SPACING", spacing),
  exportConst("RADIUS", radius),
  "// 토큰은 퍼센트, RN 의 opacity 는 0..1 이라 100 으로 나눴다",
  exportConst("OPACITY", opacity),
  exportConst("TYPOGRAPHY", typography),
  exportConst("LAYOUT", layout),
].join("\n");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(summary);
