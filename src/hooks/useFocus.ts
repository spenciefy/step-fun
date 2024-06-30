import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export const useFocus = ({
  onBlur,
  onFocus,
}: {
  onBlur?: () => void;
  onFocus?: () => void;
}) => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState !== nextAppState) {
        setAppState(nextAppState);
      }
      if (appState === 'active' && nextAppState === 'background') {
        onBlur?.();
      }
      if (appState === 'background' && nextAppState === 'active') {
        onFocus?.();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [appState]);

  return {
    isFocused: appState === 'active',
  };
};
