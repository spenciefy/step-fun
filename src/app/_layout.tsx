import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { getLocales } from 'expo-localization';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import 'intl-pluralrules';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-polyfill-globals/auto';
import * as Sentry from 'sentry-expo';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../../tamagui.config';
import { changeAppLanguage } from '../i18n.config';

// Sentry.init({
//   dsn: '',
//   // enableInExpoDevelopment: true,
//   debug: process.env.NODE_ENV === 'development',
// });

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const deepLinkUrl = Linking.useURL();

  const deviceLanguageCode = getLocales()[0].languageCode;
  changeAppLanguage(deviceLanguageCode);
  const [loaded] = useFonts({
    InterThin: require('@tamagui/font-inter/otf/Inter-Thin.otf'), // 100
    InterExtraLight: require('@tamagui/font-inter/otf/Inter-ExtraLight.otf'), // 200
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'), // 300
    InterRegular: require('@tamagui/font-inter/otf/Inter-Regular.otf'), // 400
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'), // 500
    InterSemiBold: require('@tamagui/font-inter/otf/Inter-SemiBold.otf'), // 600
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'), // 700
    InterExtraBold: require('@tamagui/font-inter/otf/Inter-ExtraBold.otf'), // 800
    InterBlack: require('@tamagui/font-inter/otf/Inter-Black.otf'), // 900
  });

  useEffect(() => {
    const onLoad = async () => {
      setAppIsReady(true);
      // add a small delay to prevent a flash of white screen
      await new Promise((resolve) =>
        setTimeout(() => {
          SplashScreen.hideAsync();
          resolve(null);
        }, 2000),
      );
    };
    if (loaded) {
      void onLoad();
    }
  }, [loaded]);

  if (!appIsReady) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme}>
          <ThemeProvider
            value={colorScheme === 'light' ? DefaultTheme : DarkTheme}
          >
            <Slot />
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
