import 'package:flutter/material.dart';

import 'app_constants.dart';

/// Class containing form validation methods
class FormValidators {
  /// Validate email address
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    
    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }
  
  /// Validate password
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    
    if (value.length < AppConstants.minPasswordLength) {
      return 'Password must be at least ${AppConstants.minPasswordLength} characters';
    }
    
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!value.contains(RegExp(r'[a-z]'))) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain at least one number';
    }
    
    if (!value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
      return 'Password must contain at least one special character';
    }
    
    return null;
  }
  
  /// Validate confirm password
  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    
    if (value != password) {
      return 'Passwords do not match';
    }
    
    return null;
  }
  
  /// Validate full name
  static String? validateFullName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Full name is required';
    }
    
    if (value.length < 3) {
      return 'Full name must be at least 3 characters';
    }
    
    if (value.length > 50) {
      return 'Full name must be less than 50 characters';
    }
    
    if (!value.contains(' ')) {
      return 'Please enter your first and last name';
    }
    
    return null;
  }
  
  /// Validate phone number
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Phone is optional
    }
    
    final phoneRegex = RegExp(r'^\+?[0-9]{10,15}$');
    
    if (!phoneRegex.hasMatch(value)) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  }
  
  /// Validate required field
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required';
    }
    
    return null;
  }
  
  /// Validate text length
  static String? validateLength(String? value, String fieldName, int minLength, int maxLength) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required';
    }
    
    if (value.length < minLength) {
      return '$fieldName must be at least $minLength characters';
    }
    
    if (value.length > maxLength) {
      return '$fieldName must be less than $maxLength characters';
    }
    
    return null;
  }
  
  /// Validate amount
  static String? validateAmount(String? value, {double min = 0, double? max}) {
    if (value == null || value.isEmpty) {
      return 'Amount is required';
    }
    
    final amountRegex = RegExp(r'^\d+(\.\d{1,2})?$');
    
    if (!amountRegex.hasMatch(value)) {
      return 'Please enter a valid amount';
    }
    
    final amount = double.tryParse(value);
    
    if (amount == null) {
      return 'Please enter a valid amount';
    }
    
    if (amount < min) {
      return 'Amount must be at least ${AppConstants.currencySymbol}$min';
    }
    
    if (max != null && amount > max) {
      return 'Amount must be less than ${AppConstants.currencySymbol}$max';
    }
    
    return null;
  }
  
  /// Validate date
  static String? validateDate(DateTime? date, {DateTime? minDate, DateTime? maxDate}) {
    if (date == null) {
      return 'Date is required';
    }
    
    if (minDate != null && date.isBefore(minDate)) {
      return 'Date must be after ${_formatDate(minDate)}';
    }
    
    if (maxDate != null && date.isAfter(maxDate)) {
      return 'Date must be before ${_formatDate(maxDate)}';
    }
    
    return null;
  }
  
  /// Validate time
  static String? validateTime(TimeOfDay? time, {TimeOfDay? minTime, TimeOfDay? maxTime}) {
    if (time == null) {
      return 'Time is required';
    }
    
    if (minTime != null) {
      if (time.hour < minTime.hour ||
          (time.hour == minTime.hour && time.minute < minTime.minute)) {
        return 'Time must be after ${_formatTime(minTime)}';
      }
    }
    
    if (maxTime != null) {
      if (time.hour > maxTime.hour ||
          (time.hour == maxTime.hour && time.minute > maxTime.minute)) {
        return 'Time must be before ${_formatTime(maxTime)}';
      }
    }
    
    return null;
  }
  
  /// Helper method to format date
  static String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
  
  /// Helper method to format time
  static String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final minute = time.minute.toString().padLeft(2, '0');
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    
    return '$hour:$minute $period';
  }
}