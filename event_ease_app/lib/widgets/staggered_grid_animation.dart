import 'package:flutter/material.dart';

/// A widget that displays items in a staggered grid with entrance animations.
/// The animations are staggered, with each item appearing slightly after the previous one.
class StaggeredGridAnimation extends StatefulWidget {
  /// Total number of items in the grid
  final int itemCount;
  
  /// Function to build each item
  final Widget Function(BuildContext, int) itemBuilder;
  
  /// Number of columns in the grid
  final int crossAxisCount;
  
  /// Spacing between items horizontally
  final double crossAxisSpacing;
  
  /// Spacing between items vertically
  final double mainAxisSpacing;
  
  /// Stagger delay between item animations
  final Duration staggerDelay;
  
  /// Animation duration for each item
  final Duration animationDuration;
  
  /// Grid padding
  final EdgeInsetsGeometry padding;
  
  /// Animation enter direction
  final AxisDirection enterDirection;
  
  /// Whether to animate on first build
  final bool animate;

  const StaggeredGridAnimation({
    Key? key,
    required this.itemCount,
    required this.itemBuilder,
    this.crossAxisCount = 2,
    this.crossAxisSpacing = 10,
    this.mainAxisSpacing = 10,
    this.staggerDelay = const Duration(milliseconds: 50),
    this.animationDuration = const Duration(milliseconds: 400),
    this.padding = EdgeInsets.zero,
    this.enterDirection = AxisDirection.up,
    this.animate = true,
  }) : super(key: key);

  @override
  State<StaggeredGridAnimation> createState() => _StaggeredGridAnimationState();
}

class _StaggeredGridAnimationState extends State<StaggeredGridAnimation> {
  late List<bool> _visibleItems;

  @override
  void initState() {
    super.initState();
    _visibleItems = List<bool>.filled(widget.itemCount, !widget.animate);
    if (widget.animate) {
      _animateItems();
    }
  }

  @override
  void didUpdateWidget(StaggeredGridAnimation oldWidget) {
    super.didUpdateWidget(oldWidget);
    
    // Handle changes in item count
    if (widget.itemCount != oldWidget.itemCount) {
      final oldLength = _visibleItems.length;
      final newLength = widget.itemCount;
      
      if (newLength > oldLength) {
        // Add new items in hidden state
        _visibleItems.addAll(List<bool>.filled(newLength - oldLength, false));
        // Animate the new items in
        _animateNewItems(oldLength);
      } else {
        // Resize the list if items were removed
        _visibleItems = _visibleItems.sublist(0, newLength);
      }
    }
  }

  void _animateItems() {
    for (int i = 0; i < widget.itemCount; i++) {
      Future.delayed(widget.staggerDelay * i, () {
        if (mounted) {
          setState(() {
            if (i < _visibleItems.length) {
              _visibleItems[i] = true;
            }
          });
        }
      });
    }
  }

  void _animateNewItems(int startIndex) {
    for (int i = startIndex; i < widget.itemCount; i++) {
      Future.delayed(widget.staggerDelay * (i - startIndex), () {
        if (mounted) {
          setState(() {
            if (i < _visibleItems.length) {
              _visibleItems[i] = true;
            }
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: widget.padding,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: widget.crossAxisCount,
        crossAxisSpacing: widget.crossAxisSpacing,
        mainAxisSpacing: widget.mainAxisSpacing,
      ),
      itemCount: widget.itemCount,
      itemBuilder: (context, index) {
        return _buildAnimatedItem(context, index);
      },
    );
  }

  Widget _buildAnimatedItem(BuildContext context, int index) {
    // Default offset based on direction
    Offset startOffset;
    switch (widget.enterDirection) {
      case AxisDirection.up:
        startOffset = const Offset(0, 30);
        break;
      case AxisDirection.down:
        startOffset = const Offset(0, -30);
        break;
      case AxisDirection.right:
        startOffset = const Offset(-30, 0);
        break;
      case AxisDirection.left:
        startOffset = const Offset(30, 0);
        break;
    }

    return AnimatedOpacity(
      opacity: _visibleItems[index] ? 1.0 : 0.0,
      duration: widget.animationDuration,
      curve: Curves.easeOutCubic,
      child: AnimatedSlide(
        offset: _visibleItems[index] ? Offset.zero : startOffset / 100,
        duration: widget.animationDuration,
        curve: Curves.easeOutCubic,
        child: widget.itemBuilder(context, index),
      ),
    );
  }
}