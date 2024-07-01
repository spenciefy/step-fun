// eslint-disable import/no-unresolved
import '@walletconnect/react-native-compat';
import 'intl-pluralrules';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { getLocales } from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';

import { base } from '@wagmi/core/chains';
import {
  Web3Modal,
  createWeb3Modal,
  defaultWagmiConfig,
} from '@web3modal/wagmi-react-native';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import { WagmiProvider } from 'wagmi';
import config from '../../tamagui.config';
import { changeAppLanguage } from '../i18n.config';

SplashScreen.preventAutoHideAsync();

// Walletconnect setup
const queryClient = new QueryClient();
const projectId = 'a914941e1da15f31b74afb7d6051d80a';
const metadata = {
  name: 'step.fun',
  description: 'compete in a step competition',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'step-fun://',
  },
};

const chains = [base] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  projectId,
  wagmiConfig,
  defaultChain: base,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  tokens: {
    8453: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC but this feature doesnt seem to work
    },
  },
});

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

          // Init healhkit on start - prob should eventually move this to a permissions button
          // let options: HealthKitPermissions = {
          //   permissions: {
          //     read: [
          //       AppleHealthKit.Constants.Permissions.Steps,
          //       AppleHealthKit.Constants.Permissions.StepCount,
          //       AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          //       AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          //     ],
          //     write: [],
          //   },
          // };

          // AppleHealthKit.initHealthKit(
          //   options,
          //   (err: string, results: HealthValue) => {
          //     if (err) {
          //       console.log('error initializing Healthkit: ', err);
          //       return;
          //     }

          //     console.log('Healthkit initialized');
          //     // Healthkit is initialized...
          //   },
          // );

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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <Theme name={colorScheme}>
            <ThemeProvider
              value={colorScheme === 'light' ? DefaultTheme : DarkTheme}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="competitionDetail/[id]"
                  options={{
                    // Set the presentation mode to modal for our modal route.
                    presentation: 'modal',
                    headerShown: false,
                  }}
                />
              </Stack>
              <Web3Modal />
            </ThemeProvider>
          </Theme>
        </TamaguiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
