// 자동 생성 파일이다. 직접 수정하지 않는다.
// 소스: Quizly-Team/frontend@d9f02130e111aabcb2cb7b32829982f3767a4b7a tokens/tokens.json
// 생성: npm run tokens:build
// colors 50, typography 42, spacing 12, radius 8, opacity 11, layout 4. 버린 리프 boxShadow 3, fontSizes 14, letterSpacing 12, paragraphSpacing 1, textCase 1, textDecoration 1, dimension 1

export const COLORS = {
  primary: {
    normal: "#30a10e",
    strong: "#327f21",
    heavy: "#2a641e",
    subtle: "#f6fbf4",
  },
  static: {
    white: "#ffffff",
    black: "#000000",
  },
  gray: {
    normal: "#222222",
    neutral: "#333333",
    alternative: "#777777",
    assistive: "#9e9e9e",
    disable: "#b7b7b7",
  },
  background: {
    normal: "#ffffff",
    alternative: "#f7f7f7",
    elevated: "#ffffff",
  },
  fill: {
    assistive: "#5555550f",
    alternative: "#1111110f",
    disable: "#1111111a",
    border: "#11111124",
    strong: "#b7b7b780",
  },
  interaction: {
    neutral: {
      hover: "#1111110f",
      pressed: "#11111124",
    },
    primary: {
      hover: "#30a10e0f",
      pressed: "#30a10e24",
    },
  },
  inverse: {
    heavy: "#333333",
    strong: "#222222",
    normal: "#111111",
  },
  line: {
    normal: "#1111111a",
    strong: "#9e9e9e80",
  },
  status: {
    positive: {
      normal: "#2473fc",
      strong: "#0053e2",
      subtle: "#f0f6ff",
    },
    negative: {
      normal: "#ff243e",
      strong: "#c10025",
      heavy: "#9f041f",
      subtle: "#fef2f1",
    },
    cautionary: {
      normal: "#facb2f",
      strong: "#a56000",
      subtle: "#fdfce8",
    },
    informative: {
      normal: "#2473fc",
      strong: "#0053e2",
      subtle: "#f0f6ff",
    },
  },
  dimmer: {
    normal: "#00000080",
    weak: "#0000004d",
  },
  highlight: {
    yellow: "#fce0234d",
    green: "#9dec8d4d",
    blue: "#9bc1ff4d",
    pink: "#fda5d54d",
  },
  shadow: {
    ambient: "#1a1a1a0f",
    key: "#1a1a1a1a",
    "key-strong": "#1a1a1a24",
  },
} as const;

export const SPACING = {
  "2": 2,
  "4": 4,
  "8": 8,
  "12": 12,
  "16": 16,
  "20": 20,
  "24": 24,
  "32": 32,
  "40": 40,
  "48": 48,
  "64": 64,
  "80": 80,
} as const;

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  full: 9999,
} as const;

// 토큰은 퍼센트, RN 의 opacity 는 0..1 이라 100 으로 나눴다
export const OPACITY = {
  "0": 0,
  "6": 0.06,
  "10": 0.1,
  "14": 0.14,
  "30": 0.3,
  "40": 0.4,
  "50": 0.5,
  "60": 0.6,
  "80": 0.8,
  "90": 0.9,
  "100": 1,
} as const;

export const TYPOGRAPHY = {
  "text-3xl": {
    bold: {
      fontSize: 56,
      lineHeight: 72,
      letterSpacing: -1.79,
      fontWeight: "700",
    },
    medium: {
      fontSize: 56,
      lineHeight: 72,
      letterSpacing: -1.79,
      fontWeight: "500",
    },
    regular: {
      fontSize: 56,
      lineHeight: 72,
      letterSpacing: -1.79,
      fontWeight: "400",
    },
  },
  "text-2xl": {
    bold: {
      fontSize: 40,
      lineHeight: 52,
      letterSpacing: -1.12,
      fontWeight: "700",
    },
    medium: {
      fontSize: 40,
      lineHeight: 52,
      letterSpacing: -1.12,
      fontWeight: "500",
    },
    regular: {
      fontSize: 40,
      lineHeight: 52,
      letterSpacing: -1.12,
      fontWeight: "400",
    },
  },
  "text-1xl": {
    bold: {
      fontSize: 32,
      lineHeight: 44,
      letterSpacing: -0.8,
      fontWeight: "700",
    },
    medium: {
      fontSize: 32,
      lineHeight: 44,
      letterSpacing: -0.8,
      fontWeight: "500",
    },
    regular: {
      fontSize: 32,
      lineHeight: 44,
      letterSpacing: -0.8,
      fontWeight: "400",
    },
  },
  "text-3lg": {
    bold: {
      fontSize: 28,
      lineHeight: 38,
      letterSpacing: -0.67,
      fontWeight: "700",
    },
    medium: {
      fontSize: 28,
      lineHeight: 38,
      letterSpacing: -0.67,
      fontWeight: "500",
    },
    regular: {
      fontSize: 28,
      lineHeight: 38,
      letterSpacing: -0.67,
      fontWeight: "400",
    },
  },
  "text-2lg": {
    bold: {
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.55,
      fontWeight: "700",
    },
    medium: {
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.55,
      fontWeight: "500",
    },
    regular: {
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.55,
      fontWeight: "400",
    },
  },
  "text-1lg": {
    bold: {
      fontSize: 22,
      lineHeight: 30,
      letterSpacing: -0.42,
      fontWeight: "700",
    },
    medium: {
      fontSize: 22,
      lineHeight: 30,
      letterSpacing: -0.42,
      fontWeight: "500",
    },
    regular: {
      fontSize: 22,
      lineHeight: 30,
      letterSpacing: -0.42,
      fontWeight: "400",
    },
  },
  "text-2md": {
    semibold: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
      fontWeight: "600",
    },
    medium: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
      fontWeight: "500",
    },
    regular: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
      fontWeight: "400",
    },
  },
  "text-1md": {
    semibold: {
      fontSize: 18,
      lineHeight: 26,
      letterSpacing: -0.04,
      fontWeight: "600",
    },
    medium: {
      fontSize: 18,
      lineHeight: 26,
      letterSpacing: -0.04,
      fontWeight: "500",
    },
    regular: {
      fontSize: 18,
      lineHeight: 26,
      letterSpacing: -0.04,
      fontWeight: "400",
    },
  },
  "text-1rg": {
    semibold: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.06,
      fontWeight: "600",
    },
    medium: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.06,
      fontWeight: "500",
    },
    regular: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.06,
      fontWeight: "400",
    },
  },
  "text-3sm": {
    semibold: {
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: -0.08,
      fontWeight: "600",
    },
    medium: {
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: -0.08,
      fontWeight: "500",
    },
    regular: {
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: -0.08,
      fontWeight: "400",
    },
  },
  "text-2sm": {
    semibold: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.08,
      fontWeight: "600",
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.08,
      fontWeight: "500",
    },
    regular: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.08,
      fontWeight: "400",
    },
  },
  "text-1sm": {
    semibold: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.09,
      fontWeight: "600",
    },
    medium: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.09,
      fontWeight: "500",
    },
    regular: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.09,
      fontWeight: "400",
    },
  },
  "text-2xs": {
    semibold: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: -0.1,
      fontWeight: "600",
    },
    medium: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: -0.1,
      fontWeight: "500",
    },
    regular: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: -0.1,
      fontWeight: "400",
    },
  },
  "text-1xs": {
    semibold: {
      fontSize: 10,
      lineHeight: 12,
      letterSpacing: -0.1,
      fontWeight: "600",
    },
    medium: {
      fontSize: 10,
      lineHeight: 12,
      letterSpacing: -0.1,
      fontWeight: "500",
    },
    regular: {
      fontSize: 10,
      lineHeight: 12,
      letterSpacing: -0.1,
      fontWeight: "400",
    },
  },
} as const;

export const LAYOUT = {
  "content-max": 1200,
  "readable-max": 840,
  panel: 420,
  "touch-min": 40,
} as const;
