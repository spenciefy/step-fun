import { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

export default function SafeAreaView({
  useTopPadding = false,
  useBottomPadding = true,
  bg = '$background',
  children,
}: {
  useTopPadding?: boolean;
  useBottomPadding?: boolean;
  bg?: string;
  children: ReactNode;
}) {
  const { top, left, right, bottom } = useSafeAreaInsets();

  return (
    <YStack
      bg={bg}
      flex={1}
      paddingTop={useTopPadding ? top : 0}
      paddingBottom={useBottomPadding ? bottom : 0}
      marginLeft={left}
      marginRight={right}
    >
      {children}
    </YStack>
  );
}
