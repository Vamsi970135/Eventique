import 'dart:io';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import 'local_notification_service.dart';

/// Background message handler
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Handling a background message: ${message.messageId}');
}

/// Service for handling push notifications
class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final LocalNotificationService _localNotificationService = LocalNotificationService();
  
  /// Initialize the notification service
  Future<void> initialize() async {
    await _localNotificationService.initialize();
    
    // Set up background message handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
    
    // Request permission
    await _requestPermission();
    
    // Handle foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    
    // Handle notification open
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationOpen);
    
    // Check for initial notification
    await _checkInitialNotification();
  }
  
  Future<void> _requestPermission() async {
    NotificationSettings settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      announcement: false,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
    );
    
    print('User granted permission: ${settings.authorizationStatus}');
  }
  
  void _handleForegroundMessage(RemoteMessage message) {
    print('Got a message whilst in the foreground!');
    print('Message data: ${message.data}');
    
    if (message.notification != null) {
      print('Message also contained a notification: ${message.notification}');
      
      _localNotificationService.showNotification(
        id: message.hashCode,
        title: message.notification!.title ?? 'New notification',
        body: message.notification!.body ?? '',
        payload: message.data.toString(),
      );
    }
  }
  
  void _handleNotificationOpen(RemoteMessage message) {
    print('Notification opened: ${message.data}');
    
    // Navigate to the appropriate screen based on the notification
    if (message.data.containsKey('type')) {
      String type = message.data['type'];
      
      switch (type) {
        case 'booking':
          // Navigate to booking details
          if (message.data.containsKey('bookingId')) {
            // TODO: Navigate to booking details
          }
          break;
        case 'message':
          // Navigate to message
          if (message.data.containsKey('conversationId')) {
            // TODO: Navigate to message
          }
          break;
        case 'promotion':
          // Navigate to promotion
          if (message.data.containsKey('promotionId')) {
            // TODO: Navigate to promotion
          }
          break;
      }
    }
  }
  
  Future<void> _checkInitialNotification() async {
    // Get any messages which caused the application to open from
    // a terminated state.
    RemoteMessage? initialMessage = await _messaging.getInitialMessage();
    
    if (initialMessage != null) {
      _handleNotificationOpen(initialMessage);
    }
  }
  
  /// Subscribe to a topic
  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
  }
  
  /// Unsubscribe from a topic
  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
  }
  
  /// Get the FCM token
  Future<String?> getToken() async {
    return await _messaging.getToken();
  }
  
  /// Delete the FCM token
  Future<void> deleteToken() async {
    await _messaging.deleteToken();
  }
}