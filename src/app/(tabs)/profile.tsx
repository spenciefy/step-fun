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
import { BASE_CHAIN_ID, USDC_BASE_CONTRACT_ADDRESS } from '../../constants';
import { useStyle } from '../../hooks/useStyle';

type DaySteps = {
  date: Date;
  steps: number;
};

type WeeklySteps = {
  weekStart: Date;
  weekEnd: Date;
  dailySteps: DaySteps[];
  totalSteps: number;
  averageDailySteps: number;
};

const cardColors = ['$blue9', '$purple9', '$green9', '$orange9', '$pink9'];

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
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
          currentWeek.totalSteps = currentWeek.dailySteps.reduce(
            (sum, day) => sum + day.steps,
            0,
          );
          weeks.push(currentWeek);
        }
        const weekStart = new Date(step.date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        currentWeek = {
          weekStart,
          weekEnd,
          dailySteps: [],
          totalSteps: 0,
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
    <YStack flex={1} backgroundColor={systemBackground} pt={top}>
      <ScrollView flex={1} p={16}>
        <XStack mb={20}>
          <Text fontSize={30} fontWeight={'bold'}>
            Profile
          </Text>
        </XStack>
        <YStack gap={16}>
          <XStack alignItems="center" gap={16}>
            {isDisconnected ? (
              <Circle size={100} bg={'lightgrey'} />
            ) : (
              <Image
                source={{
                  uri: 'https://gateway.ipfs.io/ipfs/bafkreifsfa7dqltepulf45uahj32zbp6jahcaphzjki26bdd5bzz5unmii',
                }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            )}

            <YStack gap={10} justifyContent="space-between">
              <YStack gap={5}>
                <Text fontSize={24} fontWeight={'bold'}>
                  {isDisconnected ? 'Player' : 'spenciefy.eth'}
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
              bg="#ededed"
              p={12}
              borderRadius={10}
              alignItems="center"
              justifyContent="space-between"
              shadowColor={'darkgrey'}
              shadowRadius={3}
              shadowOpacity={0.3}
              gap={5}
            >
              <Text fontSize={28} fontWeight="semibold" color={'black'}>
                {`0`}
              </Text>
              <Text
                fontSize={16}
                fontWeight={'bold'}
                color="black"
                opacity={0.6}
              >
                Competitions
              </Text>
            </YStack>
            <YStack
              flex={1}
              bg="$blue10"
              p={12}
              borderRadius={10}
              alignItems="center"
              justifyContent="space-between"
              shadowColor={'grey'}
              shadowRadius={3}
              shadowOpacity={0.3}
              gap={5}
            >
              <Text fontSize={28} fontWeight="semibold" color={'white'}>
                {`$${
                  usdcBalance ? Number(usdcBalance.formatted).toFixed(2) : 0
                }`}
              </Text>
              <Text
                fontSize={16}
                fontWeight={'semibold'}
                color="white"
                opacity={0.9}
              >
                USDC
              </Text>
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

          <Text fontSize={20} fontWeight={'semibold'}>
            Your Steps
          </Text>
          {weeklyStepsData ? (
            <YStack flexWrap="wrap" flexDirection="row" gap={16}>
              {weeklyStepsData.map((week, index) => (
                <YStack
                  key={index}
                  width="100%"
                  alignItems="center"
                  p={16}
                  bg={cardColors[index % cardColors.length]}
                  shadowColor={'darkgrey'}
                  shadowRadius={3}
                  shadowOpacity={0.3}
                  gap={16}
                  borderRadius={10}
                >
                  <YStack width="100%" gap={5}>
                    <Text fontSize={20} fontWeight={'semibold'} color="white">
                      {`Week of ${week.weekStart.toLocaleDateString()} - ${week.weekEnd.toLocaleDateString()}`}
                    </Text>
                    <Text
                      fontSize={16}
                      fontWeight={'semibold'}
                      color="white"
                      opacity={0.8}
                    >
                      {`Average # steps per day: ${week.averageDailySteps.toLocaleString(
                        'en-US',
                        {
                          maximumFractionDigits: 0,
                        },
                      )}`}
                    </Text>
                    <Text
                      fontSize={16}
                      fontWeight={'semibold'}
                      color="white"
                      opacity={0.8}
                    >
                      {`Total # steps: ${week.totalSteps.toLocaleString(
                        'en-US',
                        {
                          maximumFractionDigits: 0,
                        },
                      )}`}
                    </Text>
                  </YStack>
                  <YStack flexWrap="wrap" flexDirection="row" gap={8}>
                    {week.dailySteps.map((day, dayIndex) => (
                      <YStack
                        key={dayIndex}
                        width="48%"
                        alignItems="center"
                        p={8}
                        bg="#FFFFFF40"
                        gap={5}
                        borderRadius={8}
                      >
                        <Text fontSize={16} color="white" opacity={0.8}>
                          {day.date.toLocaleString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text
                          fontSize={26}
                          fontWeight={'semibold'}
                          color="white"
                        >
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
