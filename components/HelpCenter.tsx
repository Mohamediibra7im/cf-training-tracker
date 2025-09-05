'use client';

import { useState } from 'react';
import { Search, ChevronRight, HelpCircle, Book, Video, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import HelpSearch from './HelpSearch';
import QuickStartGuide from './QuickStartGuide';
import FAQSection from './FAQSection';
import FeatureTutorials from './FeatureTutorials';
import SupportContact from './SupportContact';

const helpCategories = [
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with CF Training Tracker in minutes',
    icon: ArrowRight,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    id: 'tutorials',
    title: 'Feature Tutorials',
    description: 'Step-by-step guides for all features',
    icon: Video,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Common questions and answers',
    icon: HelpCircle,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    id: 'support',
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: MessageCircle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'quick-start':
        return <QuickStartGuide onBack={() => setActiveCategory(null)} />;
      case 'tutorials':
        return <FeatureTutorials onBack={() => setActiveCategory(null)} />;
      case 'faq':
        return <FAQSection onBack={() => setActiveCategory(null)} />;
      case 'support':
        return <SupportContact onBack={() => setActiveCategory(null)} />;
      default:
        return null;
    }
  };

  if (activeCategory) {
    return renderCategoryContent();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Book className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Help Center
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to the CF Training Tracker Help Center. Find guides, tutorials, and answers to help you make the most of your competitive programming journey.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help topics, features, or questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
        {searchQuery && (
          <div className="mt-4">
            <HelpSearch query={searchQuery} />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Help Articles</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Video Tutorials</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Support Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={category.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group"
              onClick={() => setActiveCategory(category.id)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Popular Help Topics</span>
          </CardTitle>
          <CardDescription>
            Most searched help topics by our users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'How to start training sessions',
              'Understanding notification system',
              'Syncing Codeforces profile',
              'Reading statistics and analytics',
              'Managing upsolve problems',
              'Changing PIN and settings',
            ].map((topic, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start h-auto p-3 text-left"
                onClick={() => {
                  if (topic.includes('training')) setActiveCategory('tutorials');
                  else if (topic.includes('notification')) setActiveCategory('tutorials');
                  else if (topic.includes('Codeforces')) setActiveCategory('quick-start');
                  else if (topic.includes('statistics')) setActiveCategory('tutorials');
                  else if (topic.includes('upsolve')) setActiveCategory('tutorials');
                  else if (topic.includes('PIN')) setActiveCategory('faq');
                }}
              >
                <div>
                  <div className="font-medium">{topic}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Learn more about this feature
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you.
          </p>
          <Button onClick={() => setActiveCategory('support')}>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
