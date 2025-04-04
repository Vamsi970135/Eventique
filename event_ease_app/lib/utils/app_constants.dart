import 'package:flutter/material.dart';

/// The app constants
class AppConstants {
  /// Private constructor to prevent instantiation
  AppConstants._();
  
  /// The app name
  static const String appName = 'Event Ease';
  
  /// The app slogan
  static const String appSlogan = 'Booking event services made easy';
  
  /// The app version
  static const String appVersion = '1.0.0';
  
  /// The app company
  static const String appCompany = 'Event Ease Inc.';
  
  /// The app website
  static const String appWebsite = 'https://eventease.com';
  
  /// The app email
  static const String appEmail = 'support@eventease.com';
  
  /// The app phone
  static const String appPhone = '+1 (123) 456-7890';
  
  /// The app copyright
  static const String appCopyright = '© 2023 Event Ease Inc. All rights reserved.';
  
  /// The app terms of service URL
  static const String appTermsUrl = 'https://eventease.com/terms';
  
  /// The app privacy policy URL
  static const String appPrivacyUrl = 'https://eventease.com/privacy';
  
  /// The app help URL
  static const String appHelpUrl = 'https://eventease.com/help';
  
  /// The app API URL
  static const String appApiUrl = 'https://api.eventease.com';
  
  /// The app storage URL
  static const String appStorageUrl = 'https://storage.eventease.com';
  
  /// The default avatar URL
  static const String defaultAvatarUrl = 'https://storage.eventease.com/default/avatar.png';
  
  /// The default cover URL
  static const String defaultCoverUrl = 'https://storage.eventease.com/default/cover.png';
  
  /// The default service image URL
  static const String defaultServiceUrl = 'https://storage.eventease.com/default/service.png';
  
  /// The default logo URL
  static const String defaultLogoUrl = 'https://storage.eventease.com/default/logo.png';
  
  /// The app colors
  static const Color primaryColor = Color(0xFF6200EE);
  static const Color secondaryColor = Color(0xFF03DAC6);
  static const Color accentColor = Color(0xFFFFC107);
  static const Color backgroundColor = Color(0xFFF5F5F5);
  static const Color cardColor = Colors.white;
  static const Color errorColor = Color(0xFFB00020);
  static const Color successColor = Color(0xFF4CAF50);
  static const Color warningColor = Color(0xFFFFC107);
  static const Color infoColor = Color(0xFF2196F3);
  
  /// The app text styles
  static const TextStyle headingStyle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  );
  
  static const TextStyle subheadingStyle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
  );
  
  static const TextStyle bodyStyle = TextStyle(
    fontSize: 16,
    color: Colors.black87,
  );
  
  static const TextStyle captionStyle = TextStyle(
    fontSize: 14,
    color: Colors.black54,
  );
  
  /// The app button styles
  static final ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: primaryColor,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );
  
  static final ButtonStyle secondaryButtonStyle = OutlinedButton.styleFrom(
    foregroundColor: primaryColor,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    side: const BorderSide(color: primaryColor),
  );
  
  static final ButtonStyle textButtonStyle = TextButton.styleFrom(
    foregroundColor: primaryColor,
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  );
  
  /// The app input styles
  static final InputDecoration inputDecoration = InputDecoration(
    filled: true,
    fillColor: Colors.grey[100],
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: primaryColor, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: errorColor, width: 2),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
  );
  
  /// The app card styles
  static final BoxDecoration cardDecoration = BoxDecoration(
    color: cardColor,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.05),
        blurRadius: 10,
        offset: const Offset(0, 4),
      ),
    ],
  );
  
  /// The app animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);
  
  /// The app padding
  static const double smallPadding = 8.0;
  static const double mediumPadding = 16.0;
  static const double largePadding = 24.0;
  static const double extraLargePadding = 32.0;
  
  /// The app radius
  static const double smallRadius = 4.0;
  static const double mediumRadius = 8.0;
  static const double largeRadius = 16.0;
  static const double extraLargeRadius = 24.0;
  
  /// The app elevation
  static const double smallElevation = 1.0;
  static const double mediumElevation = 2.0;
  static const double largeElevation = 4.0;
  static const double extraLargeElevation = 8.0;
  
  /// The app animation curves
  static const Curve fastOutSlowInCurve = Curves.fastOutSlowIn;
  static const Curve easeInOutCurve = Curves.easeInOut;
  static const Curve easeInCurve = Curves.easeIn;
  static const Curve easeOutCurve = Curves.easeOut;
  
  /// The service categories
  static const List<String> serviceCategories = [
    'Photography',
    'Videography',
    'Catering',
    'Venue',
    'Decoration',
    'Entertainment',
    'Transportation',
    'Cakes & Desserts',
    'Flowers',
    'Invitation',
    'Jewelry',
    'Clothing',
    'Makeup & Hair',
    'Music',
    'Lighting',
    'Other',
  ];
  
  /// The event types
  static const List<String> eventTypes = [
    'Wedding',
    'Birthday',
    'Corporate',
    'Engagement',
    'Baby Shower',
    'Anniversary',
    'Graduation',
    'Conference',
    'Reunion',
    'Reception',
    'Concert',
    'Festival',
    'Other',
  ];
  
  /// The booking statuses
  static const List<String> bookingStatuses = [
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
    'Declined',
  ];
  
  /// The booking status colors
  static const Map<String, Color> bookingStatusColors = {
    'Pending': Color(0xFFFFC107),
    'Confirmed': Color(0xFF2196F3),
    'Completed': Color(0xFF4CAF50),
    'Cancelled': Color(0xFFB00020),
    'Declined': Color(0xFF9E9E9E),
  };
}