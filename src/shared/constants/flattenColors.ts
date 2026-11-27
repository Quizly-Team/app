interface ColorTree {
  readonly [key: string]: string | ColorTree;
}

// 팔레트 이름을 피그마 표기(glass/tint)와 같은 / 구분자로 잇는다
export function flattenColors(tree: ColorTree, prefix = ""): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}/${key}` : key;
    return typeof value === "string"
      ? [[path, value] as [string, string]]
      : flattenColors(value, path);
  });
}

// 팔레트 섹션용. 섹션은 부모가 처음 나온 순서, 리프는 선언 순서다. 최상위 리프의 부모는 ""
export function groupColors(tree: ColorTree): [string, [string, string][]][] {
  const sections = new Map<string, [string, string][]>();
  for (const [path, value] of flattenColors(tree)) {
    const cut = path.lastIndexOf("/");
    const parent = cut < 0 ? "" : path.slice(0, cut);
    sections.set(parent, [...(sections.get(parent) ?? []), [path.slice(cut + 1), value]]);
  }
  return [...sections];
}
