import 'package:flutter/material.dart';
import '../../widgets/animated_event_list.dart';
import '../../utils/custom_route_transitions.dart';
import '../../screens/event_details_screen.dart';

/// A screen that showcases the animated event cards and transitions
class AnimatedEventsExampleScreen extends StatefulWidget {
  const AnimatedEventsExampleScreen({Key? key}) : super(key: key);

  @override
  _AnimatedEventsExampleScreenState createState() => _AnimatedEventsExampleScreenState();
}

class _AnimatedEventsExampleScreenState extends State<AnimatedEventsExampleScreen> {
  bool _isGridView = true;
  bool _animate = true;
  
  // Example event data
  final List<Map<String, dynamic>> _events = [
    {
      'id': '1',
      'title': 'Summer Wedding Reception',
      'imageUrl': 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611',
      'date': 'June 15, 2023',
      'location': 'Seaside Resort, Miami',
      'price': '\$1,200',
      'eventType': 'Wedding',
    },
    {
      'id': '2',
      'title': 'Corporate Annual Conference',
      'imageUrl': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      'date': 'July 22, 2023',
      'location': 'Grand Convention Center',
      'price': '\$3,500',
      'eventType': 'Corporate',
    },
    {
      'id': '3',
      'title': 'Birthday Celebration',
      'imageUrl': 'https://images.unsplash.com/photo-1513151233558-d860c5398176',
      'date': 'Aug 10, 2023',
      'location': 'Rooftop Lounge',
      'price': '\$850',
      'eventType': 'Birthday',
    },
    {
      'id': '4',
      'title': 'Tech Startup Launch Party',
      'imageUrl': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
      'date': 'Sept 05, 2023',
      'location': 'Innovation Hub',
      'price': '\$2,000',
      'eventType': 'Launch',
    },
    {
      'id': '5',
      'title': 'Charity Gala Dinner',
      'imageUrl': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
      'date': 'Oct 12, 2023',
      'location': 'Luxury Hotel Ballroom',
      'price': '\$1,500',
      'eventType': 'Charity',
    },
    {
      'id': '6',
      'title': 'Music Festival Weekend',
      'imageUrl': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3',
      'date': 'Nov 18-20, 2023',
      'location': 'Riverside Park',
      'price': '\$750',
      'eventType': 'Festival',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Animated Events'),
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.view_list : Icons.grid_view),
            onPressed: _toggleViewMode,
            tooltip: _isGridView ? 'Switch to List View' : 'Switch to Grid View',
          ),
          IconButton(
            icon: Icon(_animate ? Icons.animation : Icons.animation_outlined),
            onPressed: _toggleAnimation,
            tooltip: _animate ? 'Disable Animation' : 'Enable Animation',
          ),
        ],
      ),
      body: AnimatedEventList(
        events: _events,
        crossAxisCount: _isGridView ? 2 : 1,
        cardHeight: _isGridView ? 230 : 200,
        animate: _animate,
        onEventTap: _navigateToEventDetails,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _resetAnimation,
        child: const Icon(Icons.refresh),
        tooltip: 'Reset Animation',
      ),
    );
  }

  void _toggleViewMode() {
    setState(() {
      _isGridView = !_isGridView;
      _animate = true; // Re-enable animation when switching views
    });
  }

  void _toggleAnimation() {
    setState(() {
      _animate = !_animate;
    });
  }

  void _resetAnimation() {
    setState(() {
      _animate = true;
    });
  }

  void _navigateToEventDetails(String eventId) {
    final event = _events.firstWhere((e) => e['id'] == eventId);
    
    CustomRouteTransitions.push(
      context,
      EventDetailsScreen(eventId: eventId, event: event),
      type: TransitionType.fadeSlide,
    );
  }
}