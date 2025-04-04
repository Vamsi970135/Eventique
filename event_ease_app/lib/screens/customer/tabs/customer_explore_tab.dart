import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../providers/auth_provider.dart';
import '../../../utils/app_constants.dart';

/// Explore tab for customer users
class CustomerExploreTab extends StatefulWidget {
  /// Constructor
  const CustomerExploreTab({Key? key}) : super(key: key);

  @override
  _CustomerExploreTabState createState() => _CustomerExploreTabState();
}

class _CustomerExploreTabState extends State<CustomerExploreTab> {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // TODO: Navigate to notifications
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.home,
              size: 100,
              color: AppConstants.primaryColor.withOpacity(0.5),
            ),
            const SizedBox(height: 24),
            const Text(
              'Explore Screen',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome, ${user?.fullName ?? 'User'}!',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                // TODO: Navigate to categories
              },
              child: const Text('Explore Categories'),
            ),
          ],
        ),
      ),
    );
  }
}