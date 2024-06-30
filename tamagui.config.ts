// the v2 config imports the css driver on web and react-native on native
// for reanimated: @tamagui/config/v2-reanimated
// for react-native only: @tamagui/config/v2-native
import { config } from '@tamagui/config/v2-reanimated';
import { createFont, createTamagui } from 'tamagui';

// https://github.com/tamagui/tamagui/blob/8e2ca3ad05d4784a8651176f64c81cd960a622c9/packages/config/src/createGenericFont.ts#L22
const genericFontSizes = {
  1: 10,
  2: 11,
  3: 12,
  4: 14,
  5: 15,
  6: 16,
  7: 20,
  8: 22,
  9: 30,
  10: 42,
  11: 52,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 124,
  true: 16,
};

const interFont = createFont({
  family: 'Inter',
  size: genericFontSizes,
  face: {
    100: { normal: 'InterThin' },
    200: { normal: 'InterExtraLight' },
    300: { normal: 'InterLight' },
    400: { normal: 'InterMedium' },
    500: { normal: 'Inter' },
    600: { normal: 'InterSemiBold' },
    700: { normal: 'InterBold' },
    800: { normal: 'InterExtraBold' },
    900: { normal: 'InterBlack' },
    semibold: { normal: 'InterSemiBold' },
    bold: { normal: 'InterBold' },
    normal: { normal: 'Inter' },
    medium: { normal: 'InterMedium' },
  },
});

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    heading: interFont,
    body: interFont,
  },
});

// this makes typescript properly type everything based on the config
type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
