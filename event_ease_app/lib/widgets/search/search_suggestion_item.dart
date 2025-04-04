import 'package:flutter/material.dart';

class SearchSuggestionItem extends StatelessWidget {
  final String suggestion;
  final VoidCallback onTap;

  const SearchSuggestionItem({
    Key? key,
    required this.suggestion,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: const Icon(Icons.search),
      title: Text(
        suggestion,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: const Icon(Icons.north_west, size: 16),
      dense: true,
    );
  }
}