import { Settings } from '@tamagui/lucide-icons';
import { useQueryClient } from '@tanstack/react-query';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, YStack } from 'tamagui';

import { W3mButton, useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useTranslation } from 'react-i18next';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';
import { useStyle } from '../../hooks/useStyle';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { systemBackground } = useStyle();
  const { open } = useWeb3Modal();

  // need to call init healthkit on app open
  const initHealthKit = async () => {
    let options: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        ],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(
      options,
      (err: string, results: HealthValue) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }
        // Healthkit is initialized...
      },
    );
  };

  const getSteps = () => {
    // AppleHealthKit.getStepCount(
    //   {
    //     startDate: new Date(2024, 6, 30).toISOString(),
    //     includeManuallyAdded: false,
    //     period: 5,
    //   },
    //   (err: Object, results: HealthValue) => {
    //     if (err) {
    //       return;
    //     }
    //     console.log(results);
    //   },
    // );

    AppleHealthKit.getDailyStepCountSamples(
      {
        // date init month is index, starts at 0
        startDate: new Date(2024, 5, 28).toISOString(),
        period: 60 * 24,
      },
      (err, result) => {
        if (err) {
          console.log('error getting steps: ', err);
          return;
        }
        console.log(result);
      },
    );
  };

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
      <Button onPress={initHealthKit}>Request health perms</Button>
      <Button onPress={getSteps}>get steps</Button>

      <W3mButton balance="show" label="Connect Wallet" />
    </YStack>
  );
}
