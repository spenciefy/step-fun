import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import { useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'tamagui';
import { useReadContract } from 'wagmi';
import { Competition } from '../(tabs)';
import { STEP_DOT_FUN_CONTRACT_ADDRESS } from '../../constants';
import { STEP_DOT_FUN_CONTRACT_ABI } from '../../stepDotFunContractABI';

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams();

  console.log('CompetitionDetailScreen id', id);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { open } = useWeb3Modal();

  const {
    data: getCompetitionData,
    isError,
    isPending,
    isSuccess,
  } = useReadContract({
    abi: STEP_DOT_FUN_CONTRACT_ABI,
    address: STEP_DOT_FUN_CONTRACT_ADDRESS,
    functionName: 'getCompetition',
    args: [BigInt(id as string)], // fixme: jank force cast
  });

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

  return (
    <YStack flex={1} borderRadius={8} backgroundColor="white">
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
        <Text fontSize={16} color={'black'}>
          {`Entry Fee: $${competition?.entryFeeUsd}`}
        </Text>
      </YStack>

      {competition?.playerAddresses &&
        competition?.playerAddresses.map((address) => (
          <YStack padding={16} gap={8}>
            <Text fontSize={16} color={'black'}>
              {address}
            </Text>
          </YStack>
        ))}
    </YStack>
  );
}
