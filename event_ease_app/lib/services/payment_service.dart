import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:stripe_payment/stripe_payment.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class PaymentService with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  bool _isLoading = false;
  String? _errorMessage;
  
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  // Initialize payment service
  Future<void> initialize() async {
    final stripePublishableKey = dotenv.env['STRIPE_PUBLISHABLE_KEY'];
    
    if (stripePublishableKey == null) {
      _setError('Stripe publishable key not found');
      return;
    }
    
    StripePayment.setOptions(
      StripeOptions(
        publishableKey: stripePublishableKey,
        merchantId: 'merchant.com.eventeaseapp',
        androidPayMode: 'test',
      ),
    );
  }
  
  // Create payment intent
  Future<Map<String, dynamic>?> createPaymentIntent(
    double amount, 
    String currency, 
    String customerId,
  ) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final stripeSecretKey = dotenv.env['STRIPE_SECRET_KEY'];
      
      if (stripeSecretKey == null) {
        _setError('Stripe secret key not found');
        return null;
      }
      
      final url = Uri.parse('https://api.stripe.com/v1/payment_intents');
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $stripeSecretKey',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          'amount': (amount * 100).round().toString(), // Convert to cents
          'currency': currency,
          'customer': customerId,
          'payment_method_types[]': 'card',
        },
      );
      
      if (response.statusCode != 200) {
        _setError('Failed to create payment intent: ${response.body}');
        return null;
      }
      
      return json.decode(response.body);
    } catch (e) {
      _setError('Error creating payment intent: $e');
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Process payment
  Future<bool> processPayment(Map<String, dynamic> paymentIntent, {bool useGooglePay = false}) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final clientSecret = paymentIntent['client_secret'];
      PaymentMethod? paymentMethod;
      
      if (useGooglePay) {
        paymentMethod = await _processWithGooglePay(paymentIntent['amount']);
      } else {
        paymentMethod = await _processWithCreditCard();
      }
      
      if (paymentMethod == null) {
        return false;
      }
      
      final paymentResult = await StripePayment.confirmPaymentIntent(
        PaymentIntent(
          clientSecret: clientSecret,
          paymentMethodId: paymentMethod.id,
        ),
      );
      
      if (paymentResult.status == 'succeeded') {
        return true;
      } else {
        _setError('Payment failed: ${paymentResult.status}');
        return false;
      }
    } catch (e) {
      _setError('Error processing payment: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Process with credit card
  Future<PaymentMethod?> _processWithCreditCard() async {
    try {
      final paymentMethod = await StripePayment.paymentRequestWithCardForm(
        CardFormPaymentRequest(),
      );
      
      return paymentMethod;
    } catch (e) {
      _setError('Error with card form: $e');
      return null;
    }
  }
  
  // Process with Google Pay
  Future<PaymentMethod?> _processWithGooglePay(int amount) async {
    try {
      final paymentMethod = await StripePayment.paymentRequestWithNativePay(
        androidPayOptions: AndroidPayPaymentRequest(
          totalPrice: (amount / 100).toStringAsFixed(2),
          currencyCode: 'USD',
        ),
        applePayOptions: null,
      );
      
      return paymentMethod;
    } catch (e) {
      _setError('Error with Google Pay: $e');
      return null;
    }
  }
  
  // Create customer in Stripe
  Future<String?> createCustomer(String email, String name) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final stripeSecretKey = dotenv.env['STRIPE_SECRET_KEY'];
      
      if (stripeSecretKey == null) {
        _setError('Stripe secret key not found');
        return null;
      }
      
      final url = Uri.parse('https://api.stripe.com/v1/customers');
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $stripeSecretKey',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          'email': email,
          'name': name,
        },
      );
      
      if (response.statusCode != 200) {
        _setError('Failed to create customer: ${response.body}');
        return null;
      }
      
      final data = json.decode(response.body);
      return data['id'];
    } catch (e) {
      _setError('Error creating customer: $e');
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Store payment details in Firestore
  Future<bool> storePaymentDetails({
    required String bookingId,
    required String paymentId,
    required String paymentStatus,
    required double amount,
    String? customerId,
    String? paymentMethod,
  }) async {
    try {
      await _firestore.collection('payments').doc(paymentId).set({
        'bookingId': bookingId,
        'status': paymentStatus,
        'amount': amount,
        'customerId': customerId,
        'paymentMethod': paymentMethod,
        'timestamp': FieldValue.serverTimestamp(),
      });
      
      // Update booking with payment details
      await _firestore.collection('bookings').doc(bookingId).update({
        'paymentId': paymentId,
        'paymentStatus': paymentStatus,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      
      return true;
    } catch (e) {
      _setError('Error storing payment details: $e');
      return false;
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