import { ConfigContext, ExpoConfig } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';

const bundleIdentifier = IS_DEV ? 'fun.step.app.dev' : 'fun.step.app';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'step.fun (dev)' : 'step.fun',
  slug: 'step-fun',
  version: '0.1',
  runtimeVersion: {
    policy: 'appVersion',
  },
  owner: 'step-fun',
  orientation: 'portrait',
  icon: './assets/step-fun-icon.png',
  scheme: 'step-fun',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/step-fun-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F0EDEB',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleIdentifier,
    associatedDomains: ['applinks:step.fun'],
    buildNumber: '1',
    userInterfaceStyle: 'automatic',
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'fun.step.app',
    adaptiveIcon: {
      foregroundImage: './assets/step-fun-icon.png',
      backgroundColor: '#F0EDEB',
    },
    versionCode: 1,
    userInterfaceStyle: 'automatic',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    'sentry-expo',
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '', // TOFIX: ADD
    },
  },
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'miseenplace',
          project: 'step-fun',
        },
      },
    ],
  },
  updates: {
    url: 'TODO-ADD',
  },
});
