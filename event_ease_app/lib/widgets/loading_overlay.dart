import 'package:flutter/material.dart';

import '../utils/app_constants.dart';

/// A widget that displays a loading overlay on top of its child
class LoadingOverlay extends StatelessWidget {
  /// The child to display
  final Widget child;
  
  /// Whether to show the loading indicator
  final bool isLoading;
  
  /// The color of the loading overlay
  final Color? color;
  
  /// The opacity of the loading overlay
  final double opacity;
  
  /// Constructor
  const LoadingOverlay({
    Key? key,
    required this.child,
    required this.isLoading,
    this.color,
    this.opacity = 0.5,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Positioned.fill(
            child: _buildLoadingIndicator(context),
          ),
      ],
    );
  }
  
  Widget _buildLoadingIndicator(BuildContext context) {
    return Container(
      color: (color ?? Colors.black).withOpacity(opacity),
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(
                  AppConstants.primaryColor,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Loading...',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}