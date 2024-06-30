import { useColorScheme } from 'react-native';

export const useStyle = () => {
  const theme = useColorScheme();
  const primaryColor = '#38ad00';
  const primaryColorLight = theme === 'light' ? '#E2FFD4' : '#123700';
  const systemGray = theme === 'light' ? '#848489' : '#98989d';
  const systemGray2 = theme === 'light' ? '#AEAEB2FF' : '#636366FF';
  const systemGray3Dark = '#48484AFF';
  const systemGray3 = theme === 'light' ? '#C7C7CCFF' : systemGray3Dark;
  const systemGray4Dark = '#3A3A3CFF';
  const systemGray4 = theme === 'light' ? '#D1D1D6FF' : systemGray4Dark;
  const systemGray5 = theme === 'light' ? '#E5E5EAFF' : '#2C2C2EFF';
  const systemGray6Light = '#F4F4F5';
  const systemGray6Dark = '#1C1C1E';
  const systemGray6 = theme === 'light' ? systemGray6Light : systemGray6Dark;

  const systemGray2Reverse = theme === 'light' ? '#636366FF' : '#AEAEB2FF';
  const systemGray3Reverse = theme === 'light' ? systemGray3Dark : '#C7C7CCFF';
  const systemGray4Reverse = theme === 'light' ? '#3A3A3CFF' : '#D1D1D6FF';
  const systemGray5Reverse = theme === 'light' ? '#2C2C2EFF' : '#E5E5EAFF';
  const systemGray6Reverse =
    theme === 'light' ? systemGray6Dark : systemGray6Light;

  const systemBackground = theme === 'light' ? '#FFFFFF' : '#141414';
  const systemBackgroundReverse = theme === 'light' ? '#141414' : '#FFFFFF';

  const secondarySystemBackgroundLight = '#F4F4F5';
  const secondarySystemBackgroundDark = '#1C1C1E';
  const secondarySystemBackground =
    theme === 'light'
      ? secondarySystemBackgroundLight
      : secondarySystemBackgroundDark;
  const secondarySystemBackgroundReverse =
    theme === 'light'
      ? secondarySystemBackgroundDark
      : secondarySystemBackgroundLight;

  const tertiarySystemBackgroundDark = '#2C2C2EFF';
  const tertiarySystemBackground =
    theme === 'light'
      ? secondarySystemBackgroundLight
      : tertiarySystemBackgroundDark;
  const tertiarySystemBackgroundReverse =
    theme === 'light'
      ? tertiarySystemBackgroundDark
      : secondarySystemBackgroundLight;

  const systemGroupedBackground =
    theme === 'light' ? secondarySystemBackgroundLight : '#141414';
  const secondarySystemGroupedBackground =
    theme === 'light' ? '#FFFFFFFF' : '#252528';
  const tertiarySystemGroupedBackground =
    theme === 'light' ? '#FFFFFFFF' : '#38383c';

  // aliases
  const lightBackgroundColor = theme === 'light' ? systemGray6 : systemGray5;
  const textColor = systemGray6Reverse;
  const textColorReverse = systemGray5;
  const secondaryTextColor = systemGray;
  const secondaryTextColorReverse = systemGray2Reverse;
  const errorTextColor = '#FF3B30';

  const tabUnselectedBackgroundColor = systemGray6;
  const tabSelectedBackgroundColor = theme === 'light' ? 'white' : systemGray3;
  return {
    primaryColor,
    primaryColorLight,
    systemGray,
    systemGray2,
    systemGray3Dark,
    systemGray3,
    systemGray4Dark,
    systemGray4,
    systemGray5,
    systemGray6Light,
    systemGray6Dark,
    systemGray6,
    systemGray2Reverse,
    systemGray3Reverse,
    systemGray4Reverse,
    systemGray5Reverse,
    systemGray6Reverse,
    systemBackground,
    systemBackgroundReverse,
    secondarySystemBackgroundDark,
    secondarySystemBackground,
    secondarySystemBackgroundReverse,
    tertiarySystemBackground,
    tertiarySystemBackgroundReverse,
    systemGroupedBackground,
    secondarySystemGroupedBackground,
    tertiarySystemBackgroundDark,
    tertiarySystemGroupedBackground,
    lightBackgroundColor,
    textColor,
    textColorReverse,
    secondaryTextColor,
    secondaryTextColorReverse,
    errorTextColor,
    tabUnselectedBackgroundColor,
    tabSelectedBackgroundColor,
  };
};
