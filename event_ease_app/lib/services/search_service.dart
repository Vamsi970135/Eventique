import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/service_provider.dart';

class SearchResult {
  final String id;
  final String name;
  final String category;
  final String? imageUrl;
  final String type; // 'provider', 'category', 'eventType', etc.
  final double? rating;
  final String? location;

  SearchResult({
    required this.id,
    required this.name,
    required this.category,
    this.imageUrl,
    required this.type,
    this.rating,
    this.location,
  });
}

class SearchService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  bool _isLoading = false;
  String? _errorMessage;
  List<String> _recentSearches = [];
  final int _maxRecentSearches = 5;
  
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<String> get recentSearches => _recentSearches;
  
  // Constructor
  SearchService() {
    _loadRecentSearches();
  }
  
  // Load recent searches from SharedPreferences
  Future<void> _loadRecentSearches() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final searches = prefs.getStringList('recentSearches');
      if (searches != null) {
        _recentSearches = searches;
        notifyListeners();
      }
    } catch (e) {
      print('Error loading recent searches: $e');
    }
  }
  
  // Save recent searches to SharedPreferences
  Future<void> _saveRecentSearches() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('recentSearches', _recentSearches);
    } catch (e) {
      print('Error saving recent searches: $e');
    }
  }
  
  // Add a search to recent searches
  void addRecentSearch(String query) {
    if (query.isEmpty) return;
    
    // Remove if already exists (to move it to the top)
    _recentSearches.removeWhere((item) => item.toLowerCase() == query.toLowerCase());
    
    // Add to the beginning of the list
    _recentSearches.insert(0, query);
    
    // Limit the number of recent searches
    if (_recentSearches.length > _maxRecentSearches) {
      _recentSearches = _recentSearches.sublist(0, _maxRecentSearches);
    }
    
    _saveRecentSearches();
    notifyListeners();
  }
  
  // Clear recent searches
  Future<void> clearRecentSearches() async {
    _recentSearches.clear();
    await _saveRecentSearches();
    notifyListeners();
  }
  
  // Search service providers
  Future<List<SearchResult>> searchServiceProviders(String query) async {
    _setLoading(true);
    _setError(null);
    
    try {
      if (query.isEmpty) {
        return [];
      }
      
      // Add to recent searches
      addRecentSearch(query);
      
      // Convert query to lowercase for case-insensitive search
      final lowerQuery = query.toLowerCase();
      
      // Get all service providers
      final providerSnapshot = await _firestore.collection('serviceProviders').get();
      
      // Filter and map to SearchResult
      final providers = providerSnapshot.docs
          .where((doc) {
            final data = doc.data();
            final name = (data['name'] as String).toLowerCase();
            final description = (data['description'] as String).toLowerCase();
            final category = (data['category'] as String).toLowerCase();
            final tags = data['tags'] != null 
                ? List<String>.from(data['tags']).map((tag) => tag.toLowerCase()) 
                : <String>[];
            
            return name.contains(lowerQuery) || 
                  description.contains(lowerQuery) || 
                  category.contains(lowerQuery) ||
                  tags.any((tag) => tag.contains(lowerQuery));
          })
          .map((doc) {
            final data = doc.data();
            return SearchResult(
              id: doc.id,
              name: data['name'],
              category: data['category'],
              imageUrl: data['portfolioImages'] != null && (data['portfolioImages'] as List).isNotEmpty 
                  ? data['portfolioImages'][0] 
                  : null,
              type: 'provider',
              rating: data['rating']?.toDouble(),
              location: data['location'],
            );
          })
          .toList();
      
      // Get all categories that match
      final categorySnapshot = await _firestore.collection('app').doc('categories').get();
      List<SearchResult> categoryResults = [];
      
      if (categorySnapshot.exists && categorySnapshot.data() != null) {
        final categories = List<String>.from(categorySnapshot.data()!['values']);
        categoryResults = categories
            .where((category) => category.toLowerCase().contains(lowerQuery))
            .map((category) => SearchResult(
                  id: category,
                  name: category,
                  category: 'Category',
                  type: 'category',
                ))
            .toList();
      }
      
      // Get all event types that match
      final eventTypeSnapshot = await _firestore.collection('app').doc('eventTypes').get();
      List<SearchResult> eventTypeResults = [];
      
      if (eventTypeSnapshot.exists && eventTypeSnapshot.data() != null) {
        final eventTypes = List<String>.from(eventTypeSnapshot.data()!['values']);
        eventTypeResults = eventTypes
            .where((eventType) => eventType.toLowerCase().contains(lowerQuery))
            .map((eventType) => SearchResult(
                  id: eventType,
                  name: eventType,
                  category: 'Event Type',
                  type: 'eventType',
                ))
            .toList();
      }
      
      // Combine and sort results
      final results = [...providers, ...categoryResults, ...eventTypeResults];
      
      // Sort results by relevance (exact matches first)
      results.sort((a, b) {
        if (a.name.toLowerCase() == lowerQuery) return -1;
        if (b.name.toLowerCase() == lowerQuery) return 1;
        if (a.name.toLowerCase().startsWith(lowerQuery) && !b.name.toLowerCase().startsWith(lowerQuery)) return -1;
        if (!a.name.toLowerCase().startsWith(lowerQuery) && b.name.toLowerCase().startsWith(lowerQuery)) return 1;
        return 0;
      });
      
      return results;
    } catch (e) {
      _setError(e.toString());
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  // Get search suggestions based on query
  Future<List<String>> getSearchSuggestions(String query) async {
    if (query.isEmpty) {
      return _recentSearches.take(3).toList();
    }
    
    _setLoading(true);
    _setError(null);
    
    try {
      final lowerQuery = query.toLowerCase();
      
      // Get categories for suggestions
      final categorySnapshot = await _firestore.collection('app').doc('categories').get();
      List<String> categorySuggestions = [];
      
      if (categorySnapshot.exists && categorySnapshot.data() != null) {
        final categories = List<String>.from(categorySnapshot.data()!['values']);
        categorySuggestions = categories
            .where((category) => category.toLowerCase().contains(lowerQuery))
            .take(3)
            .toList();
      }
      
      // Get event types for suggestions
      final eventTypeSnapshot = await _firestore.collection('app').doc('eventTypes').get();
      List<String> eventTypeSuggestions = [];
      
      if (eventTypeSnapshot.exists && eventTypeSnapshot.data() != null) {
        final eventTypes = List<String>.from(eventTypeSnapshot.data()!['values']);
        eventTypeSuggestions = eventTypes
            .where((eventType) => eventType.toLowerCase().contains(lowerQuery))
            .take(3)
            .toList();
      }
      
      // Get popular service provider names
      final providerSnapshot = await _firestore
          .collection('serviceProviders')
          .orderBy('rating', descending: true)
          .limit(20)
          .get();
      
      final providerSuggestions = providerSnapshot.docs
          .where((doc) => doc.data()['name'].toLowerCase().contains(lowerQuery))
          .map((doc) => doc.data()['name'] as String)
          .take(5)
          .toList();
      
      // Filter recent searches
      final recentSuggestions = _recentSearches
          .where((recent) => recent.toLowerCase().contains(lowerQuery))
          .take(2)
          .toList();
      
      // Combine suggestions (removing duplicates)
      final allSuggestions = {
        ...recentSuggestions,
        ...providerSuggestions,
        ...categorySuggestions,
        ...eventTypeSuggestions,
      }.toList();
      
      // Sort by relevance
      allSuggestions.sort((a, b) {
        if (a.toLowerCase() == lowerQuery) return -1;
        if (b.toLowerCase() == lowerQuery) return 1;
        if (a.toLowerCase().startsWith(lowerQuery) && !b.toLowerCase().startsWith(lowerQuery)) return -1;
        if (!a.toLowerCase().startsWith(lowerQuery) && b.toLowerCase().startsWith(lowerQuery)) return 1;
        return 0;
      });
      
      return allSuggestions.take(7).toList();
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