import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, YStack } from 'tamagui';

import { W3mButton, useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useTranslation } from 'react-i18next';
import AppleHealthKit from 'react-native-health';
import { useStyle } from '../../hooks/useStyle';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { systemBackground } = useStyle();
  const { open } = useWeb3Modal();

  const getSteps = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    AppleHealthKit.getDailyStepCountSamples(
      {
        startDate: thirtyDaysAgo.toISOString(),
        endDate: today.toISOString(),
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
      <Button onPress={getSteps}>get steps</Button>

      <W3mButton balance="show" label="Connect Wallet" />
    </YStack>
  );
}
