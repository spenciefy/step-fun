import { Edit, Settings } from '@tamagui/lucide-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ImpactFeedbackStyle,
  impactAsync,
  notificationAsync,
} from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Separator, Text, YStack } from 'tamagui';

import { useTranslation } from 'react-i18next';
import { useStyle } from '../../hooks/useStyle';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { systemBackground } = useStyle();

  return (
    <YStack flex={1} backgroundColor={systemBackground}>
      <Stack.Screen
        options={{
          title: 'Home',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Medium);
                router.push('/SettingsScreen');
              }}
            >
              <Settings size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </YStack>
  );
}
