# Event Ease

A comprehensive event services marketplace platform that simplifies event professional discovery, booking, and management through an intelligent and user-friendly mobile application.

## Features

- **User Authentication**: Separate login flows for customers and service providers
- **Service Discovery**: Browse and search event services by category, location, and ratings
- **Booking Management**: Request, confirm, and track service bookings
- **Messaging**: In-app communication between customers and service providers
- **Payments**: Secure payment processing with multiple payment options
- **Reviews & Ratings**: Leave and view reviews for services
- **Notifications**: Real-time updates on booking status changes
- **Profile Management**: Manage personal and business profiles

## Tech Stack

- **Frontend**: Flutter for cross-platform mobile development
- **Backend**: Firebase services (Authentication, Firestore, Storage, Cloud Functions)
- **Notifications**: Firebase Cloud Messaging, Flutter Local Notifications
- **Payments**: Stripe, Google Pay integration
- **Maps & Location**: Google Maps, Geolocator
- **State Management**: Provider, Flutter Bloc
- **CI/CD**: Firebase App Distribution

## Setup Instructions

### Prerequisites

- Flutter SDK (version 3.0 or higher)
- Dart SDK (version 2.17 or higher)
- Android Studio / VS Code with Flutter extensions
- Firebase CLI
- Node.js and npm (for Firebase Cloud Functions)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/event-ease.git
cd event-ease
```

2. **Install Flutter dependencies**

```bash
flutter pub get
```

3. **Set up Firebase**

- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication, Firestore, Storage, and Cloud Messaging
- Download and add the `google-services.json` file to `android/app/`
- Download and add the `GoogleService-Info.plist` file to `ios/Runner/`

4. **Configure Firebase Cloud Functions**

```bash
cd functions
npm install
```

5. **Create .env file**

Create a `.env` file in the root directory with the following variables:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

6. **Run the app**

```bash
flutter run
```

### Firebase Cloud Functions Deployment

Deploy Firebase Cloud Functions to handle notifications and other server-side logic:

```bash
firebase deploy --only functions
```

## Notification System Architecture

The app uses a multi-layered notification system:

1. **Firebase Cloud Functions**: Triggers notifications based on database events
2. **Firebase Cloud Messaging (FCM)**: Delivers push notifications to devices
3. **Flutter Local Notifications**: Handles notification display when the app is in foreground
4. **In-app Notification UI**: Displays notifications within the app interface

### Notification Types

- **Booking Status Updates**: Notifications when booking status changes
- **Payment Notifications**: Updates on payment status
- **Message Notifications**: Alerts when new messages are received
- **Review Reminders**: Prompts to leave reviews after completed services
- **System Notifications**: App updates and promotional messages

## Testing

Run the following commands to test the application:

```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test
```

## Building for Release

### Android

```bash
flutter build apk --release
# or
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Owner - [Your Email](mailto:your.email@example.com)