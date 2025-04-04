import 'package:flutter/material.dart';

/// A card that displays a hero image with a gradient overlay
class HeroImageCard extends StatelessWidget {
  /// The hero tag for animation
  final String heroTag;
  
  /// The image URL
  final String imageUrl;
  
  /// The title to display over the image
  final String? title;
  
  /// The height of the card
  final double height;
  
  /// The border radius of the card
  final double borderRadius;
  
  /// Whether to show a gradient overlay on the image
  final bool showGradient;
  
  /// The gradient colors for the overlay
  final List<Color> gradientColors;
  
  /// The gradient stops for the overlay
  final List<double> gradientStops;
  
  /// The gradient begin alignment
  final Alignment gradientBegin;
  
  /// The gradient end alignment
  final Alignment gradientEnd;
  
  /// Additional child widget to display over the image
  final Widget? child;

  const HeroImageCard({
    Key? key,
    required this.heroTag,
    required this.imageUrl,
    this.title,
    this.height = 200,
    this.borderRadius = 12,
    this.showGradient = true,
    this.gradientColors = const [
      Colors.transparent,
      Colors.black54,
    ],
    this.gradientStops = const [0.4, 1.0],
    this.gradientBegin = Alignment.topCenter,
    this.gradientEnd = Alignment.bottomCenter,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Hero image
            Hero(
              tag: heroTag,
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
              ),
            ),
            
            // Gradient overlay
            if (showGradient)
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: gradientBegin,
                    end: gradientEnd,
                    colors: gradientColors,
                    stops: gradientStops,
                  ),
                ),
              ),
            
            // Title text
            if (title != null)
              Positioned(
                bottom: 16,
                left: 16,
                right: 16,
                child: Text(
                  title!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    shadows: [
                      Shadow(
                        color: Colors.black54,
                        offset: Offset(0, 2),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            
            // Additional child widget
            if (child != null)
              child!,
          ],
        ),
      ),
    );
  }
}