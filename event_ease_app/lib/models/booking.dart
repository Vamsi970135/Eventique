import 'package:cloud_firestore/cloud_firestore.dart';

class Booking {
  final String id;
  final String customerId;
  final String serviceProviderId;
  final DateTime eventDate;
  final TimeOfDay? startTime;
  final TimeOfDay? endTime;
  final String eventType;
  final String status; // pending, confirmed, completed, cancelled
  final double amount;
  final String? paymentId;
  final String? paymentStatus;
  final String? location;
  final int guestCount;
  final String? notes;
  final DateTime createdAt;
  final DateTime? updatedAt;
  
  Booking({
    required this.id,
    required this.customerId,
    required this.serviceProviderId,
    required this.eventDate,
    this.startTime,
    this.endTime,
    required this.eventType,
    required this.status,
    required this.amount,
    this.paymentId,
    this.paymentStatus,
    this.location,
    required this.guestCount,
    this.notes,
    required this.createdAt,
    this.updatedAt,
  });
  
  factory Booking.fromFirestore(Map<String, dynamic> data, String id) {
    return Booking(
      id: id,
      customerId: data['customerId'] ?? '',
      serviceProviderId: data['serviceProviderId'] ?? '',
      eventDate: (data['eventDate'] as Timestamp).toDate(),
      startTime: data['startTime'] != null 
          ? TimeOfDay(hour: data['startTime']['hour'], minute: data['startTime']['minute']) 
          : null,
      endTime: data['endTime'] != null 
          ? TimeOfDay(hour: data['endTime']['hour'], minute: data['endTime']['minute']) 
          : null,
      eventType: data['eventType'] ?? '',
      status: data['status'] ?? 'pending',
      amount: data['amount'] ?? 0.0,
      paymentId: data['paymentId'],
      paymentStatus: data['paymentStatus'],
      location: data['location'],
      guestCount: data['guestCount'] ?? 0,
      notes: data['notes'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: data['updatedAt'] != null 
          ? (data['updatedAt'] as Timestamp).toDate() 
          : null,
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'customerId': customerId,
      'serviceProviderId': serviceProviderId,
      'eventDate': Timestamp.fromDate(eventDate),
      'startTime': startTime != null 
          ? {'hour': startTime!.hour, 'minute': startTime!.minute} 
          : null,
      'endTime': endTime != null 
          ? {'hour': endTime!.hour, 'minute': endTime!.minute} 
          : null,
      'eventType': eventType,
      'status': status,
      'amount': amount,
      'paymentId': paymentId,
      'paymentStatus': paymentStatus,
      'location': location,
      'guestCount': guestCount,
      'notes': notes,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }
  
  Booking copyWith({
    String? id,
    String? customerId,
    String? serviceProviderId,
    DateTime? eventDate,
    TimeOfDay? startTime,
    TimeOfDay? endTime,
    String? eventType,
    String? status,
    double? amount,
    String? paymentId,
    String? paymentStatus,
    String? location,
    int? guestCount,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Booking(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      serviceProviderId: serviceProviderId ?? this.serviceProviderId,
      eventDate: eventDate ?? this.eventDate,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      eventType: eventType ?? this.eventType,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      paymentId: paymentId ?? this.paymentId,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      location: location ?? this.location,
      guestCount: guestCount ?? this.guestCount,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

// Helper class for TimeOfDay
class TimeOfDay {
  final int hour;
  final int minute;
  
  const TimeOfDay({required this.hour, required this.minute});
  
  String format(context) {
    final h = hour % 12 == 0 ? 12 : hour % 12;
    final suffix = hour >= 12 ? 'PM' : 'AM';
    return '$h:${minute.toString().padLeft(2, '0')} $suffix';
  }
}