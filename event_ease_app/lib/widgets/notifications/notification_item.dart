import 'package:flutter/material.dart';
import '../../models/notification.dart';

class NotificationItem extends StatelessWidget {
  final AppNotification notification;
  final VoidCallback onTap;
  final VoidCallback onMarkAsRead;
  final VoidCallback onDelete;

  const NotificationItem({
    Key? key,
    required this.notification,
    required this.onTap,
    required this.onMarkAsRead,
    required this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(notification.id),
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) {
        onDelete();
      },
      child: Material(
        color: notification.isRead ? null : Colors.blue.shade50,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildIcon(),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              notification.title,
                              style: TextStyle(
                                fontWeight: notification.isRead ? FontWeight.normal : FontWeight.bold,
                                fontSize: 16,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Text(
                            notification.getRelativeTime(),
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notification.body,
                        style: TextStyle(
                          color: Colors.grey.shade700,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (!notification.isRead)
                            TextButton(
                              onPressed: onMarkAsRead,
                              child: const Text('Mark as read'),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                minimumSize: const Size(0, 30),
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                            ),
                          TextButton(
                            onPressed: onDelete,
                            child: const Text('Delete'),
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              minimumSize: const Size(0, 30),
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              primary: Colors.red,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildIcon() {
    switch (notification.type) {
      case 'booking':
        final status = notification.data?['bookingStatus'] as String?;
        
        if (status == 'confirmed') {
          return CircleAvatar(
            backgroundColor: Colors.green.shade100,
            child: Icon(Icons.check_circle, color: Colors.green.shade800),
          );
        } else if (status == 'cancelled') {
          return CircleAvatar(
            backgroundColor: Colors.red.shade100,
            child: Icon(Icons.cancel, color: Colors.red.shade800),
          );
        } else if (status == 'completed') {
          return CircleAvatar(
            backgroundColor: Colors.blue.shade100,
            child: Icon(Icons.task_alt, color: Colors.blue.shade800),
          );
        } else if (status == 'pending_payment' || status == 'payment_failed' || status == 'payment_completed') {
          return CircleAvatar(
            backgroundColor: Colors.orange.shade100,
            child: Icon(Icons.payment, color: Colors.orange.shade800),
          );
        } else {
          return CircleAvatar(
            backgroundColor: Colors.purple.shade100,
            child: Icon(Icons.event, color: Colors.purple.shade800),
          );
        }
        
      case 'payment':
        return CircleAvatar(
          backgroundColor: Colors.green.shade100,
          child: Icon(Icons.attach_money, color: Colors.green.shade800),
        );
        
      case 'message':
        return CircleAvatar(
          backgroundColor: Colors.blue.shade100,
          child: Icon(Icons.message, color: Colors.blue.shade800),
        );
        
      case 'system':
        return CircleAvatar(
          backgroundColor: Colors.grey.shade200,
          child: Icon(Icons.info, color: Colors.grey.shade800),
        );
        
      default:
        return CircleAvatar(
          backgroundColor: Colors.grey.shade200,
          child: const Icon(Icons.notifications),
        );
    }
  }
}