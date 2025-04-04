# Building the EventEase Android App

This document provides instructions on how to build the EventEase Android application from the source code.

## Prerequisites

1. Install Android Studio: [Download Android Studio](https://developer.android.com/studio)
2. Install JDK 11 or higher
3. Download and extract the `event-ease-android.zip` file to your local machine

## Building the APK

### Option 1: Using Android Studio (Recommended for beginners)

1. Open Android Studio
2. Select "Open an Existing Project"
3. Navigate to the extracted `android` folder and select it
4. Wait for the project to sync and build
5. From the menu, select Build > Build Bundle(s) / APK(s) > Build APK(s)
6. Once the build is complete, you'll receive a notification with a link to the APK file location

### Option 2: Using Command Line

1. Open a terminal or command prompt
2. Navigate to the extracted `android` folder
3. Run the following command:
   ```
   ./gradlew assembleDebug
   ```
4. The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Installing the APK on Your Device

1. Transfer the APK file to your Android device
2. On your Android device, navigate to the APK file using a file manager
3. Tap on the APK file to install it
4. You may need to enable "Install from Unknown Sources" in your device settings

## Troubleshooting

If you encounter any issues during the build process:

1. Make sure you have the latest version of Android Studio
2. Ensure that you have JDK 11 or higher installed
3. Check that Android SDK is properly configured in Android Studio
4. Try running `./gradlew clean` before rebuilding

## Note on Development Builds

This APK is a development build and is not optimized for production use. It may contain debug code and is not signed with a production key.