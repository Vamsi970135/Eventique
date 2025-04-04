import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;

class AppNotification {
  final String id;
  final String userId;
  final String title;
  final String body;
  final String type; // 'booking', 'payment', 'message', 'system'
  final bool isRead;
  final DateTime timestamp;
  final String? actionLink;
  final String? bookingId;
  final String? senderId;
  final Map<String, dynamic>? data;

  AppNotification({
    required this.id,
    required this.userId,
    required this.title,
    required this.body,
    required this.type,
    required this.isRead,
    required this.timestamp,
    this.actionLink,
    this.bookingId,
    this.senderId,
    this.data,
  });

  AppNotification copyWith({
    String? id,
    String? userId,
    String? title,
    String? body,
    String? type,
    bool? isRead,
    DateTime? timestamp,
    String? actionLink,
    String? bookingId,
    String? senderId,
    Map<String, dynamic>? data,
  }) {
    return AppNotification(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      body: body ?? this.body,
      type: type ?? this.type,
      isRead: isRead ?? this.isRead,
      timestamp: timestamp ?? this.timestamp,
      actionLink: actionLink ?? this.actionLink,
      bookingId: bookingId ?? this.bookingId,
      senderId: senderId ?? this.senderId,
      data: data ?? this.data,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'title': title,
      'body': body,
      'type': type,
      'isRead': isRead,
      'timestamp': Timestamp.fromDate(timestamp),
      'actionLink': actionLink,
      'bookingId': bookingId,
      'senderId': senderId,
      'data': data ?? {},
    };
  }

  factory AppNotification.fromMap(String id, Map<String, dynamic> map) {
    return AppNotification(
      id: id,
      userId: map['userId'] ?? '',
      title: map['title'] ?? '',
      body: map['body'] ?? '',
      type: map['type'] ?? 'system',
      isRead: map['isRead'] ?? false,
      timestamp: (map['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
      actionLink: map['actionLink'] as String?,
      bookingId: map['bookingId'] as String?,
      senderId: map['senderId'] as String?,
      data: map['data'] as Map<String, dynamic>?,
    );
  }

  factory AppNotification.fromFirestore(DocumentSnapshot doc) {
    return AppNotification.fromMap(doc.id, doc.data() as Map<String, dynamic>);
  }

  String getFormattedDate() {
    return DateFormat.yMMMd().format(timestamp);
  }

  String getFormattedTime() {
    return DateFormat.jm().format(timestamp);
  }

  String getRelativeTime() {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inDays > 7) {
      return DateFormat.yMMMd().format(timestamp);
    } else {
      return timeago.format(timestamp, locale: 'en_short');
    }
  }
}

class FCMNotification {
  final String title;
  final String body;
  final String? imageUrl;
  final Map<String, dynamic> data;

  FCMNotification({
    required this.title,
    required this.body,
    this.imageUrl,
    required this.data,
  });

  Map<String, dynamic> toMap() {
    return {
      'notification': {
        'title': title,
        'body': body,
        'image': imageUrl,
      },
      'data': data,
    };
  }
}