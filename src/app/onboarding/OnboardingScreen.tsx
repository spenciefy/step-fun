import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { Button, H1, Text, View, YStack } from 'tamagui';

import { useTranslation } from 'react-i18next';
import SafeAreaView from '../../components/SafeAreaView';
import { useStyle } from '../../hooks/useStyle';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    systemBackground,
    systemGray3Dark,
    systemGray4Dark,
    secondarySystemBackgroundDark,
  } = useStyle();
  return (
    <SafeAreaView useTopPadding useBottomPadding={false} bg={systemBackground}>
      <Stack.Screen options={{ headerShown: false }} />
      <YStack flex={1} justifyContent="space-between" pt={16}>
        <YStack flex={1} justifyContent="space-between">
          <YStack
            pt={64}
            flex={1}
            alignItems="center"
            justifyContent="center"
            space={16}
          >
            <YStack alignItems="center">
              <H1 fontSize={80} lineHeight={80} fontWeight={'700'}>
                step.fun
              </H1>
              <Text fontSize={20}>{t('onboardingScreen.title')}</Text>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
