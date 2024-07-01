import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack, YStack } from 'tamagui';

import { useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'tamagui';
import {
  useReadContract,
  useSignMessage,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Competition } from '../(tabs)';
import { BASE_CHAIN_ID, STEP_DOT_FUN_CONTRACT_ADDRESS } from '../../constants';
import { STEP_DOT_FUN_CONTRACT_ABI } from '../../stepDotFunContractABI';

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams();

  console.log('CompetitionDetailScreen id', id);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { open } = useWeb3Modal();

  const {
    data: getCompetitionData,
    isError,
    isPending: readIsPending,
    isSuccess,
  } = useReadContract({
    abi: STEP_DOT_FUN_CONTRACT_ABI,
    address: STEP_DOT_FUN_CONTRACT_ADDRESS,
    functionName: 'getCompetition',
    args: [BigInt(id as string)], // fixme: jank force cast
  });

  const { data, signMessage } = useSignMessage();

  const { writeContract, isPending, data: hash, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  console.log('writeContract isPending', isPending);
  console.log('writeContract hash', hash);
  console.log('writeContract error', error);

  const parseCompetitionData = (data: any): Competition | null => {
    if (!data) {
      return null;
    }
    console.log('rawdata from contract', data);

    const competitionData = data[0];
    const playerAddresses = competitionData[1];
    return {
      id: id as string, //fixme
      name: competitionData['name'],
      bannerImageUrl: competitionData['bannerImageUrl'],
      startTime: new Date(Number(competitionData['startTime']) * 1000), // new Date(Number(competitionData[2]) * 1000),
      endTime: new Date(Number(competitionData['endTime']) * 1000), //new Date(Number(competitionData[3]) * 1000),
      entryFeeUsd: Number(competitionData['entryFeeUSD']),
      totalBalance: Number(competitionData['totalBalance']),
      playerAddresses,
    };
  };

  const competition = parseCompetitionData(getCompetitionData);
  console.log(competition);

  const onPressEnterCompetition = () => {
    if (!competition?.id) {
      console.log('ERROR: no competition id');
      return;
    }

    // TODO: check for USDC approval otherwise this will revert
    // FIXME: works to deeplink to rainbow, but not uniswap wallet
    writeContract({
      address: STEP_DOT_FUN_CONTRACT_ADDRESS,
      abi: STEP_DOT_FUN_CONTRACT_ABI,
      chainId: BASE_CHAIN_ID,
      functionName: 'joinCompetition',
      args: [
        BigInt(competition.id),
        'Spencer', // FIXME: update name
      ],
    });
  };

  return (
    <YStack
      flex={1}
      borderRadius={8}
      backgroundColor="white"
      justifyContent="space-between"
      pb={bottom}
    >
      <YStack>
        <Image
          source={{ uri: competition?.bannerImageUrl ?? '' }}
          style={{
            width: '100%',
            height: 200,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <YStack padding={16} gap={8}>
          <Text fontWeight="bold" fontSize={24} color={'black'}>
            {competition?.name ?? ''}
          </Text>
          <Text fontSize={16} color={'black'}>
            {`Start Time: ${
              competition ? competition.startTime.toLocaleString() : ''
            }`}
          </Text>
          <Text fontSize={16} color={'black'}>
            {`End Time: ${
              competition ? competition.endTime.toLocaleString() : ''
            }`}
          </Text>

          {competition && (
            <XStack gap={8} pt={16}>
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
                <Text fontSize={24} fontWeight="semibold" color={'white'}>
                  {`$${competition.entryFeeUsd}`}
                </Text>

                <Text
                  fontSize={16}
                  fontWeight={'semibold'}
                  color="white"
                  opacity={0.9}
                >
                  Entry Fee
                </Text>
              </YStack>
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
                <Text fontSize={24} fontWeight="semibold" color={'black'}>
                  {`${
                    competition.playerAddresses
                      ? competition.playerAddresses.length
                      : 0
                  }`}
                </Text>
                <Text
                  fontSize={16}
                  fontWeight={'bold'}
                  color="black"
                  opacity={0.6}
                >
                  Players
                </Text>
              </YStack>
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
                <Text fontSize={24} fontWeight="semibold" color={'black'}>
                  {`$${competition.totalBalance}`}
                </Text>
                <Text
                  fontSize={16}
                  fontWeight={'bold'}
                  color="black"
                  opacity={0.6}
                >
                  Prize Pool
                </Text>
              </YStack>
            </XStack>
          )}

          <Text
            fontSize={20}
            fontWeight={'bold'}
            color="black"
            opacity={1}
            pt={15}
          >
            Players
          </Text>
          {competition?.playerAddresses ? (
            competition?.playerAddresses.map((address) => (
              <YStack padding={16} gap={8}>
                <Text fontSize={16} color={'black'}>
                  {address}
                </Text>
              </YStack>
            ))
          ) : (
            <Text fontSize={18} color={'grey'}>
              {'No players yet'}
            </Text>
          )}
        </YStack>
      </YStack>
      <Button
        onPress={onPressEnterCompetition}
        bg="$blue10"
        borderRadius={10}
        shadowColor={'grey'}
        shadowRadius={3}
        shadowOpacity={0.3}
        color={'white'}
        fontSize={20}
        fontWeight={'semibold'}
        height={50}
        mx={16}
      >
        Enter Competition
      </Button>
    </YStack>
  );
}
