import 'package:flutter/material.dart';

import '../utils/app_constants.dart';

/// A card widget with hover animation
class AnimatedCard extends StatefulWidget {
  /// The child widget
  final Widget child;
  
  /// Card border radius
  final double borderRadius;
  
  /// Card elevation
  final double elevation;
  
  /// Animation duration
  final Duration duration;
  
  /// Card color
  final Color? color;
  
  /// Hover scale factor
  final double hoverScale;
  
  /// On tap callback
  final VoidCallback? onTap;

  /// Constructor
  const AnimatedCard({
    Key? key,
    required this.child,
    this.borderRadius = AppConstants.borderRadius,
    this.elevation = AppConstants.cardElevation,
    this.duration = AppConstants.animationDuration,
    this.color,
    this.hoverScale = 1.03,
    this.onTap,
  }) : super(key: key);

  @override
  _AnimatedCardState createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: widget.duration,
          curve: Curves.easeInOut,
          transform: Matrix4.identity()..scale(_isHovered ? widget.hoverScale : 1.0),
          decoration: BoxDecoration(
            color: widget.color ?? Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(widget.borderRadius),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(_isHovered ? 0.15 : 0.1),
                blurRadius: _isHovered ? widget.elevation * 2 : widget.elevation,
                spreadRadius: _isHovered ? 2 : 1,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(widget.borderRadius),
            child: widget.child,
          ),
        ),
      ),
    );
  }
}