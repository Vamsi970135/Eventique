import 'package:flutter/material.dart';

/// A collection of utility methods for animations
class AnimationHelper {
  /// Creates a delayed animation that starts after a specified delay
  static Animation<double> createDelayedAnimation({
    required AnimationController controller,
    required double startPosition,
    required double endPosition,
    required double delay,
    Curve curve = Curves.easeOut,
  }) {
    return Tween<double>(begin: startPosition, end: endPosition).animate(
      CurvedAnimation(
        parent: controller,
        curve: Interval(
          delay,
          1.0,
          curve: curve,
        ),
      ),
    );
  }

  /// Creates a sequence of animations that run one after another
  static Animation<double> createSequencedAnimation({
    required AnimationController controller,
    required List<double> values,
    required List<double> intervals,
    Curve curve = Curves.easeOut,
  }) {
    assert(values.length == intervals.length + 1, 
      'Values must have exactly one more element than intervals');
    
    final TweenSequence<double> sequence = TweenSequence<double>(
      List.generate(intervals.length, (i) {
        return TweenSequenceItem<double>(
          tween: Tween<double>(
            begin: values[i],
            end: values[i + 1],
          ).chain(CurveTween(curve: curve)),
          weight: intervals[i] * 100,
        );
      }),
    );
    
    return sequence.animate(controller);
  }

  /// Creates a spring animation with bounce effect
  static Animation<double> createSpringAnimation({
    required AnimationController controller,
    required double startValue,
    required double endValue,
  }) {
    return SpringSimulation(
      const SpringDescription(
        mass: 1.0,
        stiffness: 500.0,
        damping: 20.0,
      ),
      startValue,
      endValue,
      1.0,
    ).animate(controller);
  }

  /// Creates a repeating pulse animation
  static Animation<double> createPulseAnimation({
    required AnimationController controller,
    double minValue = 0.8,
    double maxValue = 1.2,
  }) {
    return TweenSequence<double>([
      TweenSequenceItem<double>(
        tween: Tween<double>(begin: 1.0, end: maxValue)
          .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 1.0,
      ),
      TweenSequenceItem<double>(
        tween: Tween<double>(begin: maxValue, end: minValue)
          .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 1.0,
      ),
      TweenSequenceItem<double>(
        tween: Tween<double>(begin: minValue, end: 1.0)
          .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 1.0,
      ),
    ]).animate(controller);
  }

  /// Creates a staggered animation sequence for multiple child widgets
  static List<Animation<double>> createStaggeredAnimations({
    required AnimationController controller,
    required int itemCount,
    double initialDelay = 0.0,
    double staggerDelay = 0.05,
    Curve curve = Curves.easeOut,
  }) {
    final animations = <Animation<double>>[];
    
    for (int i = 0; i < itemCount; i++) {
      final delay = initialDelay + (i * staggerDelay);
      animations.add(
        Tween<double>(begin: 0.0, end: 1.0).animate(
          CurvedAnimation(
            parent: controller,
            curve: Interval(
              delay.clamp(0.0, 0.9),
              (delay + 0.1).clamp(0.1, 1.0),
              curve: curve,
            ),
          ),
        ),
      );
    }
    
    return animations;
  }

  /// Example method to apply a staggered fade-in and slide-up animation to a list of widgets
  static List<Widget> applyStaggeredFadeSlideAnimation({
    required List<Widget> children,
    required AnimationController controller,
    double initialDelay = 0.0,
    double staggerDelay = 0.05,
    double slideOffset = 50.0,
    Curve curve = Curves.easeOut,
  }) {
    final animations = createStaggeredAnimations(
      controller: controller,
      itemCount: children.length,
      initialDelay: initialDelay,
      staggerDelay: staggerDelay,
      curve: curve,
    );
    
    return List.generate(children.length, (index) {
      return AnimatedBuilder(
        animation: controller,
        builder: (context, child) {
          return Opacity(
            opacity: animations[index].value,
            child: Transform.translate(
              offset: Offset(0, slideOffset * (1 - animations[index].value)),
              child: child,
            ),
          );
        },
        child: children[index],
      );
    });
  }

  /// Creates an animation for a shimmering loading effect
  static Animation<LinearGradient> createShimmerAnimation({
    required AnimationController controller,
    required Color baseColor,
    required Color highlightColor,
  }) {
    return LinearGradientTween(
      begin: LinearGradient(
        colors: [
          baseColor,
          highlightColor,
          baseColor,
        ],
        stops: const [0.0, 0.5, 1.0],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ),
      end: LinearGradient(
        colors: [
          baseColor,
          highlightColor,
          baseColor,
        ],
        stops: const [0.0, 0.5, 1.0],
        begin: Alignment.centerRight,
        end: Alignment.centerLeft,
      ),
    ).animate(controller);
  }
}

/// Custom tween for linear gradients
class LinearGradientTween extends Tween<LinearGradient> {
  LinearGradientTween({required LinearGradient begin, required LinearGradient end})
      : super(begin: begin, end: end);

  @override
  LinearGradient lerp(double t) {
    return LinearGradient.lerp(begin, end, t)!;
  }
}