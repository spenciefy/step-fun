import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ScrollView, Text, YStack } from 'tamagui';

import { useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useTranslation } from 'react-i18next';
import { useStyle } from '../../hooks/useStyle';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { systemBackground } = useStyle();
  const { open } = useWeb3Modal();

  return (
    <YStack flex={1} backgroundColor={systemBackground}>
      <ScrollView showsVerticalScrollIndicator>
        <YStack
          margin={16}
          padding={16}
          borderRadius={8}
          backgroundColor="darkblue"
          shadowColor="black"
          shadowOpacity={0.2}
          shadowRadius={4}
          shadowOffset={{ width: 0, height: 2 }}
        >
          <YStack>
            <Text fontWeight="bold" fontSize={18} color={'white'}>
              Walk the Base
            </Text>
            <Text fontSize={16} color={'white'}>
              1 participant
            </Text>
            <Text fontSize={16} color={'white'}>
              Prize pool: $15
            </Text>
            <Text fontSize={16} color={'white'}>
              Ends in 14:00
            </Text>
          </YStack>
          <Button marginTop={16} width="100%">
            Entry Fee: $5
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
