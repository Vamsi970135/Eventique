# EventEase Android Application

This is the Android application for EventEase, a comprehensive event services marketplace platform. This app helps you discover, book, and manage event professionals for various occasions like birthdays, weddings, corporate events, and more.

## Overview

The application allows you to:

- Browse different categories of event service providers
- View detailed profiles of service providers
- Book services for your events
- Communicate with service providers
- Manage your bookings
- Receive notifications for booking updates

## Application Structure

This is a Capacitor-based Android application that wraps the EventEase web application. Capacitor allows web applications to be packaged as native apps while also providing access to native device features.

## Technical Details

- Built with Capacitor: Provides a bridge between the web app and native platform
- Uses WebView to render the UI
- Connects to the EventEase backend API for data
- Supports push notifications

## Building the APK

See the `ANDROID_BUILD_INSTRUCTIONS.md` file in the root directory of the project for detailed instructions on how to build the APK.

## Development Notes

- The app requires Android 5.0 (API level 21) or higher
- The production API is hosted at `https://eventeaseapp.replit.app/api`
- For development, you can switch to a local API by modifying the API URL in the Capacitor configuration