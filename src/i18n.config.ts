import i18n, { ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../translations';
import 'intl-pluralrules';
import { logger } from './logger';

interface TranslationResources {
  [key: string]: {
    translation: ResourceKey;
  };
}

const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = { translation: translations[lang as keyof typeof translations] };
  return acc;
}, {} as TranslationResources);

export interface Language {
  languageCode: string;
  nativeName: string;
  englishName: string;
}

interface SupportedLanguages {
  [key: string]: Language;
}

export const SUPPORTED_LANGUAGES: SupportedLanguages = {
  en: { languageCode: 'en', nativeName: 'English', englishName: 'English' },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en', // Language to use if translations in user language are not available
  supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  interpolation: {
    escapeValue: false, // Not needed for React
  },
});

export const getLanguageNativeName = (languageCode: string) => {
  const parsedLanguageCode = parseDeviceLanguageCode(languageCode);
  if (parsedLanguageCode in SUPPORTED_LANGUAGES) {
    const language = SUPPORTED_LANGUAGES[parsedLanguageCode];
    return language.nativeName;
  } else {
    return languageCode;
  }
};

// Parse the language code returned by device.
// Only use first two chars for most langauges except for custom overrides here
export const parseDeviceLanguageCode = (languageCode: string) => {
  // Normalizes language tags like 'zh-Hans-ch' to 'zh-Hans' that could happen on Android
  const normalizedLanguageTag = languageCode.split('-').slice(0, 2).join('-');

  // Add any custom override handling here
  // Default to stripping the region code and returning the first 2 chars
  switch (normalizedLanguageTag) {
    // Apple uses ISO15924 code for Chinese: zh-Hans (simplified) and zh-Hant (traditional)
    case 'zh-Hans':
      return 'zh-CN';
    case 'zh-Hant':
      return 'zh-TW';
    default:
      // Ensure we return a 2 char language code (server may return unsupported regions)
      return normalizedLanguageTag.slice(0, 2);
  }
};

// Parses a language code and updates i18n language if it is part of SUPPORTED_LANGUAGES
export const changeAppLanguage = (languageCode: string) => {
  const parsedLanguageCode = parseDeviceLanguageCode(languageCode);

  // Skip changing anything if language is already the requested language to change to
  if (i18n.language === parsedLanguageCode) {
    return;
  }

  if (parsedLanguageCode in SUPPORTED_LANGUAGES) {
    // logger.debug('Changing language to:', { parsedLanguageCode });
    i18n.changeLanguage(parsedLanguageCode);
  } else {
    // logger.error('Language not supported', { parsedLanguageCode });
  }
};

export default i18n;
