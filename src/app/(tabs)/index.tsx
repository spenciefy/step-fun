import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import { useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { Image, XStack } from 'tamagui';
import { useReadContract } from 'wagmi';
import { STEP_DOT_FUN_CONTRACT_ADDRESS } from '../../constants';
import { useStyle } from '../../hooks/useStyle';
import { STEP_DOT_FUN_CONTRACT_ABI } from '../../stepDotFunContractABI';

export type Competition = {
  id: string;
  name: string;
  bannerImageUrl: string;
  startTime: Date;
  endTime: Date;
  entryFeeUsd: number;
  totalBalance: number;
  playerAddresses: string[];
};

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { systemBackground } = useStyle();
  const { open } = useWeb3Modal();

  const {
    data: getCompetitionsData,
    isError,
    isPending,
    isSuccess,
  } = useReadContract({
    abi: STEP_DOT_FUN_CONTRACT_ABI,
    address: STEP_DOT_FUN_CONTRACT_ADDRESS,
    functionName: 'getCompetitions',
  });

  const parseCompetitionsData = (data: any): Competition[] => {
    if (!data) {
      return [];
    }
    console.log('rawdata form contract', data);

    return data.map((competitionData: any, index: number) => {
      return {
        id: index.toString(), // NOTE: super janky, i forgot to add the id to the contract but this will do for now
        name: competitionData['name'],
        bannerImageUrl: competitionData['bannerImageUrl'],
        startTime: new Date(Number(competitionData['startTime']) * 1000), // new Date(Number(competitionData[2]) * 1000),
        endTime: new Date(Number(competitionData['endTime']) * 1000), //new Date(Number(competitionData[3]) * 1000),
        entryFeeUsd: Number(competitionData['entryFeeUSD']),
        totalBalance: Number(competitionData['totalBalance']),
        playerAddresses: competitionData['playerAddresses'],
      };
    });
  };

  const competitions = parseCompetitionsData(getCompetitionsData);
  console.log(competitions);

  return (
    <YStack flex={1} backgroundColor={systemBackground} pt={top}>
      <FlatList
        ListHeaderComponent={
          <XStack mx={16} mt={16} mb={10}>
            <Text fontSize={30} fontWeight={'bold'}>
              Competitions
            </Text>
          </XStack>
        }
        data={competitions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/competitionDetail/[id]',
              params: { id: item.id },
            }}
            asChild
          >
            <YStack
              mx={16}
              mt={16}
              borderRadius={8}
              backgroundColor="white"
              shadowColor="black"
              shadowOpacity={0.2}
              shadowRadius={4}
              shadowOffset={{ width: 0, height: 2 }}
            >
              <Image
                source={{ uri: item.bannerImageUrl }}
                style={{
                  width: '100%',
                  height: 200,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <YStack padding={16} gap={8}>
                <Text fontWeight="bold" fontSize={24} color={'black'}>
                  {item.name}
                </Text>
                <Text fontSize={16} color={'black'}>
                  {`Start Time: ${item.startTime.toLocaleString()}`}
                </Text>
                <Text fontSize={16} color={'black'}>
                  {`End Time: ${item.endTime.toLocaleString()}`}
                </Text>
                <Text fontSize={16} color={'black'}>
                  {`Entry Fee: $${item.entryFeeUsd}`}
                </Text>
              </YStack>
            </YStack>
          </Link>
        )}
      />
      {/* </ScrollView> */}
    </YStack>
  );
}
