import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../models/app_user.dart';
import '../services/notification_service.dart';

/// The authentication provider
class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final NotificationService _notificationService = NotificationService();
  
  AppUser? _user;
  bool _isLoading = false;
  String? _error;
  
  /// Get the current user
  AppUser? get user => _user;
  
  /// Check if authentication is in progress
  bool get isLoading => _isLoading;
  
  /// Get the current error message
  String? get error => _error;
  
  /// Constructor
  AuthProvider() {
    _initAuth();
  }
  
  Future<void> _initAuth() async {
    _isLoading = true;
    notifyListeners();
    
    // Listen for auth state changes
    _auth.authStateChanges().listen((User? firebaseUser) async {
      if (firebaseUser == null) {
        _user = null;
        _isLoading = false;
        notifyListeners();
        return;
      }
      
      try {
        // Get user data from Firestore
        final doc = await _firestore
            .collection('users')
            .doc(firebaseUser.uid)
            .get();
        
        if (doc.exists) {
          _user = AppUser.fromDocument(doc);
          
          // Update FCM token
          _updateFcmToken();
        } else {
          _user = null;
        }
      } catch (e) {
        _error = e.toString();
        _user = null;
      } finally {
        _isLoading = false;
        notifyListeners();
      }
    });
  }
  
  /// Register a new user
  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phoneNumber,
    required UserType userType,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      // Create user in Firebase Auth
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      final user = credential.user;
      
      if (user != null) {
        // Get FCM token for push notifications
        final fcmToken = await _notificationService.getToken();
        
        // Create timestamp
        final timestamp = DateTime.now();
        
        // Create user data
        final userData = AppUser(
          id: user.uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          userType: userType,
          fcmToken: fcmToken,
          createdAt: timestamp,
          updatedAt: timestamp,
        );
        
        // Save user data to Firestore
        await _firestore
            .collection('users')
            .doc(user.uid)
            .set(userData.toJson());
        
        _user = userData;
      }
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Login with email and password
  Future<void> login({required String email, required String password}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Logout
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _auth.signOut();
      _user = null;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Reset password
  Future<void> resetPassword({required String email}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Update user profile
  Future<void> updateProfile({
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? photoUrl,
    String? address,
    String? city,
    String? state,
    String? zipCode,
  }) async {
    if (_user == null) return;
    
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      // Create updated user
      final updatedUser = _user!.copyWith(
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        photoUrl: photoUrl,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        updatedAt: DateTime.now(),
      );
      
      // Update user in Firestore
      await _firestore
          .collection('users')
          .doc(_user!.id)
          .update(updatedUser.toJson());
      
      // Update local user
      _user = updatedUser;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Update FCM token
  Future<void> _updateFcmToken() async {
    if (_user == null) return;
    
    try {
      // Get FCM token
      final fcmToken = await _notificationService.getToken();
      
      // Update token if different
      if (fcmToken != null && fcmToken != _user!.fcmToken) {
        await _firestore
            .collection('users')
            .doc(_user!.id)
            .update({'fcmToken': fcmToken});
        
        // Update local user
        _user = _user!.copyWith(fcmToken: fcmToken);
        notifyListeners();
      }
    } catch (e) {
      print('Error updating FCM token: $e');
    }
  }
}