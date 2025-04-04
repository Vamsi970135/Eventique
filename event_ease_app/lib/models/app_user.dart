import 'package:cloud_firestore/cloud_firestore.dart';

/// The user type
enum UserType {
  /// Customer
  customer,
  
  /// Business
  business,
}

/// The app user model
class AppUser {
  /// The user ID
  final String id;
  
  /// The user's email
  final String email;
  
  /// The user's first name
  final String firstName;
  
  /// The user's last name
  final String lastName;
  
  /// The user's phone number
  final String phoneNumber;
  
  /// The user's photo URL
  final String? photoUrl;
  
  /// The user's address
  final String? address;
  
  /// The user's city
  final String? city;
  
  /// The user's state
  final String? state;
  
  /// The user's zip code
  final String? zipCode;
  
  /// The user's type
  final UserType userType;
  
  /// The user's FCM token for push notifications
  final String? fcmToken;
  
  /// The user's creation timestamp
  final DateTime createdAt;
  
  /// The user's last update timestamp
  final DateTime updatedAt;
  
  /// Constructor
  AppUser({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    this.photoUrl,
    this.address,
    this.city,
    this.state,
    this.zipCode,
    required this.userType,
    this.fcmToken,
    required this.createdAt,
    required this.updatedAt,
  });
  
  /// Get the user's full name
  String get fullName => '$firstName $lastName';
  
  /// Get the user's initials
  String get initials {
    if (firstName.isEmpty && lastName.isEmpty) {
      return '';
    } else if (firstName.isEmpty) {
      return lastName[0];
    } else if (lastName.isEmpty) {
      return firstName[0];
    } else {
      return '${firstName[0]}${lastName[0]}';
    }
  }
  
  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'photoUrl': photoUrl,
      'address': address,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'userType': userType.index,
      'fcmToken': fcmToken,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
  
  /// Create from JSON
  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      phoneNumber: json['phoneNumber'],
      photoUrl: json['photoUrl'],
      address: json['address'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zipCode'],
      userType: UserType.values[json['userType']],
      fcmToken: json['fcmToken'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
  
  /// Create from Firebase document
  factory AppUser.fromDocument(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    
    return AppUser(
      id: doc.id,
      email: data['email'],
      firstName: data['firstName'],
      lastName: data['lastName'],
      phoneNumber: data['phoneNumber'],
      photoUrl: data['photoUrl'],
      address: data['address'],
      city: data['city'],
      state: data['state'],
      zipCode: data['zipCode'],
      userType: UserType.values[data['userType']],
      fcmToken: data['fcmToken'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
    );
  }
  
  /// Create a copy with updated fields
  AppUser copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? photoUrl,
    String? address,
    String? city,
    String? state,
    String? zipCode,
    UserType? userType,
    String? fcmToken,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AppUser(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      photoUrl: photoUrl ?? this.photoUrl,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      zipCode: zipCode ?? this.zipCode,
      userType: userType ?? this.userType,
      fcmToken: fcmToken ?? this.fcmToken,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}