import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/app_user.dart';
import '../../providers/auth_provider.dart';
import '../business/business_home_screen.dart';
import '../customer/customer_home_screen.dart';
import 'login_screen.dart';

/// The authentication wrapper that determines which screen to show
/// based on the user's authentication state
class AuthWrapper extends StatelessWidget {
  /// Constructor
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    
    // Show loading indicator if auth is being initialized
    if (authProvider.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    // Check if user is logged in
    final user = authProvider.user;
    
    if (user == null) {
      return const LoginScreen();
    } else {
      // Navigate to the appropriate home screen based on user type
      switch (user.userType) {
        case UserType.customer:
          return const CustomerHomeScreen();
        case UserType.business:
          return const BusinessHomeScreen();
        default:
          return const LoginScreen();
      }
    }
  }
}