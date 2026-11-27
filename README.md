# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 디자이너 리뷰

1. **링크.** `dev` 에 머지된 최신 Storybook 은 https://dev--6b09346198120c6b2bc461a5.chromatic.com 이다. 진행 중인 PR 의 Storybook 은 그 PR 의 `Storybook Publish` 체크에서 연다
2. **Foundations** 에 색, 타이포, 간격, 라운딩이 있다. 앱의 `src/shared/constants/theme.ts` 를 그대로 그린 것이라 피그마 Variables, Styles 와 나란히 놓고 본다. 토큰마다 이름과 값이 글자로 붙어 있어 피그마의 숫자와 바로 맞대 본다
3. **빠져 보이는 것이 정상인 항목.**
   - `Quizly-Team/frontend@d9f02130e111aabcb2cb7b32829982f3767a4b7a` 의 `tokens.json` 에는 피그마에만 있는 `glass/tint`, `glass/highlight`, `shadow/sheet`, `glass` effect style 이 없어서 안 보인다. `theme.ts` 머리의 SHA 가 이 SHA 와 다르면 이 목록은 그 SHA 에 대해 확인되지 않은 것이다
   - 앱이 일부러 내보내지 않는 그림자(boxShadow) 토큰, `Pretendard` 폰트, 다크 모드는 안 보인다

   그 밖에 빠지거나 값이 다른 것이 리뷰 대상이다

4. **이 링크에서 리뷰하는 것:** 색 값, 간격과 라운딩 크기, 글자 크기와 굵기와 줄 높이. 컴포넌트가 생기면 배치와 태블릿, 폰 전환
5. **이 링크에서 리뷰하지 않는 것:** 아래 표의 네 항목. 기기에서 본다

| 지점                            | 웹 Storybook                                                                                   | 기기                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 유리 효과 (`expo-glass-effect`) | 효과 없는 평범한 `View`                                                                        | iOS 만 유리. **Android 도 평범한 `View`** |
| 폰트                            | 브라우저 기본 폰트. 앱이 `Pretendard` 를 번들하지 않아 Typography 의 글자 폭이 피그마와 다르다 | 시스템 폰트                               |
| 그림자                          | CSS `box-shadow`                                                                               | iOS `shadow*`, Android `elevation`        |
| safe area                       | 인셋 0                                                                                         | 노치와 홈 인디케이터                      |

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
