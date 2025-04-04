import 'package:flutter/material.dart';
import '../../utils/custom_route_transitions.dart';
import '../../widgets/animated_card.dart';
import 'animated_events_example_screen.dart';

/// Main screen that provides access to all animation examples
class AnimationExamplesMainScreen extends StatelessWidget {
  const AnimationExamplesMainScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Animation Examples'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Animation Showcase',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Explore the various animation examples used throughout the app',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView(
                children: [
                  _buildExampleCard(
                    context,
                    title: 'Event Cards Animation',
                    description: 'Animated grid and list transitions for event cards',
                    icon: Icons.event,
                    color: Colors.blue,
                    onTap: () => _navigateToEventCardsExample(context),
                  ),
                  const SizedBox(height: 16),
                  _buildExampleCard(
                    context,
                    title: 'Hero Transitions',
                    description: 'Smooth transitions between screens with Hero animations',
                    icon: Icons.swap_horiz,
                    color: Colors.orange,
                    onTap: () {
                      // Navigate to Hero transitions example
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Coming soon!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  _buildExampleCard(
                    context,
                    title: 'Page Transitions',
                    description: 'Various page transition animations',
                    icon: Icons.animation,
                    color: Colors.green,
                    onTap: () {
                      // Navigate to page transitions example
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Coming soon!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  _buildExampleCard(
                    context,
                    title: 'Staggered Animations',
                    description: 'Staggered animations for lists and grids',
                    icon: Icons.stacked_line_chart,
                    color: Colors.purple,
                    onTap: () {
                      // Navigate to staggered animations example
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Coming soon!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExampleCard(
    BuildContext context, {
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return AnimatedCard(
      onTap: onTap,
      animateOnAppear: true,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 32,
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              color: Colors.grey.shade400,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToEventCardsExample(BuildContext context) {
    CustomRouteTransitions.push(
      context,
      const AnimatedEventsExampleScreen(),
      type: TransitionType.fadeSlide,
    );
  }
}