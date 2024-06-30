import { X } from '@tamagui/lucide-icons';
import { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { useStyle } from '../hooks/useStyle';

type CloseButtonProps = {
  onPress: () => void;
};

export const CloseButton: FC<CloseButtonProps> = ({ onPress }) => {
  const { systemGray, systemGray5 } = useStyle();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 0,
        backgroundColor: systemGray5,
        borderRadius: 100,
        width: 24,
        height: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <X size={16} color={systemGray} />
    </TouchableOpacity>
  );
};
