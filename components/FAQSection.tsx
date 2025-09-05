'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FAQSectionProps {
  onBack: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  popular: boolean;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I create an account?',
    answer: 'To create an account, enter your Codeforces handle on the homepage and create a secure password. The system will automatically fetch your profile data from Codeforces and create your account.',
    category: 'Account',
    tags: ['registration', 'account', 'setup'],
    popular: true,
  },
  {
    id: '1.5',
    question: 'Do I need a Codeforces account to use this platform?',
    answer: 'Yes, you need an active Codeforces account to use CF Training Tracker. The platform fetches your profile data, solved problems, and submissions from Codeforces. If you don\'t have one, you can create a free account at codeforces.com/register.',
    category: 'Account',
    tags: ['codeforces', 'account', 'requirement', 'registration'],
    popular: true,
  },
  {
    id: '2',
    question: 'Why can I not log in with my correct handle and password?',
    answer: 'Make sure your Codeforces handle is entered exactly as it appears on Codeforces (case-sensitive). Also verify that your password is correct. If the issue persists, try clearing your browser cache or use the password reset feature.',
    category: 'Troubleshooting',
    tags: ['login', 'authentication', 'troubleshooting'],
    popular: true,
  },
  {
    id: '3',
    question: 'How does the training session work?',
    answer: 'Training sessions generate random problems based on your selected difficulty level and tags. You can set a custom rating range, choose specific problem types, and practice at your own pace. The system tracks your progress and provides detailed analytics.',
    category: 'Training',
    tags: ['training', 'problems', 'difficulty'],
    popular: true,
  },
  {
    id: '4',
    question: 'What are the different difficulty levels?',
    answer: 'We offer predefined difficulty levels: Easy (800-1200), Medium (1200-1600), Hard (1600-2000), and Expert (2000-2400). You can also set custom rating ranges to match your current skill level.',
    category: 'Training',
    tags: ['difficulty', 'levels', 'rating'],
    popular: false,
  },
  {
    id: '5',
    question: 'How do I sync my Codeforces profile?',
    answer: 'Click on your profile avatar in the navigation bar and select "Sync Profile". This updates your rating, solved problems, and recent submissions from Codeforces. You can also sync automatically when logging in.',
    category: 'Account',
    tags: ['sync', 'profile', 'codeforces'],
    popular: true,
  },
  {
    id: '6',
    question: 'What are notifications and how do I manage them?',
    answer: 'Notifications keep you updated with announcements, new features, maintenance, and alerts. Click the bell icon to view your notification center. You can mark notifications as read or delete them individually. Only admins can create notifications.',
    category: 'Notifications',
    tags: ['notifications', 'bell', 'admin'],
    popular: false,
  },
  {
    id: '7',
    question: 'How do I change my password?',
    answer: 'Go to your profile settings, click "Change Password", enter your current password, then create and confirm your new secure password. Make sure your new password meets the security requirements.',
    category: 'Account',
    tags: ['password', 'security', 'settings'],
    popular: false,
  },
  {
    id: '8',
    question: 'What is upsolving and how does it work?',
    answer: 'Upsolving refers to solving problems from contests that you could not solve during the contest. The upsolve feature tracks problems you need to solve and helps you manage your practice queue.',
    category: 'Upsolve',
    tags: ['upsolve', 'contests', 'practice'],
    popular: false,
  },
  {
    id: '9',
    question: 'How do I read my statistics and analytics?',
    answer: 'The statistics page shows your performance metrics including rating progression, activity heatmap, solving speed, and problem category distribution. Use these insights to identify areas for improvement.',
    category: 'Analytics',
    tags: ['statistics', 'analytics', 'performance'],
    popular: true,
  },
  {
    id: '10',
    question: 'Can I practice specific topics or problem types?',
    answer: 'Yes! When setting up a training session, you can select specific tags like "Dynamic Programming", "Graph Theory", "Data Structures", etc. This helps you focus on weak areas or practice specific topics.',
    category: 'Training',
    tags: ['tags', 'topics', 'practice'],
    popular: false,
  },
  {
    id: '11',
    question: 'How do I become an admin?',
    answer: 'Admin privileges are granted by database administrators. Contact the system administrator to request admin access. Admins can create, edit, and delete notifications for all users.',
    category: 'Admin',
    tags: ['admin', 'privileges', 'permissions'],
    popular: false,
  },
  {
    id: '12',
    question: 'Is my data safe and secure?',
    answer: 'Yes, your data is secure. We use encrypted PINs, secure JWT tokens, and follow best practices for data protection. Your Codeforces data is fetched read-only and we never store your Codeforces password.',
    category: 'Security',
    tags: ['security', 'privacy', 'data'],
    popular: false,
  },
];

const categories = ['All', 'Account', 'Training', 'Notifications', 'Analytics', 'Upsolve', 'Admin', 'Security', 'Troubleshooting'];

export default function FAQSection({ onBack }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about CF Training Tracker
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular FAQs */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-yellow-500" />
              <span>Most Popular Questions</span>
            </CardTitle>
            <CardDescription>
              These are the questions most users ask
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularFAQs.map((faq) => (
                <Button
                  key={faq.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {openFAQ === faq.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="text-left flex-1">{faq.question}</span>
                    <Badge variant="outline" className="ml-2">
                      {faq.category}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'All Questions'}
          </h2>
          <Badge variant="secondary">
            {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No questions found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-2 -m-2"
                    onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {openFAQ === faq.id ? (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">{faq.question}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          {faq.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>

                  {openFAQ === faq.id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
