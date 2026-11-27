import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { StyleSheet, Text, View, type TextStyle } from "react-native";

import { groupColors } from "./flattenColors";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "./theme";

const meta = { title: "Foundations" } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// 값을 글자로 같이 쓴다. 값이 바뀌면 도형 모양과 상관없이 스냅샷 diff 가 난다
const COLOR_SECTIONS = groupColors(COLORS).map(([parent, leaves]) => ({
  parent,
  cards: leaves.map(([name, value]) => ({ name, value, style: { backgroundColor: value } })),
}));

const TYPOGRAPHY_ITEMS = Object.entries(TYPOGRAPHY).flatMap(([size, weights]) =>
  Object.entries<TextStyle>(weights).map(([weight, style]) => ({
    label: `${size}/${weight} ${style.fontSize}/${style.lineHeight}/${style.letterSpacing}/${style.fontWeight}`,
    style,
  })),
);

const SPACING_ITEMS = Object.entries(SPACING).map(([name, value]) => ({
  label: `${name} ${value}`,
  style: { width: value, height: value },
}));

const RADIUS_ITEMS = Object.entries(RADIUS).map(([name, value]) => ({
  label: `${name} ${value}`,
  style: { borderRadius: value },
}));

const styles = StyleSheet.create({
  flow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING["16"],
    padding: SPACING["16"],
  },
  column: {
    gap: SPACING["16"],
    padding: SPACING["16"],
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING["8"],
  },
  sections: {
    gap: SPACING["32"],
    padding: SPACING["16"],
  },
  section: {
    gap: SPACING["8"],
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING["16"],
  },
  card: {
    width: SPACING["80"],
  },
  // 흰 견본 3개가 흰 배경에서 보이게 테두리를 준다
  swatch: {
    width: SPACING["80"],
    height: SPACING["80"],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.line.normal,
  },
  fill: {
    backgroundColor: COLORS.primary.normal,
  },
  // 변 80 에서만 RADIUS 8개가 모두 다른 모양이다. 48 이면 xl, 2xl, full 이 같은 원이다
  radiusBox: {
    width: SPACING["80"],
    height: SPACING["80"],
  },
});

export const Colors: Story = {
  render: () => (
    <View style={styles.sections}>
      {COLOR_SECTIONS.map((section) => (
        <View key={section.parent} style={styles.section}>
          <Text style={TYPOGRAPHY["text-1md"].semibold}>{section.parent}</Text>
          <View style={styles.cards}>
            {section.cards.map((card) => (
              <View key={card.name} style={styles.card}>
                <View style={[styles.swatch, card.style]} />
                <Text style={TYPOGRAPHY["text-2xs"].regular}>{card.name}</Text>
                <Text style={TYPOGRAPHY["text-2xs"].regular}>{card.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

export const Typography: Story = {
  render: () => (
    <View style={styles.column}>
      {TYPOGRAPHY_ITEMS.map((item) => (
        <Text key={item.label} style={item.style}>
          {item.label}
        </Text>
      ))}
    </View>
  ),
};

export const Spacing: Story = {
  render: () => (
    <View style={styles.flow}>
      {SPACING_ITEMS.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.fill, item.style]} />
          <Text>{item.label}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Radius: Story = {
  render: () => (
    <View style={styles.flow}>
      {RADIUS_ITEMS.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.radiusBox, styles.fill, item.style]} />
          <Text>{item.label}</Text>
        </View>
      ))}
    </View>
  ),
};
