
# step.fun

### step competitions on base, with no ponzinomics.

![stepbanner](https://github.com/spenciefy/step-fun/assets/3144112/4fbe52d9-e96f-4465-b667-29943149b51d)

## How it works
1. create a competition and set the entry fee
2. anyone can "buy in" to the step competition
3. player with most steps can claim the prize pool of all entry fees

(not fully feature complete, hacked together the concept on the last day of this buildathon)


## Tech
- React Native app to access Apple HealthKit step data
- Used build-onchain-app-template to get help writing and deploying a contract to base mainnet (https://basescan.org/address/0x593c34f5c79bbb5ba3b45dfe77c8630545f32f05)
- WalletConnect AppKit SDK

React Native app repo forked from another private project. Below is the general running readme (might not really work)

---

- Created with `create-expo-app`, but using development builds outside of Expo Go because we use native modules
- `expo-router` for screen routing based on file paths
- [Tamagui](https://tamagui.dev/) for UI components
- EAS build service for deployment

## Installation

### Prereqs

1. Make sure you have `yarn` installed
2. Install EAS CLI: `npm install -g eas-cli`
3. Login to Expo `eas login`
4. Follow the prerequisite instructions for iOS and Android here: https://docs.expo.dev/guides/local-app-development/. You should have Xcode for iOS, Android Studio for Android (Android has its own slightly lengthy setup process)

### Build dev app locally

We use "managed workflow" meaning we let Expo deal with all the native stuff, makes things a lot easer. But to run locally we need to "prebuild", which generates the ios/android folders. This command is hidden behind `yarn run:ios` etc. And this ios/android folders are ignored.

See full guide here: https://docs.expo.dev/guides/local-app-development/

The below will build the "step.fun (dev)" app. From there you can connect to your local dev server, or you can install _any_ OTA update, which is great for testing.

```
yarn run:ios
yarn run:android
```

### Building prod app locally

By simply not setting APP_ENV you can also build the prod app "step.fun" locally, but this will replace the installed live/Testflight version you have on your device:

`expo prebuild --platform ios --clean && expo run:ios --device`

### Create production build via EAS

EAS is used to simplify generating builds and submitting to App Store/PlayStore.

Note that this requires being logged into `eas` locally and having access to the `step.fun` Expo organization. See setup guide here:
https://docs.expo.dev/develop/development-builds/create-a-build/

**NOTE:** Before creating a new production build you need to manually bump the versions (in `app.config.ts`), ideally both `version` (eg 1.0.2) and `buildNumber`/`versionCode`. Remember, the `version` is then used to align the OTA updates. Doing an OTA update for eg. 1.0.2 will not be installed on 1.0.1 etc.

Good practice is to bump the path (1.0.X) when native code has changed, eg adding new `expo-xxx` module.  
Remember, after submitting eg 1.0.1 to the app stores you need to bump the version for the "coming" app version, as you can only submit 1.0.1 once, even if you bump the build number.

To create production build (interactive):
`eas build`

(Shortcut to build and submit at the same time: `eas build -p ios --auto-submit`)

To upload to App Store/Play Store:
`eas submit`

- Note you need `eas-google-service-account.json` for Play Store upload, and necessary Apple Developer account permissions for App Store upload

### OTA Updates

Docs: https://docs.expo.dev/eas-update/how-it-works/

OTA Updates are great for testing, but also for fixing bugs in production etc. The workflow should be to first create a development/preview update that can be tested in the dev app. After an update has been tested you can promote it to production: `eas update --channel production`

Publishing a OTA update:  
`eas update --branch preview --message "Copy update"`  
`eas update --branch preview --auto` (--auto to use git message and commit instead of manual message)

This will build a new bundle and upload to Expo servers. In the cause above the "preview" apps will get this new update.
Only apps with the same version (eg 1.0.1) will get this new update. Every time you add a new native module (expo install X) or change something like app name you need to do a new native build, and bump the version. But for most other changes OTA will work. Always test an update on preview before publishing to production.

## File structure (WIP)

- `src/api`: util files to interact with API and manage user state with `React.Context`
- `src/app`: All screens. Uses `expo-router`, read below for more context.
- `src/components`: common shared or isolated components used in screens (note: don't love this structure for components exclusively used by 1 screen)
- `src/types`: types corresponding to API

`expo-router` uses file-based routes similar to a web project. Read the guide for full context: https://docs.expo.dev/router/introduction/

Some tips:

1. All screens live under `src/app`.
2. Root layout (first rendered screen)is `app/_layout.tsx`. This file contains all providers (theme, api)
   3

## TODOs

There is some misc tech debt:

1. Tamagui UI config is default, haven't created custom configuration. This current implementation of using Tamagui isn't following best practices (many manual colors, margin/padding values)
