import 'package:flutter/material.dart';

class SearchBarWidget extends StatelessWidget {
  final VoidCallback onTap;
  final bool readOnly;
  final Function(String)? onSubmitted;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final String hintText;

  const SearchBarWidget({
    Key? key,
    required this.onTap,
    this.readOnly = true,
    this.onSubmitted,
    this.controller,
    this.focusNode,
    this.hintText = 'Search services, categories...',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 48,
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(24),
        ),
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          readOnly: readOnly,
          onSubmitted: onSubmitted,
          decoration: InputDecoration(
            hintText: hintText,
            prefixIcon: const Icon(Icons.search),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          textInputAction: TextInputAction.search,
        ),
      ),
    );
  }
}