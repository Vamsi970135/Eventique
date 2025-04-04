import 'package:flutter/material.dart';
import 'event_card.dart';

/// A grid or list of event cards with staggered animation
class AnimatedEventList extends StatefulWidget {
  /// List of event data to display
  final List<Map<String, dynamic>> events;
  
  /// Number of columns in the grid (1 for list view)
  final int crossAxisCount;
  
  /// Height of each card
  final double cardHeight;
  
  /// Whether to animate the cards when they appear
  final bool animate;
  
  /// Callback when an event card is tapped
  final Function(String eventId)? onEventTap;
  
  /// Additional padding around the grid
  final EdgeInsets padding;
  
  /// Spacing between items in the grid
  final double spacing;
  
  /// Base duration for the staggered animation
  final Duration baseDuration;
  
  /// Stagger duration between each card's animation
  final Duration staggerDuration;
  
  /// Animation curve
  final Curve curve;

  const AnimatedEventList({
    Key? key,
    required this.events,
    this.crossAxisCount = 2,
    this.cardHeight = 230,
    this.animate = true,
    this.onEventTap,
    this.padding = const EdgeInsets.all(16),
    this.spacing = 16,
    this.baseDuration = const Duration(milliseconds: 400),
    this.staggerDuration = const Duration(milliseconds: 50),
    this.curve = Curves.easeOutCubic,
  }) : super(key: key);

  @override
  _AnimatedEventListState createState() => _AnimatedEventListState();
}

class _AnimatedEventListState extends State<AnimatedEventList> {
  final List<GlobalKey<EventCardState>> _cardKeys = [];
  bool _hasAnimated = false;

  @override
  void initState() {
    super.initState();
    _initializeKeys();
    
    if (widget.animate) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _animateCards();
      });
    } else {
      _hasAnimated = true;
    }
  }
  
  @override
  void didUpdateWidget(AnimatedEventList oldWidget) {
    super.didUpdateWidget(oldWidget);
    
    // If widget.animate changed or widget.events length changed, update keys
    if (widget.animate != oldWidget.animate || 
        widget.events.length != oldWidget.events.length) {
      _initializeKeys();
      
      if (widget.animate && !_hasAnimated) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _animateCards();
        });
      }
    }
  }
  
  void _initializeKeys() {
    _cardKeys.clear();
    for (int i = 0; i < widget.events.length; i++) {
      _cardKeys.add(GlobalKey<EventCardState>());
    }
  }
  
  void _animateCards() {
    if (!mounted) return;
    
    for (int i = 0; i < _cardKeys.length; i++) {
      final delay = Duration(
        milliseconds: widget.staggerDuration.inMilliseconds * i,
      );
      
      Future.delayed(delay, () {
        if (!mounted) return;
        final cardState = _cardKeys[i].currentState;
        cardState?.startAnimation();
      });
    }
    
    setState(() {
      _hasAnimated = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: widget.padding,
      child: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: widget.crossAxisCount,
          childAspectRatio: (1 / (widget.cardHeight / (MediaQuery.of(context).size.width / widget.crossAxisCount))),
          crossAxisSpacing: widget.spacing,
          mainAxisSpacing: widget.spacing,
        ),
        itemCount: widget.events.length,
        itemBuilder: (context, index) {
          final event = widget.events[index];
          return EventCard(
            key: _cardKeys[index],
            event: event,
            onTap: widget.onEventTap != null 
                ? () => widget.onEventTap!(event['id']) 
                : null,
            animate: widget.animate && !_hasAnimated,
            animationDuration: widget.baseDuration,
            curve: widget.curve,
          );
        },
      ),
    );
  }
}