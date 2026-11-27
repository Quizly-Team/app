import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  // src/app 은 expo-router 가 파일마다 라우트를 만든다. stories 를 거기 두지 않는다
  stories: ["../src/shared/**/*.stories.tsx"],
  framework: "@storybook/react-native-web-vite",
};

export default config;
