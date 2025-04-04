import 'package:flutter/material.dart';

import '../../../utils/app_constants.dart';

/// Messages tab for customer users
class CustomerMessagesTab extends StatefulWidget {
  /// Constructor
  const CustomerMessagesTab({Key? key}) : super(key: key);

  @override
  _CustomerMessagesTabState createState() => _CustomerMessagesTabState();
}

class _CustomerMessagesTabState extends State<CustomerMessagesTab> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble,
              size: 100,
              color: AppConstants.primaryColor.withOpacity(0.5),
            ),
            const SizedBox(height: 24),
            const Text(
              'Messages Screen',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No messages yet',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                // TODO: Navigate to explore
              },
              child: const Text('Book a Service'),
            ),
          ],
        ),
      ),
    );
  }
}