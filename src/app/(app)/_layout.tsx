import { Redirect, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { Button, Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { Text } from 'tamagui';

import { useTranslation } from 'react-i18next';
import i18n, { changeAppLanguage } from '../../i18n.config';
import { Native } from 'sentry-expo';

export default function AppLayout() {
  const { t } = useTranslation();
  const showOnboarding = false;

  // useEffect(() => {
  //   if (user !== undefined) {
  //     // TODO: add any analytics user idenification etc
  //   }
  // }, [user]);

  // Require authentication for all screens in /(app) route
  if (showOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Add modals to Stack here
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="SettingsScreen"
        options={{
          headerTitle: t('settingsScreen.headerTitle'),
          presentation: 'modal',
          headerRight: () =>
            // Android doesn't have modal presentation, back button automatically added
            Platform.OS === 'ios' ? (
              <Button
                title="Done"
                onPress={() => {
                  router.back();
                }}
              />
            ) : null,
        }}
      />
    </Stack>
  );
}
