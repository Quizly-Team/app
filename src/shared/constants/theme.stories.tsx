import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { StyleSheet, Text, View, type TextStyle } from "react-native";

import { flattenColors } from "./flattenColors";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "./theme";

const meta = { title: "Foundations" } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// 값을 글자로 같이 쓴다. 값이 바뀌면 도형 모양과 상관없이 스냅샷 diff 가 난다
const COLOR_ITEMS = flattenColors(COLORS).map(([path, value]) => ({
  label: `${path} ${value}`,
  style: { backgroundColor: value },
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
  swatch: {
    width: SPACING["48"],
    height: SPACING["48"],
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
    <View style={styles.flow}>
      {COLOR_ITEMS.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.swatch, item.style]} />
          <Text>{item.label}</Text>
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
