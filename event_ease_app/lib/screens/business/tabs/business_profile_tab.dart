import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../providers/auth_provider.dart';
import '../../../utils/app_constants.dart';

/// Profile tab for business users
class BusinessProfileTab extends StatefulWidget {
  /// Constructor
  const BusinessProfileTab({Key? key}) : super(key: key);

  @override
  _BusinessProfileTabState createState() => _BusinessProfileTabState();
}

class _BusinessProfileTabState extends State<BusinessProfileTab> {
  Future<void> _logout() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.logout();
  }
  
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {
              // TODO: Navigate to settings
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile header
            Container(
              padding: const EdgeInsets.all(24.0),
              color: AppConstants.primaryColor.withOpacity(0.1),
              child: Column(
                children: [
                  // Profile image
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: AppConstants.primaryColor.withOpacity(0.2),
                    backgroundImage: user?.businessLogoUrl != null
                        ? NetworkImage(user!.businessLogoUrl!)
                        : null,
                    child: user?.businessLogoUrl == null
                        ? Icon(
                            Icons.business,
                            size: 50,
                            color: AppConstants.primaryColor,
                          )
                        : null,
                  ),
                  const SizedBox(height: 16),
                  
                  // Business name
                  Text(
                    user?.businessName ?? 'Business Name',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  
                  // Business email
                  Text(
                    user?.email ?? 'business@example.com',
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 8),
                  
                  // Business phone
                  Text(
                    user?.phone ?? '+1 (555) 123-4567',
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Edit profile button
                  OutlinedButton.icon(
                    onPressed: () {
                      // TODO: Navigate to edit profile
                    },
                    icon: const Icon(Icons.edit),
                    label: const Text('Edit Business Profile'),
                  ),
                ],
              ),
            ),
            
            // Business details
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Business Details',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Business description
                  _buildDetailItem(
                    icon: Icons.description_outlined,
                    title: 'Description',
                    value: user?.businessDescription ?? 'No description available',
                  ),
                  
                  // Business address
                  _buildDetailItem(
                    icon: Icons.location_on_outlined,
                    title: 'Address',
                    value: user?.address ?? 'No address available',
                  ),
                  
                  // Business category
                  _buildDetailItem(
                    icon: Icons.category_outlined,
                    title: 'Category',
                    value: user?.businessCategory ?? 'No category available',
                  ),
                  
                  // Business website
                  _buildDetailItem(
                    icon: Icons.link,
                    title: 'Website',
                    value: user?.website ?? 'No website available',
                  ),
                ],
              ),
            ),
            
            // Profile sections
            ListView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildListTile(
                  icon: Icons.credit_card,
                  title: 'Bank Account & Payments',
                  onTap: () {
                    // TODO: Navigate to payments
                  },
                ),
                _buildListTile(
                  icon: Icons.business_center,
                  title: 'Business Hours',
                  onTap: () {
                    // TODO: Navigate to business hours
                  },
                ),
                _buildListTile(
                  icon: Icons.notifications_outlined,
                  title: 'Notifications',
                  onTap: () {
                    // TODO: Navigate to notifications
                  },
                ),
                _buildListTile(
                  icon: Icons.help_outline,
                  title: 'Help & Support',
                  onTap: () {
                    // TODO: Navigate to help
                  },
                ),
                _buildListTile(
                  icon: Icons.privacy_tip_outlined,
                  title: 'Privacy Policy',
                  onTap: () {
                    // TODO: Navigate to privacy policy
                  },
                ),
                _buildListTile(
                  icon: Icons.description_outlined,
                  title: 'Terms of Service',
                  onTap: () {
                    // TODO: Navigate to terms
                  },
                ),
                _buildListTile(
                  icon: Icons.logout,
                  title: 'Logout',
                  textColor: Colors.red,
                  onTap: _logout,
                ),
              ],
            ),
            
            // App version
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'Version ${AppConstants.appVersion}',
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDetailItem({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.grey, size: 20),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildListTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Color? textColor,
  }) {
    return ListTile(
      leading: Icon(icon, color: textColor),
      title: Text(
        title,
        style: TextStyle(
          color: textColor,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}