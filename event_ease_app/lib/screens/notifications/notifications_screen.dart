import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/notification_service.dart';
import '../../models/notification.dart';
import '../../widgets/notifications/notification_item.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  _NotificationsScreenState createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
    });

    final notificationService = Provider.of<NotificationService>(context, listen: false);
    await notificationService.fetchNotifications();

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/notification-settings');
            },
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    return Consumer<NotificationService>(
      builder: (context, notificationService, child) {
        if (_isLoading || notificationService.isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        final notifications = notificationService.notifications;

        if (notifications.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.notifications_off,
                  size: 64,
                  color: Colors.grey.shade400,
                ),
                const SizedBox(height: 16),
                Text(
                  'No notifications',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'You\'ll see notifications about your bookings here',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.shade600,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadNotifications,
          child: Column(
            children: [
              if (notificationService.unreadCount > 0)
                _buildMarkAllReadButton(notificationService),
              Expanded(
                child: ListView.separated(
                  itemCount: notifications.length,
                  separatorBuilder: (context, index) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final notification = notifications[index];
                    return NotificationItem(
                      notification: notification,
                      onTap: () => _handleNotificationTap(notification),
                      onMarkAsRead: () => _markAsRead(notification.id),
                      onDelete: () => _deleteNotification(notification.id),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMarkAllReadButton(NotificationService notificationService) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Text(
            '${notificationService.unreadCount} unread ${notificationService.unreadCount == 1 ? 'notification' : 'notifications'}',
            style: const TextStyle(
              color: Colors.grey,
            ),
          ),
          const Spacer(),
          TextButton(
            onPressed: _markAllAsRead,
            child: const Text('Mark all as read'),
          ),
        ],
      ),
    );
  }

  void _handleNotificationTap(AppNotification notification) async {
    // Mark as read
    if (!notification.isRead) {
      await _markAsRead(notification.id);
    }

    // Navigate to the appropriate screen
    if (notification.actionLink != null) {
      if (notification.actionLink == '/booking-detail' && notification.bookingId != null) {
        Navigator.pushNamed(
          context,
          notification.actionLink!,
          arguments: {'bookingId': notification.bookingId},
        );
      } else if (notification.actionLink == '/leave-review' && notification.bookingId != null) {
        Navigator.pushNamed(
          context,
          notification.actionLink!,
          arguments: {'bookingId': notification.bookingId},
        );
      } else if (notification.actionLink == '/payment' && notification.bookingId != null) {
        Navigator.pushNamed(
          context,
          notification.actionLink!,
          arguments: {'bookingId': notification.bookingId},
        );
      } else {
        Navigator.pushNamed(context, notification.actionLink!);
      }
    }
  }

  Future<void> _markAsRead(String notificationId) async {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    await notificationService.markAsRead(notificationId);
  }

  Future<void> _markAllAsRead() async {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    await notificationService.markAllAsRead();
  }

  Future<void> _deleteNotification(String notificationId) async {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    await notificationService.deleteNotification(notificationId);
  }
}