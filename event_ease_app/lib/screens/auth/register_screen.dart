import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/app_user.dart';
import '../../providers/auth_provider.dart';
import '../../utils/app_constants.dart';

/// The register screen
class RegisterScreen extends StatefulWidget {
  /// Constructor
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  String? _errorMessage;
  bool _isLoading = false;
  
  // Default user type
  UserType _userType = UserType.customer;
  
  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
  
  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.register(
        email: _emailController.text.trim(),
        password: _passwordController.text,
        firstName: _firstNameController.text.trim(),
        lastName: _lastNameController.text.trim(),
        phoneNumber: _phoneController.text.trim(),
        userType: _userType,
      );
      
      // Navigate back to login or automatically logs in
      if (mounted) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Account'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth > 600) {
              // Tablet/desktop layout (horizontal)
              return _buildHorizontalLayout();
            } else {
              // Phone layout (vertical)
              return _buildVerticalLayout();
            }
          },
        ),
      ),
    );
  }
  
  Widget _buildVerticalLayout() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppConstants.largePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 16),
          _buildUserTypeToggle(),
          const SizedBox(height: 24),
          _buildRegisterForm(),
        ],
      ),
    );
  }
  
  Widget _buildHorizontalLayout() {
    return Row(
      children: [
        // Left side (form)
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.largePadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 16),
                _buildUserTypeToggle(),
                const SizedBox(height: 24),
                _buildRegisterForm(),
              ],
            ),
          ),
        ),
        
        // Right side (illustration)
        Expanded(
          child: Container(
            decoration: const BoxDecoration(
              color: AppConstants.primaryColor,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppConstants.primaryColor, AppConstants.secondaryColor],
              ),
            ),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.extraLargePadding),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Join Event Ease',
                      style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 36,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _userType == UserType.customer
                          ? 'Find and book the perfect service providers for your events'
                          : 'Showcase your services and grow your event business',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 48),
                    if (_userType == UserType.customer) ...[
                      _buildFeatureItem(Icons.search, 'Search for event services'),
                      _buildFeatureItem(Icons.star, 'Read verified reviews'),
                      _buildFeatureItem(Icons.calendar_today, 'Book and manage appointments'),
                      _buildFeatureItem(Icons.chat, 'Message service providers directly'),
                      _buildFeatureItem(Icons.payment, 'Secure payment process'),
                    ] else ...[
                      _buildFeatureItem(Icons.storefront, 'Create your business profile'),
                      _buildFeatureItem(Icons.event_available, 'List your services and packages'),
                      _buildFeatureItem(Icons.people, 'Reach more potential clients'),
                      _buildFeatureItem(Icons.schedule, 'Manage your bookings'),
                      _buildFeatureItem(Icons.insights, 'Track performance and analytics'),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
  
  Widget _buildFeatureItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Icon(
            icon,
            color: Colors.white,
            size: 24,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              text,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildUserTypeToggle() {
    return Card(
      elevation: 0,
      color: Colors.grey[100],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.largeRadius),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.smallPadding),
        child: Row(
          children: [
            Expanded(
              child: _buildUserTypeButton(
                title: 'Customer',
                isSelected: _userType == UserType.customer,
                onTap: () => setState(() => _userType = UserType.customer),
                icon: Icons.person,
              ),
            ),
            Expanded(
              child: _buildUserTypeButton(
                title: 'Business',
                isSelected: _userType == UserType.business,
                onTap: () => setState(() => _userType = UserType.business),
                icon: Icons.business,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildUserTypeButton({
    required String title,
    required bool isSelected,
    required VoidCallback onTap,
    required IconData icon,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? AppConstants.primaryColor : Colors.transparent,
          borderRadius: BorderRadius.circular(AppConstants.mediumRadius),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : Colors.grey[600],
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey[600],
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildRegisterForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Error message
          if (_errorMessage != null) ...[
            Container(
              padding: const EdgeInsets.all(AppConstants.mediumPadding),
              decoration: BoxDecoration(
                color: AppConstants.errorColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppConstants.mediumRadius),
              ),
              child: Text(
                _errorMessage!,
                style: TextStyle(
                  color: AppConstants.errorColor,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
          
          // Name fields (row for wide screens)
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth > 500) {
                return Row(
                  children: [
                    Expanded(child: _buildFirstNameField()),
                    const SizedBox(width: 16),
                    Expanded(child: _buildLastNameField()),
                  ],
                );
              } else {
                return Column(
                  children: [
                    _buildFirstNameField(),
                    const SizedBox(height: 16),
                    _buildLastNameField(),
                  ],
                );
              }
            },
          ),
          
          const SizedBox(height: 16),
          
          // Email field
          TextFormField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: AppConstants.inputDecoration.copyWith(
              labelText: 'Email',
              hintText: 'Enter your email',
              prefixIcon: const Icon(Icons.email_outlined),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              if (!value.contains('@') || !value.contains('.')) {
                return 'Please enter a valid email';
              }
              return null;
            },
          ),
          
          const SizedBox(height: 16),
          
          // Phone field
          TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: AppConstants.inputDecoration.copyWith(
              labelText: 'Phone Number',
              hintText: 'Enter your phone number',
              prefixIcon: const Icon(Icons.phone_outlined),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your phone number';
              }
              return null;
            },
          ),
          
          const SizedBox(height: 16),
          
          // Password field
          TextFormField(
            controller: _passwordController,
            obscureText: _obscurePassword,
            decoration: AppConstants.inputDecoration.copyWith(
              labelText: 'Password',
              hintText: 'Create a password',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                ),
                onPressed: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a password';
              }
              if (value.length < 6) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
          ),
          
          const SizedBox(height: 16),
          
          // Confirm password field
          TextFormField(
            controller: _confirmPasswordController,
            obscureText: _obscureConfirmPassword,
            decoration: AppConstants.inputDecoration.copyWith(
              labelText: 'Confirm Password',
              hintText: 'Confirm your password',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscureConfirmPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                ),
                onPressed: () {
                  setState(() {
                    _obscureConfirmPassword = !_obscureConfirmPassword;
                  });
                },
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please confirm your password';
              }
              if (value != _passwordController.text) {
                return 'Passwords do not match';
              }
              return null;
            },
          ),
          
          const SizedBox(height: 32),
          
          // Register button
          ElevatedButton(
            onPressed: _isLoading ? null : _register,
            style: AppConstants.primaryButtonStyle,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : Text(_userType == UserType.customer ? 'Create Customer Account' : 'Create Business Account'),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Terms and conditions
          Text(
            'By creating an account, you agree to our Terms of Service and Privacy Policy.',
            style: AppConstants.captionStyle,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildFirstNameField() {
    return TextFormField(
      controller: _firstNameController,
      textCapitalization: TextCapitalization.words,
      decoration: AppConstants.inputDecoration.copyWith(
        labelText: 'First Name',
        hintText: 'Enter your first name',
        prefixIcon: const Icon(Icons.person_outline),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your first name';
        }
        return null;
      },
    );
  }
  
  Widget _buildLastNameField() {
    return TextFormField(
      controller: _lastNameController,
      textCapitalization: TextCapitalization.words,
      decoration: AppConstants.inputDecoration.copyWith(
        labelText: 'Last Name',
        hintText: 'Enter your last name',
        prefixIcon: const Icon(Icons.person_outline),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your last name';
        }
        return null;
      },
    );
  }
}