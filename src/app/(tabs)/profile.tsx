import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Circle,
  Image,
  ScrollView,
  Separator,
  Text,
  XStack,
  YStack,
} from 'tamagui';

import {
  W3mAccountButton,
  useWalletInfo,
  useWeb3Modal,
} from '@web3modal/wagmi-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppleHealthKit from 'react-native-health';
import { useAccount, useBalance } from 'wagmi';
import { useStyle } from '../../hooks/useStyle';

type DaySteps = {
  date: Date;
  steps: number;
};

type WeeklySteps = {
  weekStart: Date;
  weekEnd: Date;
  dailySteps: DaySteps[];
  averageDailySteps: number;
};

const USDC_BASE_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ABI = [
  // Only the balanceOf function is needed for this example
  'function balanceOf(address owner) view returns (uint256)',
];
const BASE_CHAIN_ID = 8453;

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { systemBackground } = useStyle();
  const { open } = useWeb3Modal();
  const { walletInfo } = useWalletInfo();
  const { address, isConnecting, isDisconnected } = useAccount();
  // const { data: ensName } = useEnsName({ address, chainId: 1 });
  // const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  // console.log('ensName', ensName);

  const [weeklyStepsData, setWeeklyStepsData] = useState<WeeklySteps[] | null>(
    null,
  );

  const {
    data: usdcBalance,
    dataUpdatedAt,
    error,
    fetchStatus,
    isLoading,
    refetch,
  } = useBalance({
    address: address,
    chainId: BASE_CHAIN_ID,
    token: USDC_BASE_CONTRACT_ADDRESS,
  });

  console.log('address', address);
  console.log('usdcBalance', usdcBalance);
  const getSteps = () => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 90);

    AppleHealthKit.getDailyStepCountSamples(
      {
        startDate: past.toISOString(),
        endDate: today.toISOString(),
        period: 60 * 24,
      },
      (err, result) => {
        if (err) {
          console.log('error getting steps: ', err);
          return;
        }

        const parsedSteps: DaySteps[] = result.map(
          (item) =>
            ({
              date: new Date(item.startDate),
              steps: item.value,
            }) as DaySteps,
        );

        const weeklySteps = calculateWeeklySteps(parsedSteps);
        console.log('weeklySteps', weeklySteps);
        setWeeklyStepsData(weeklySteps);
      },
    );
  };

  const calculateWeeklySteps = (steps: DaySteps[]): WeeklySteps[] => {
    const weeks: WeeklySteps[] = [];
    let currentWeek: WeeklySteps;

    steps.forEach((step) => {
      const dayOfWeek = step.date.getDay();
      if (dayOfWeek === 0 || !currentWeek) {
        // Monday or start a new week
        if (currentWeek) {
          currentWeek.averageDailySteps =
            currentWeek.dailySteps.reduce((sum, day) => sum + day.steps, 0) /
            currentWeek.dailySteps.length;
          weeks.push(currentWeek);
        }
        const weekStart = new Date(step.date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        currentWeek = {
          weekStart,
          weekEnd,
          dailySteps: [],
          averageDailySteps: 0,
        };
      }
      currentWeek.dailySteps.push(step);
    });

    // if (currentWeek) {
    //   currentWeek.averageDailySteps =
    //     currentWeek.dailySteps.reduce((sum, day) => sum + day.steps, 0) /
    //     currentWeek.dailySteps.length;
    //   weeks.push(currentWeek);
    // }

    return weeks;
  };

  const onPressConnectWallet = () => {
    open();
  };

  return (
    <YStack flex={1} backgroundColor={systemBackground}>
      <ScrollView flex={1} p={16}>
        <YStack gap={16}>
          <XStack alignItems="center" gap={16}>
            <Circle size={100} bg={'lightgrey'} />
            <YStack gap={10} justifyContent="space-between">
              <YStack gap={5}>
                <Text fontSize={24} fontWeight={'bold'}>
                  Spencer
                </Text>

                <XStack alignItems="center" gap={3}>
                  {walletInfo?.icon && (
                    <Image
                      source={{ uri: walletInfo.icon }}
                      style={{ width: 24, height: 24 }}
                    />
                  )}
                  {walletInfo?.name && (
                    <Text color="grey">{`${walletInfo.name} Connected`}</Text>
                  )}
                </XStack>
              </YStack>
              <YStack pr={5}>
                <W3mAccountButton balance="show" />
              </YStack>
            </YStack>
          </XStack>

          {isDisconnected ? (
            <Button bg={'blue'} color={'white'} onPress={onPressConnectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <YStack alignItems="center" gap={5}></YStack>
          )}

          <XStack gap={12}>
            <YStack
              flex={1}
              bg="lightgrey"
              p={12}
              borderRadius={10}
              alignItems="center"
              justifyContent="space-between"
              gap={5}
            >
              <Text fontSize={28} fontWeight="semibold">
                {`0`}
              </Text>
              <Text fontSize={12}>Competitions</Text>
            </YStack>
            <YStack
              flex={1}
              bg="lightgrey"
              p={12}
              borderRadius={10}
              alignItems="center"
              justifyContent="space-between"
              gap={5}
            >
              {usdcBalance && (
                <Text fontSize={28} fontWeight="semibold">
                  {`$${Number(usdcBalance.formatted).toFixed(2)}`}
                </Text>
              )}
              <Text fontSize={12}>USDC</Text>
            </YStack>

            {/* <YStack
          flex={1}
          bg="lightgrey"
          p={12}
          borderRadius={10}
          alignItems="center"
          justifyContent="space-between"
          gap={5}
        >
          <Text fontSize={24} fontWeight="semibold">
            {`$0`}
          </Text>

          <Text fontSize={12}>Winnings</Text>
        </YStack> */}
          </XStack>

          <Separator />

          <Text fontSize={18} fontWeight={'semibold'}>
            Your Steps
          </Text>
          {weeklyStepsData ? (
            <YStack flexWrap="wrap" flexDirection="row" gap={8}>
              {weeklyStepsData.map((week, index) => (
                <YStack
                  key={index}
                  width="100%"
                  alignItems="center"
                  p={8}
                  bg="lightgrey"
                  gap={5}
                  borderRadius={8}
                >
                  <Text fontSize={14}>
                    {`Week of ${week.weekStart.toLocaleDateString()} - ${week.weekEnd.toLocaleDateString()}`}
                  </Text>
                  <Text fontSize={24} fontWeight={'semibold'}>
                    {`Average: ${week.averageDailySteps.toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}`}
                  </Text>
                  <YStack flexWrap="wrap" flexDirection="row" gap={8}>
                    {week.dailySteps.map((day, dayIndex) => (
                      <YStack
                        key={dayIndex}
                        width="48%"
                        alignItems="center"
                        p={8}
                        bg="lightgrey"
                        gap={5}
                        borderRadius={8}
                      >
                        <Text fontSize={14}>
                          {day.date.toLocaleString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text fontSize={24} fontWeight={'semibold'}>
                          {day.steps.toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                          })}
                        </Text>
                      </YStack>
                    ))}
                  </YStack>
                </YStack>
              ))}
            </YStack>
          ) : (
            <Button onPress={getSteps}>Enable access to steps data</Button>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
