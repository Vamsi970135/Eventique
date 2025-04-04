import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/notification_service.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({Key? key}) : super(key: key);

  @override
  _NotificationSettingsScreenState createState() => _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Settings'),
      ),
      body: Consumer<NotificationService>(
        builder: (context, notificationService, child) {
          return ListView(
            children: [
              _buildGeneralSection(notificationService),
              const Divider(),
              _buildBookingNotificationsSection(),
              const Divider(),
              _buildMessagesNotificationsSection(),
              const Divider(),
              _buildPromotionalNotificationsSection(),
              const SizedBox(height: 16),
              _buildClearButton(notificationService),
            ],
          );
        },
      ),
    );
  }

  Widget _buildGeneralSection(NotificationService notificationService) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'General',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SwitchListTile(
          title: const Text('Enable Notifications'),
          subtitle: const Text('Receive notifications about your bookings and messages'),
          value: notificationService.isNotificationsEnabled,
          onChanged: (value) async {
            await notificationService.toggleNotifications(value);
          },
        ),
      ],
    );
  }

  Widget _buildBookingNotificationsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Booking Notifications',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SwitchListTile(
          title: const Text('Booking Confirmations'),
          subtitle: const Text('Receive notifications when your booking is confirmed'),
          value: true, // These values would be stored in user preferences
          onChanged: (value) {
            // Update user preferences
          },
        ),
        SwitchListTile(
          title: const Text('Booking Updates'),
          subtitle: const Text('Receive notifications when your booking status changes'),
          value: true,
          onChanged: (value) {
            // Update user preferences
          },
        ),
        SwitchListTile(
          title: const Text('Payment Reminders'),
          subtitle: const Text('Receive reminders about pending payments'),
          value: true,
          onChanged: (value) {
            // Update user preferences
          },
        ),
        SwitchListTile(
          title: const Text('Review Reminders'),
          subtitle: const Text('Receive reminders to leave reviews after completed bookings'),
          value: true,
          onChanged: (value) {
            // Update user preferences
          },
        ),
      ],
    );
  }

  Widget _buildMessagesNotificationsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Message Notifications',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SwitchListTile(
          title: const Text('New Messages'),
          subtitle: const Text('Receive notifications when you get a new message'),
          value: true,
          onChanged: (value) {
            // Update user preferences
          },
        ),
      ],
    );
  }

  Widget _buildPromotionalNotificationsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Promotional Notifications',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SwitchListTile(
          title: const Text('Promotions and Offers'),
          subtitle: const Text('Receive notifications about promotions and special offers'),
          value: false,
          onChanged: (value) {
            // Update user preferences
          },
        ),
        SwitchListTile(
          title: const Text('App Updates'),
          subtitle: const Text('Receive notifications about app updates and new features'),
          value: true,
          onChanged: (value) {
            // Update user preferences
          },
        ),
      ],
    );
  }

  Widget _buildClearButton(NotificationService notificationService) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ElevatedButton(
        onPressed: () {
          _showClearConfirmationDialog(notificationService);
        },
        style: ElevatedButton.styleFrom(
          primary: Colors.red.shade100,
          onPrimary: Colors.red.shade800,
        ),
        child: const Text('Clear All Notifications'),
      ),
    );
  }

  void _showClearConfirmationDialog(NotificationService notificationService) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Notifications'),
        content: const Text('Are you sure you want to clear all notifications? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              await notificationService.clearAllNotifications();
              
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('All notifications cleared'),
                ),
              );
            },
            child: const Text('Clear All'),
            style: TextButton.styleFrom(
              primary: Colors.red,
            ),
          ),
        ],
      ),
    );
  }
}