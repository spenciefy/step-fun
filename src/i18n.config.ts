import i18n, { ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../translations';
import { Native } from 'sentry-expo';
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
  es: { languageCode: 'es', nativeName: 'Español', englishName: 'Spanish' },
  fr: { languageCode: 'fr', nativeName: 'Français', englishName: 'French' },
  'zh-CN': {
    languageCode: 'zh-CN',
    nativeName: '简体中文',
    englishName: 'Simplified Chinese',
  },
  'zh-TW': {
    languageCode: 'zh-TW',
    nativeName: '繁體中文',
    englishName: 'Traditional Chinese',
  },
  ar: { languageCode: 'ar', nativeName: 'العربية', englishName: 'Arabic' },
  bn: { languageCode: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  hi: { languageCode: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  ru: { languageCode: 'ru', nativeName: 'Русский', englishName: 'Russian' },
  pt: {
    languageCode: 'pt',
    nativeName: 'Português',
    englishName: 'Portuguese',
  },
  ja: { languageCode: 'ja', nativeName: '日本語', englishName: 'Japanese' },
  de: { languageCode: 'de', nativeName: 'Deutsch', englishName: 'German' },
  it: { languageCode: 'it', nativeName: 'Italiano', englishName: 'Italian' },
  id: {
    languageCode: 'id',
    nativeName: 'Indonesia',
    englishName: 'Indonesian',
  },
  ur: { languageCode: 'ur', nativeName: 'اردو', englishName: 'Urdu' },
  pl: { languageCode: 'pl', nativeName: 'Polski', englishName: 'Polish' },
  uk: {
    languageCode: 'uk',
    nativeName: 'Українська',
    englishName: 'Ukrainian',
  },
  fa: { languageCode: 'fa', nativeName: 'فارسی', englishName: 'Persian' },
  ml: { languageCode: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  kn: { languageCode: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  pa: { languageCode: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  ro: { languageCode: 'ro', nativeName: 'Română', englishName: 'Romanian' },
  gu: { languageCode: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  or: { languageCode: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  sd: { languageCode: 'sd', nativeName: 'سنڌي', englishName: 'Sindhi' },
  mr: { languageCode: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  te: { languageCode: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  ta: { languageCode: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  th: { languageCode: 'th', nativeName: 'ไทย', englishName: 'Thai' },
  nl: { languageCode: 'nl', nativeName: 'Nederlands', englishName: 'Dutch' },
  tr: { languageCode: 'tr', nativeName: 'Türkçe', englishName: 'Turkish' },
  ko: { languageCode: 'ko', nativeName: '한국어', englishName: 'Korean' },
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
    logger.debug('Changing language to:', { parsedLanguageCode });
    i18n.changeLanguage(parsedLanguageCode);
  } else {
    logger.error('Language not supported', { parsedLanguageCode });
  }
};

export default i18n;
