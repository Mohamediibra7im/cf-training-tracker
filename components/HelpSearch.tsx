'use client';

import { useState, useEffect } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  relevance: number;
}

const helpContent: SearchResult[] = [
  {
    id: '1',
    title: 'How to start your first training session',
    description: 'Learn how to set up and begin a training session with custom difficulty and tags.',
    category: 'Training',
    tags: ['training', 'beginner', 'session', 'setup'],
    relevance: 0.9,
  },
  {
    id: '2',
    title: 'Understanding the notification system',
    description: 'Learn about notifications, marking as read, and managing your notification center.',
    category: 'Notifications',
    tags: ['notifications', 'bell', 'admin', 'alerts'],
    relevance: 0.8,
  },
  {
    id: '3',
    title: 'Syncing your Codeforces profile',
    description: 'How to connect and sync your Codeforces account with CF Training Tracker.',
    category: 'Account',
    tags: ['codeforces', 'sync', 'profile', 'connection'],
    relevance: 0.9,
  },
  {
    id: '4',
    title: 'Reading statistics and performance analytics',
    description: 'Understand your progress charts, heatmaps, and performance metrics.',
    category: 'Analytics',
    tags: ['statistics', 'analytics', 'charts', 'performance'],
    relevance: 0.7,
  },
  {
    id: '5',
    title: 'Managing upsolve problems',
    description: 'Track and manage problems you need to upsolve from contests.',
    category: 'Upsolve',
    tags: ['upsolve', 'contests', 'problems', 'tracking'],
    relevance: 0.6,
  },
  {
    id: '6',
    title: 'Changing your PIN and account settings',
    description: 'How to update your PIN, change themes, and manage account preferences.',
    category: 'Settings',
    tags: ['pin', 'settings', 'account', 'security'],
    relevance: 0.8,
  },
  {
    id: '7',
    title: 'Admin features and notification management',
    description: 'How to use admin features to create and manage notifications for all users.',
    category: 'Admin',
    tags: ['admin', 'management', 'notifications', 'users'],
    relevance: 0.5,
  },
  {
    id: '8',
    title: 'Troubleshooting login issues',
    description: 'Common solutions for login problems and account access issues.',
    category: 'Troubleshooting',
    tags: ['login', 'troubleshooting', 'access', 'problems'],
    relevance: 0.7,
  },
];

interface HelpSearchProps {
  query: string;
}

export default function HelpSearch({ query }: HelpSearchProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate search with a small delay
    const searchTimer = setTimeout(() => {
      const results = helpContent
        .filter((item) => {
          const searchTerm = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            item.category.toLowerCase().includes(searchTerm)
          );
        })
        .sort((a, b) => {
          // Calculate relevance score based on query match
          const calculateScore = (item: SearchResult) => {
            const searchTerm = query.toLowerCase();
            let score = 0;

            if (item.title.toLowerCase().includes(searchTerm)) score += 3;
            if (item.category.toLowerCase().includes(searchTerm)) score += 2;
            if (item.tags.some(tag => tag.toLowerCase().includes(searchTerm))) score += 1;

            return score;
          };

          return calculateScore(b) - calculateScore(a);
        })
        .slice(0, 8); // Limit to 8 results

      setSearchResults(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  if (!query.trim()) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search Results</span>
          {searchResults.length > 0 && (
            <Badge variant="secondary">{searchResults.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Results for &quot;{query}&quot;
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {result.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                      {result.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try searching with different keywords or browse our help categories above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
