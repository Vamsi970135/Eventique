import 'package:flutter/material.dart';

/// Custom route transitions for the app
class CustomRouteTransitions {
  /// Create a slide transition route
  static Route<T> slideTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 300),
    Offset startOffset = const Offset(1.0, 0.0),
  }) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        var tween = Tween(begin: startOffset, end: Offset.zero)
            .chain(CurveTween(curve: Curves.easeInOut));
        
        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
    );
  }
  
  /// Create a fade transition route
  static Route<T> fadeTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 300),
  }) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: animation,
          child: child,
        );
      },
    );
  }
  
  /// Create a scale transition route
  static Route<T> scaleTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 300),
    Alignment alignment = Alignment.center,
  }) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return ScaleTransition(
          scale: animation,
          alignment: alignment,
          child: child,
        );
      },
    );
  }
  
  /// Create a slide fade transition route
  static Route<T> slideFadeTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 300),
    Offset startOffset = const Offset(0.0, 0.2),
  }) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        var slideTween = Tween(begin: startOffset, end: Offset.zero)
            .chain(CurveTween(curve: Curves.easeOut));
        var fadeTween = Tween(begin: 0.0, end: 1.0)
            .chain(CurveTween(curve: Curves.easeOut));
        
        return FadeTransition(
          opacity: animation.drive(fadeTween),
          child: SlideTransition(
            position: animation.drive(slideTween),
            child: child,
          ),
        );
      },
    );
  }
  
  /// Create a rotation transition route
  static Route<T> rotationTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 500),
    double startAngle = 0.5,
  }) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        var slideTween = Tween(begin: const Offset(0.0, 1.0), end: Offset.zero)
            .chain(CurveTween(curve: Curves.easeInOut));
        var rotateTween = Tween(begin: startAngle, end: 0.0)
            .chain(CurveTween(curve: Curves.easeOut));
        var fadeTween = Tween(begin: 0.0, end: 1.0)
            .chain(CurveTween(curve: Curves.easeOut));
        
        return FadeTransition(
          opacity: animation.drive(fadeTween),
          child: SlideTransition(
            position: animation.drive(slideTween),
            child: RotationTransition(
              turns: animation.drive(rotateTween),
              child: child,
            ),
          ),
        );
      },
    );
  }
  
  /// Create a zoom transition route (like iOS modal)
  static Route<T> zoomTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 400),
  }) {
    return PageRouteBuilder<T>(
      fullscreenDialog: true,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        var curve = Curves.easeInOut;
        var curveTween = CurveTween(curve: curve);
        
        var fadeTween = Tween(begin: 0.0, end: 1.0).chain(curveTween);
        var scaleTween = Tween(begin: 0.85, end: 1.0).chain(curveTween);
        
        return FadeTransition(
          opacity: animation.drive(fadeTween),
          child: ScaleTransition(
            scale: animation.drive(scaleTween),
            child: child,
          ),
        );
      },
    );
  }
  
  /// Create a custom bottom sheet transition
  static Route<T> bottomSheetTransition<T>(Widget page, {
    Duration duration = const Duration(milliseconds: 400),
    Color barrierColor = Colors.black54,
  }) {
    return PageRouteBuilder<T>(
      opaque: false,
      barrierColor: barrierColor,
      barrierDismissible: true,
      fullscreenDialog: true,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        var curve = Curves.easeOut;
        var curveTween = CurveTween(curve: curve);
        
        var offsetTween = Tween(begin: const Offset(0.0, 1.0), end: Offset.zero)
            .chain(curveTween);
        
        return Stack(
          children: [
            FadeTransition(
              opacity: animation,
              child: Container(color: barrierColor),
            ),
            SlideTransition(
              position: animation.drive(offsetTween),
              child: child,
            ),
          ],
        );
      },
    );
  }
  
  /// Create a shared axis transition (from Material Motion)
  static Route<T> sharedAxisTransition<T>(
    Widget page, {
    Duration duration = const Duration(milliseconds: 300),
    SharedAxisTransitionType type = SharedAxisTransitionType.horizontal,
  }) {
    Offset getBeginOffset() {
      switch (type) {
        case SharedAxisTransitionType.horizontal:
          return const Offset(1.0, 0.0);
        case SharedAxisTransitionType.vertical:
          return const Offset(0.0, 1.0);
        case SharedAxisTransitionType.scaled:
          return Offset.zero; // For scaled, we'll use scale instead
      }
    }
    
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        var fadeTween = Tween(begin: 0.0, end: 1.0)
            .chain(CurveTween(curve: Curves.easeOut));
        
        Widget transitionChild = FadeTransition(
          opacity: animation.drive(fadeTween),
          child: child,
        );
        
        if (type == SharedAxisTransitionType.scaled) {
          var scaleTween = Tween(begin: 0.8, end: 1.0)
              .chain(CurveTween(curve: Curves.easeOut));
              
          return ScaleTransition(
            scale: animation.drive(scaleTween),
            child: transitionChild,
          );
        } else {
          var offsetTween = Tween(begin: getBeginOffset(), end: Offset.zero)
              .chain(CurveTween(curve: Curves.easeOut));
              
          return SlideTransition(
            position: animation.drive(offsetTween),
            child: transitionChild,
          );
        }
      },
    );
  }
  
  /// Create a hero transition route for a specific hero tag
  static Route<T> heroTransition<T>(Widget page, String heroTag) {
    return MaterialPageRoute<T>(
      builder: (context) => page,
    );
  }
}

/// Enum for shared axis transition types
enum SharedAxisTransitionType {
  /// Horizontal transition (x-axis)
  horizontal,
  
  /// Vertical transition (y-axis)
  vertical,
  
  /// Scaled transition (z-axis)
  scaled,
}