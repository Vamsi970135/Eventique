import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'dart:io';

import '../models/service_provider.dart';
import '../models/booking.dart';
import '../models/app_user.dart';

class FirebaseService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  
  bool _isLoading = false;
  String? _errorMessage;
  
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  // Service provider methods
  Future<List<ServiceProvider>> getServiceProviders({String? category, String? eventType}) async {
    _setLoading(true);
    _setError(null);
    
    try {
      Query query = _firestore.collection('serviceProviders');
      
      if (category != null) {
        query = query.where('category', isEqualTo: category);
      }
      
      if (eventType != null) {
        query = query.where('eventTypes', arrayContains: eventType);
      }
      
      final snapshot = await query.get();
      
      return snapshot.docs
          .map((doc) => ServiceProvider.fromMap({...doc.data() as Map<String, dynamic>, 'id': doc.id}))
          .toList();
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  Future<ServiceProvider?> getServiceProviderById(String id) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final doc = await _firestore.collection('serviceProviders').doc(id).get();
      
      if (doc.exists) {
        return ServiceProvider.fromMap({...doc.data()!, 'id': doc.id});
      }
      
      return null;
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<List<ServiceProvider>> getFeaturedServiceProviders() async {
    _setLoading(true);
    _setError(null);
    
    try {
      final snapshot = await _firestore
          .collection('serviceProviders')
          .where('isFeatured', isEqualTo: true)
          .limit(5)
          .get();
      
      return snapshot.docs
          .map((doc) => ServiceProvider.fromMap({...doc.data() as Map<String, dynamic>, 'id': doc.id}))
          .toList();
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  Future<List<ServiceProvider>> getServiceProvidersByUserId(String userId) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final snapshot = await _firestore
          .collection('serviceProviders')
          .where('userId', isEqualTo: userId)
          .get();
      
      return snapshot.docs
          .map((doc) => ServiceProvider.fromMap({...doc.data() as Map<String, dynamic>, 'id': doc.id}))
          .toList();
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  Future<ServiceProvider?> createServiceProvider(ServiceProvider serviceProvider) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final docRef = await _firestore.collection('serviceProviders').add(serviceProvider.toMap());
      
      // Get the newly created service provider
      final doc = await docRef.get();
      
      return ServiceProvider.fromMap({...doc.data()!, 'id': doc.id});
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<ServiceProvider?> updateServiceProvider(String id, Map<String, dynamic> data) async {
    _setLoading(true);
    _setError(null);
    
    try {
      // Add updatedAt timestamp
      data['updatedAt'] = FieldValue.serverTimestamp();
      
      await _firestore.collection('serviceProviders').doc(id).update(data);
      
      // Get the updated service provider
      final doc = await _firestore.collection('serviceProviders').doc(id).get();
      
      return ServiceProvider.fromMap({...doc.data()!, 'id': doc.id});
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Booking methods
  Future<Booking?> createBooking(Booking booking) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final docRef = await _firestore.collection('bookings').add(booking.toMap());
      
      // Get the newly created booking
      final doc = await docRef.get();
      
      return Booking.fromMap({...doc.data()!, 'id': doc.id});
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<Booking?> updateBookingStatus(String id, String status) async {
    _setLoading(true);
    _setError(null);
    
    try {
      await _firestore.collection('bookings').doc(id).update({
        'status': status,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      
      // Get the updated booking
      final doc = await _firestore.collection('bookings').doc(id).get();
      
      return Booking.fromMap({...doc.data()!, 'id': doc.id});
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<Booking?> updateBookingPayment(
    String id, {
    required String paymentStatus,
    required String paymentMethod,
    String? paymentId,
    String? transactionId,
    String? receiptUrl,
  }) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final updates = {
        'paymentStatus': paymentStatus,
        'paymentMethod': paymentMethod,
        'paymentDate': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      };
      
      if (paymentId != null) updates['paymentId'] = paymentId;
      if (transactionId != null) updates['transactionId'] = transactionId;
      if (receiptUrl != null) updates['receiptUrl'] = receiptUrl;
      
      await _firestore.collection('bookings').doc(id).update(updates);
      
      // Get the updated booking
      final doc = await _firestore.collection('bookings').doc(id).get();
      
      return Booking.fromMap({...doc.data()!, 'id': doc.id});
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<List<Booking>> getBookingsByCustomerId(String customerId) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final snapshot = await _firestore
          .collection('bookings')
          .where('customerId', isEqualTo: customerId)
          .orderBy('createdAt', descending: true)
          .get();
      
      return snapshot.docs
          .map((doc) => Booking.fromMap({...doc.data() as Map<String, dynamic>, 'id': doc.id}))
          .toList();
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  Future<List<Booking>> getBookingsByServiceProviderId(String providerId) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final snapshot = await _firestore
          .collection('bookings')
          .where('serviceProviderId', isEqualTo: providerId)
          .orderBy('createdAt', descending: true)
          .get();
      
      return snapshot.docs
          .map((doc) => Booking.fromMap({...doc.data() as Map<String, dynamic>, 'id': doc.id}))
          .toList();
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  // Upload methods
  Future<String?> uploadImage(File imageFile, String path) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final ref = _storage.ref().child(path);
      final uploadTask = ref.putFile(imageFile);
      final snapshot = await uploadTask;
      
      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      _setError(e.toString());
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Category methods
  Future<List<String>> getCategories() async {
    _setLoading(true);
    _setError(null);
    
    try {
      final doc = await _firestore.collection('app').doc('categories').get();
      
      if (doc.exists && doc.data() != null) {
        return List<String>.from(doc.data()!['values'] as List<dynamic>);
      }
      
      return [];
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  // Event type methods
  Future<List<String>> getEventTypes() async {
    _setLoading(true);
    _setError(null);
    
    try {
      final doc = await _firestore.collection('app').doc('eventTypes').get();
      
      if (doc.exists && doc.data() != null) {
        return List<String>.from(doc.data()!['values'] as List<dynamic>);
      }
      
      return [];
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }
}