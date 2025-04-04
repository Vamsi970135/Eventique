import 'package:cloud_firestore/cloud_firestore.dart';

/// The service provider model
class ServiceProvider {
  /// The service provider ID (same as user ID)
  final String id;
  
  /// The business name
  final String businessName;
  
  /// The business description
  final String description;
  
  /// The business logo URL
  final String? logoUrl;
  
  /// The business website URL
  final String? websiteUrl;
  
  /// The business cover image URL
  final String? coverImageUrl;
  
  /// The business category
  final String category;
  
  /// The business subcategory
  final String subcategory;
  
  /// The business's average rating
  final double rating;
  
  /// The number of reviews
  final int reviewCount;
  
  /// If the business is verified
  final bool isVerified;
  
  /// If the business is featured
  final bool isFeatured;
  
  /// The business's services
  final List<String> services;
  
  /// The business's event types
  final List<String> eventTypes;
  
  /// The business's years of experience
  final int yearsOfExperience;
  
  /// The business's starting price
  final double startingPrice;
  
  /// The business's operating hours
  final Map<String, OperatingHours> operatingHours;
  
  /// The business's location (latitude)
  final double? latitude;
  
  /// The business's location (longitude)
  final double? longitude;
  
  /// The business's creation timestamp
  final DateTime createdAt;
  
  /// The business's last update timestamp
  final DateTime updatedAt;
  
  /// Constructor
  ServiceProvider({
    required this.id,
    required this.businessName,
    required this.description,
    this.logoUrl,
    this.websiteUrl,
    this.coverImageUrl,
    required this.category,
    required this.subcategory,
    required this.rating,
    required this.reviewCount,
    required this.isVerified,
    required this.isFeatured,
    required this.services,
    required this.eventTypes,
    required this.yearsOfExperience,
    required this.startingPrice,
    required this.operatingHours,
    this.latitude,
    this.longitude,
    required this.createdAt,
    required this.updatedAt,
  });
  
  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'businessName': businessName,
      'description': description,
      'logoUrl': logoUrl,
      'websiteUrl': websiteUrl,
      'coverImageUrl': coverImageUrl,
      'category': category,
      'subcategory': subcategory,
      'rating': rating,
      'reviewCount': reviewCount,
      'isVerified': isVerified,
      'isFeatured': isFeatured,
      'services': services,
      'eventTypes': eventTypes,
      'yearsOfExperience': yearsOfExperience,
      'startingPrice': startingPrice,
      'operatingHours': operatingHours.map((key, value) => MapEntry(key, value.toJson())),
      'latitude': latitude,
      'longitude': longitude,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
  
  /// Create from JSON
  factory ServiceProvider.fromJson(Map<String, dynamic> json) {
    return ServiceProvider(
      id: json['id'],
      businessName: json['businessName'],
      description: json['description'],
      logoUrl: json['logoUrl'],
      websiteUrl: json['websiteUrl'],
      coverImageUrl: json['coverImageUrl'],
      category: json['category'],
      subcategory: json['subcategory'],
      rating: json['rating'].toDouble(),
      reviewCount: json['reviewCount'],
      isVerified: json['isVerified'],
      isFeatured: json['isFeatured'],
      services: List<String>.from(json['services']),
      eventTypes: List<String>.from(json['eventTypes']),
      yearsOfExperience: json['yearsOfExperience'],
      startingPrice: json['startingPrice'].toDouble(),
      operatingHours: (json['operatingHours'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(key, OperatingHours.fromJson(value)),
      ),
      latitude: json['latitude'],
      longitude: json['longitude'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
  
  /// Create from Firebase document
  factory ServiceProvider.fromDocument(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    
    return ServiceProvider(
      id: doc.id,
      businessName: data['businessName'],
      description: data['description'],
      logoUrl: data['logoUrl'],
      websiteUrl: data['websiteUrl'],
      coverImageUrl: data['coverImageUrl'],
      category: data['category'],
      subcategory: data['subcategory'],
      rating: data['rating'].toDouble(),
      reviewCount: data['reviewCount'],
      isVerified: data['isVerified'],
      isFeatured: data['isFeatured'],
      services: List<String>.from(data['services']),
      eventTypes: List<String>.from(data['eventTypes']),
      yearsOfExperience: data['yearsOfExperience'],
      startingPrice: data['startingPrice'].toDouble(),
      operatingHours: (data['operatingHours'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(key, OperatingHours.fromJson(value)),
      ),
      latitude: data['latitude'],
      longitude: data['longitude'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
    );
  }
  
  /// Create a copy with updated fields
  ServiceProvider copyWith({
    String? id,
    String? businessName,
    String? description,
    String? logoUrl,
    String? websiteUrl,
    String? coverImageUrl,
    String? category,
    String? subcategory,
    double? rating,
    int? reviewCount,
    bool? isVerified,
    bool? isFeatured,
    List<String>? services,
    List<String>? eventTypes,
    int? yearsOfExperience,
    double? startingPrice,
    Map<String, OperatingHours>? operatingHours,
    double? latitude,
    double? longitude,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ServiceProvider(
      id: id ?? this.id,
      businessName: businessName ?? this.businessName,
      description: description ?? this.description,
      logoUrl: logoUrl ?? this.logoUrl,
      websiteUrl: websiteUrl ?? this.websiteUrl,
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      category: category ?? this.category,
      subcategory: subcategory ?? this.subcategory,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      isVerified: isVerified ?? this.isVerified,
      isFeatured: isFeatured ?? this.isFeatured,
      services: services ?? this.services,
      eventTypes: eventTypes ?? this.eventTypes,
      yearsOfExperience: yearsOfExperience ?? this.yearsOfExperience,
      startingPrice: startingPrice ?? this.startingPrice,
      operatingHours: operatingHours ?? this.operatingHours,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

/// The operating hours model
class OperatingHours {
  /// If the business is open on this day
  final bool isOpen;
  
  /// The opening time
  final String openTime;
  
  /// The closing time
  final String closeTime;
  
  /// Constructor
  OperatingHours({
    required this.isOpen,
    required this.openTime,
    required this.closeTime,
  });
  
  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'isOpen': isOpen,
      'openTime': openTime,
      'closeTime': closeTime,
    };
  }
  
  /// Create from JSON
  factory OperatingHours.fromJson(Map<String, dynamic> json) {
    return OperatingHours(
      isOpen: json['isOpen'],
      openTime: json['openTime'],
      closeTime: json['closeTime'],
    );
  }
  
  /// Create a copy with updated fields
  OperatingHours copyWith({
    bool? isOpen,
    String? openTime,
    String? closeTime,
  }) {
    return OperatingHours(
      isOpen: isOpen ?? this.isOpen,
      openTime: openTime ?? this.openTime,
      closeTime: closeTime ?? this.closeTime,
    );
  }
}