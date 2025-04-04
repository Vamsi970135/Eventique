import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_stripe/flutter_stripe.dart';

import '../../models/booking.dart';
import '../../models/service_provider.dart';
import '../../services/payment_service.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({Key? key}) : super(key: key);

  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  PaymentMethod _selectedPaymentMethod = PaymentMethod.card;
  bool _isProcessing = false;
  String? _errorMessage;
  
  @override
  Widget build(BuildContext context) {
    // Get booking details from route arguments
    final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    final Booking booking = args['booking'];
    final ServiceProvider serviceProvider = args['serviceProvider'];
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
        elevation: 0,
      ),
      body: Consumer<PaymentService>(
        builder: (context, paymentService, child) {
          // Get available payment methods
          final availablePaymentMethods = paymentService.getAvailablePaymentMethods(
            serviceProvider.acceptedPaymentMethods
          );
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildBookingDetails(booking),
                const SizedBox(height: 24),
                _buildPaymentMethodSelector(availablePaymentMethods, paymentService),
                const SizedBox(height: 24),
                _buildCardForm(),
                const SizedBox(height: 32),
                _buildPaymentButton(booking, paymentService),
                
                if (_errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 16.0),
                    child: Text(
                      _errorMessage!,
                      style: TextStyle(color: Colors.red[700], fontSize: 14),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
  
  Widget _buildBookingDetails(Booking booking) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Booking Summary',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(),
            _buildDetailRow('Event Date', _formatDate(booking.eventDate)),
            _buildDetailRow('Event Type', booking.eventType),
            _buildDetailRow('Guests', booking.guestCount.toString()),
            if (booking.location != null)
              _buildDetailRow('Location', booking.location!),
            const Divider(),
            _buildDetailRow(
              'Total Amount',
              '\$${booking.totalAmount.toStringAsFixed(2)}',
              isTotal: true,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDetailRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 16 : 14,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: isTotal ? Theme.of(context).primaryColor : Colors.black87,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: isTotal ? 18 : 14,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
              color: isTotal ? Theme.of(context).primaryColor : Colors.black,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildPaymentMethodSelector(
    List<PaymentMethod> availableMethods,
    PaymentService paymentService,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Payment Method',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            children: availableMethods.map((method) {
              return RadioListTile<PaymentMethod>(
                title: Row(
                  children: [
                    Icon(paymentService.getPaymentMethodIcon(method)),
                    const SizedBox(width: 12),
                    Text(paymentService.getPaymentMethodName(method)),
                  ],
                ),
                value: method,
                groupValue: _selectedPaymentMethod,
                onChanged: (value) {
                  setState(() {
                    _selectedPaymentMethod = value!;
                  });
                },
                activeColor: Theme.of(context).primaryColor,
                dense: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
  
  Widget _buildCardForm() {
    // Only show card form if card is selected
    if (_selectedPaymentMethod != PaymentMethod.card) {
      return const SizedBox.shrink();
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        Text(
          'Card Details',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 12),
        CardField(
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(8)),
            ),
            labelText: 'Card Details',
          ),
        ),
      ],
    );
  }
  
  Widget _buildPaymentButton(Booking booking, PaymentService paymentService) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isProcessing
            ? null
            : () => _processPayment(booking, paymentService),
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: _isProcessing
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  ),
                  SizedBox(width: 12),
                  Text('Processing...'),
                ],
              )
            : const Text('Pay Now'),
      ),
    );
  }
  
  Future<void> _processPayment(Booking booking, PaymentService paymentService) async {
    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });
    
    late PaymentResult result;
    
    try {
      switch (_selectedPaymentMethod) {
        case PaymentMethod.card:
          result = await paymentService.processCardPayment(
            amount: booking.totalAmount,
            currency: 'usd',
            customerId: booking.customerId,
            description: 'Booking for ${booking.eventType} on ${_formatDate(booking.eventDate)}',
          );
          break;
        case PaymentMethod.googlePay:
          result = await paymentService.processGooglePay(
            amount: booking.totalAmount,
            currency: 'usd',
            description: 'Booking for ${booking.eventType} on ${_formatDate(booking.eventDate)}',
          );
          break;
        default:
          // Simulate payment for other methods
          result = await paymentService.simulatePayment(
            method: _selectedPaymentMethod,
            amount: booking.totalAmount,
            description: 'Booking for ${booking.eventType} on ${_formatDate(booking.eventDate)}',
          );
      }
      
      if (result.success) {
        // Navigate to success screen
        Navigator.pushReplacementNamed(
          context,
          '/payment-success',
          arguments: {
            'booking': booking,
            'paymentResult': result,
          },
        );
      } else {
        setState(() {
          _errorMessage = result.errorMessage ?? 'Payment failed. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }
  
  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}