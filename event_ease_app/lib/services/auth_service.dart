import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/app_user.dart';

class AuthService extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  
  AppUser? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;
  
  // Getters
  AppUser? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  // Constructor
  AuthService() {
    _init();
  }
  
  // Initialize auth status
  Future<void> _init() async {
    _setLoading(true);
    
    try {
      // Check if user is already logged in
      final user = _auth.currentUser;
      
      if (user != null) {
        // Get user data from Firestore
        final userData = await _getUserData(user.uid);
        if (userData != null) {
          _currentUser = userData;
        }
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }
  
  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    return _auth.currentUser != null;
  }
  
  // Get current user
  Future<AppUser?> getCurrentUser() async {
    if (_currentUser != null) {
      return _currentUser;
    }
    
    final user = _auth.currentUser;
    if (user != null) {
      return _getUserData(user.uid);
    }
    
    return null;
  }
  
  // Register with email and password
  Future<AppUser?> register({
    required String email,
    required String password,
    required String username,
    required String userType,
    String? businessName,
    String? businessCategory,
  }) async {
    _setLoading(true);
    _setError(null);
    
    try {
      // Create user in Firebase Auth
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      if (userCredential.user != null) {
        // Create user record in Firestore
        final user = AppUser(
          id: userCredential.user!.uid,
          email: email,
          username: username,
          userType: userType,
          createdAt: DateTime.now(),
          businessName: businessName,
          businessCategory: businessCategory,
        );
        
        await _firestore.collection('users').doc(user.id).set(user.toMap());
        
        _currentUser = user;
        notifyListeners();
        
        return user;
      }
    } on FirebaseAuthException catch (e) {
      String message;
      switch (e.code) {
        case 'email-already-in-use':
          message = 'This email is already registered';
          break;
        case 'weak-password':
          message = 'Password is too weak';
          break;
        case 'invalid-email':
          message = 'Invalid email address';
          break;
        default:
          message = e.message ?? 'Registration failed';
      }
      _setError(message);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    
    return null;
  }
  
  // Login with email and password
  Future<AppUser?> login({
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _setError(null);
    
    try {
      // Sign in with Firebase Auth
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      if (userCredential.user != null) {
        // Get user data from Firestore
        final user = await _getUserData(userCredential.user!.uid);
        
        if (user != null) {
          _currentUser = user;
          notifyListeners();
          return user;
        }
      }
    } on FirebaseAuthException catch (e) {
      String message;
      switch (e.code) {
        case 'user-not-found':
          message = 'No user found with this email';
          break;
        case 'wrong-password':
          message = 'Wrong password';
          break;
        case 'invalid-email':
          message = 'Invalid email address';
          break;
        case 'user-disabled':
          message = 'This account has been disabled';
          break;
        default:
          message = e.message ?? 'Login failed';
      }
      _setError(message);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    
    return null;
  }
  
  // Sign in with Google
  Future<AppUser?> signInWithGoogle({required String userType}) async {
    _setLoading(true);
    _setError(null);
    
    try {
      // Sign in with Google
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      
      if (googleUser == null) {
        // User canceled the sign-in flow
        _setLoading(false);
        return null;
      }
      
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      
      final userCredential = await _auth.signInWithCredential(credential);
      
      if (userCredential.user != null) {
        // Check if user already exists in Firestore
        final existingUser = await _getUserData(userCredential.user!.uid);
        
        if (existingUser != null) {
          _currentUser = existingUser;
          notifyListeners();
          return existingUser;
        } else {
          // Create new user record
          final newUser = AppUser(
            id: userCredential.user!.uid,
            email: userCredential.user!.email!,
            username: userCredential.user!.displayName ?? 'User',
            userType: userType,
            profileImage: userCredential.user!.photoURL,
            createdAt: DateTime.now(),
          );
          
          await _firestore.collection('users').doc(newUser.id).set(newUser.toMap());
          
          _currentUser = newUser;
          notifyListeners();
          return newUser;
        }
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    
    return null;
  }
  
  // Logout
  Future<void> logout() async {
    _setLoading(true);
    
    try {
      await _auth.signOut();
      await _googleSignIn.signOut();
      
      _currentUser = null;
      notifyListeners();
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }
  
  // Update user profile
  Future<AppUser?> updateUserProfile({
    required String userId,
    String? username,
    String? phoneNumber,
    String? address,
    String? city,
    String? state,
    String? zipCode,
    String? profileImage,
    String? businessName,
    String? businessDescription,
    String? businessCategory,
  }) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final userRef = _firestore.collection('users').doc(userId);
      
      final updates = <String, dynamic>{};
      
      if (username != null) updates['username'] = username;
      if (phoneNumber != null) updates['phoneNumber'] = phoneNumber;
      if (address != null) updates['address'] = address;
      if (city != null) updates['city'] = city;
      if (state != null) updates['state'] = state;
      if (zipCode != null) updates['zipCode'] = zipCode;
      if (profileImage != null) updates['profileImage'] = profileImage;
      if (businessName != null) updates['businessName'] = businessName;
      if (businessDescription != null) updates['businessDescription'] = businessDescription;
      if (businessCategory != null) updates['businessCategory'] = businessCategory;
      
      await userRef.update(updates);
      
      // Get updated user data
      final updatedUser = await _getUserData(userId);
      
      if (updatedUser != null) {
        _currentUser = updatedUser;
        notifyListeners();
        return updatedUser;
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    
    return null;
  }
  
  // Reset password
  Future<bool> resetPassword(String email) async {
    _setLoading(true);
    _setError(null);
    
    try {
      await _auth.sendPasswordResetEmail(email: email);
      return true;
    } on FirebaseAuthException catch (e) {
      _setError(e.message ?? 'Failed to send password reset email');
      return false;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Private helper methods
  Future<AppUser?> _getUserData(String userId) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();
      
      if (doc.exists && doc.data() != null) {
        return AppUser.fromMap({...doc.data()!, 'id': doc.id});
      }
    } catch (e) {
      print('Error getting user data: $e');
    }
    
    return null;
  }
  
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }
}