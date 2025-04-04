import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';

import '../../services/search_service.dart';
import '../../widgets/search/search_result_item.dart';
import '../../widgets/search/recent_search_item.dart';
import '../../widgets/search/search_suggestion_item.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  Timer? _debounce;
  bool _showSuggestions = false;
  List<String> _suggestions = [];
  List<SearchResult> _searchResults = [];
  
  @override
  void initState() {
    super.initState();
    _searchFocusNode.requestFocus();
    
    // Listen for changes in the search text
    _searchController.addListener(_onSearchChanged);
  }
  
  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _searchFocusNode.dispose();
    _debounce?.cancel();
    super.dispose();
  }
  
  void _onSearchChanged() {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final query = _searchController.text.trim();
      
      if (query.isNotEmpty) {
        _getSuggestions(query);
      } else {
        setState(() {
          _showSuggestions = false;
          _suggestions = [];
        });
      }
    });
  }
  
  Future<void> _getSuggestions(String query) async {
    final searchService = Provider.of<SearchService>(context, listen: false);
    final suggestions = await searchService.getSearchSuggestions(query);
    
    setState(() {
      _showSuggestions = true;
      _suggestions = suggestions;
    });
  }
  
  Future<void> _performSearch(String query) async {
    setState(() {
      _showSuggestions = false;
    });
    
    final searchService = Provider.of<SearchService>(context, listen: false);
    final results = await searchService.searchServiceProviders(query);
    
    setState(() {
      _searchResults = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: _buildSearchBar(),
        elevation: 0,
      ),
      body: Consumer<SearchService>(
        builder: (context, searchService, child) {
          if (searchService.isLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          
          if (_showSuggestions) {
            return _buildSuggestionsList();
          }
          
          if (_searchResults.isNotEmpty) {
            return _buildSearchResultsList();
          }
          
          return _buildRecentSearches(searchService);
        },
      ),
    );
  }
  
  Widget _buildSearchBar() {
    return Container(
      height: 40,
      margin: const EdgeInsets.only(right: 16),
      child: TextField(
        controller: _searchController,
        focusNode: _searchFocusNode,
        decoration: InputDecoration(
          hintText: 'Search services, categories...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    setState(() {
                      _showSuggestions = false;
                      _suggestions = [];
                      _searchResults = [];
                    });
                  },
                )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.grey.shade200,
          contentPadding: const EdgeInsets.symmetric(vertical: 0),
        ),
        textInputAction: TextInputAction.search,
        onSubmitted: (value) {
          if (value.isNotEmpty) {
            _performSearch(value);
          }
        },
      ),
    );
  }
  
  Widget _buildSuggestionsList() {
    return ListView.builder(
      itemCount: _suggestions.length,
      itemBuilder: (context, index) {
        final suggestion = _suggestions[index];
        return SearchSuggestionItem(
          suggestion: suggestion,
          onTap: () {
            _searchController.text = suggestion;
            _performSearch(suggestion);
          },
        );
      },
    );
  }
  
  Widget _buildSearchResultsList() {
    if (_searchResults.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              'No results found',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try different keywords or filters',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    }
    
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _searchResults.length,
      separatorBuilder: (context, index) => const Divider(),
      itemBuilder: (context, index) {
        final result = _searchResults[index];
        return SearchResultItem(
          result: result,
          onTap: () {
            if (result.type == 'provider') {
              Navigator.pushNamed(
                context,
                '/service-detail',
                arguments: {'serviceId': result.id},
              );
            } else if (result.type == 'category') {
              Navigator.pushNamed(
                context,
                '/services',
                arguments: {'category': result.name},
              );
            } else if (result.type == 'eventType') {
              Navigator.pushNamed(
                context,
                '/services',
                arguments: {'eventType': result.name},
              );
            }
          },
        );
      },
    );
  }
  
  Widget _buildRecentSearches(SearchService searchService) {
    final recentSearches = searchService.recentSearches;
    
    if (recentSearches.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              'Search for services',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Find photographers, venues, caterers, and more',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Searches',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {
                  searchService.clearRecentSearches();
                },
                child: Text('Clear All'),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: recentSearches.length,
            itemBuilder: (context, index) {
              final search = recentSearches[index];
              return RecentSearchItem(
                search: search,
                onTap: () {
                  _searchController.text = search;
                  _performSearch(search);
                },
              );
            },
          ),
        ),
      ],
    );
  }
}