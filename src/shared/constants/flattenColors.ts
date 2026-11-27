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
