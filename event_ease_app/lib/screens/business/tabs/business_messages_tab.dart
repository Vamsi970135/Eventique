import 'package:flutter/material.dart';

import '../../../utils/app_constants.dart';

/// Messages tab for business users
class BusinessMessagesTab extends StatefulWidget {
  /// Constructor
  const BusinessMessagesTab({Key? key}) : super(key: key);

  @override
  _BusinessMessagesTabState createState() => _BusinessMessagesTabState();
}

class _BusinessMessagesTabState extends State<BusinessMessagesTab> {
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
          ],
        ),
      ),
    );
  }
}