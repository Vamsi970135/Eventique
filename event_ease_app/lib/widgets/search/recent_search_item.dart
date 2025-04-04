import 'package:flutter/material.dart';

class RecentSearchItem extends StatelessWidget {
  final String search;
  final VoidCallback onTap;

  const RecentSearchItem({
    Key? key,
    required this.search,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: const Icon(Icons.history),
      title: Text(
        search,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: const Icon(Icons.chevron_right),
      dense: true,
    );
  }
}