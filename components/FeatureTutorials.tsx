'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureTutorialsProps {
  onBack: () => void;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popular: boolean;
  steps: string[];
  tips: string[];
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Setting Up Your First Training Session',
    description: 'Learn how to create and customize training sessions for effective practice',
    category: 'Training',
    duration: '5 min',
    difficulty: 'Beginner',
    popular: true,
    steps: [
      'Navigate to the Training page from the main menu',
      'Select your preferred difficulty level (Easy, Medium, Hard, Expert)',
      'Choose specific problem tags to focus on particular topics',
      'Set the number of problems for your session',
      'Click "Generate Problems" to start practicing',
      'Work through problems and track your progress in real-time',
    ],
    tips: [
      'Start with easier difficulties if you are new to competitive programming',
      'Use tags to focus on weak areas identified in your statistics',
      'Take breaks between problems to maintain focus',
    ],
  },
  {
    id: '2',
    title: 'Understanding the Notification System',
    description: 'Master the notification center and stay updated with important information',
    category: 'Notifications',
    duration: '3 min',
    difficulty: 'Beginner',
    popular: true,
    steps: [
      'Look for the bell icon in the top navigation bar',
      'Notice the red badge showing unread notification count',
      'Click the bell to open the notification center panel',
      'Read through different types of notifications (announcements, features, etc.)',
      'Use the green checkmark to mark notifications as read',
      'Use the red X button to delete notifications from your view',
    ],
    tips: [
      'Check notifications regularly for important updates',
      'Deleting a notification only removes it from your view',
      'Different notification types have different colored icons',
    ],
  },
  {
    id: '3',
    title: 'Analyzing Your Performance Statistics',
    description: 'Interpret your performance data and identify areas for improvement',
    category: 'Analytics',
    duration: '7 min',
    difficulty: 'Intermediate',
    popular: true,
    steps: [
      'Go to the Statistics page from the navigation menu',
      'Review your overall performance metrics at the top',
      'Examine the activity heatmap to see your practice consistency',
      'Analyze your rating progression chart over time',
      'Check your problem-solving speed and accuracy metrics',
      'Review the tag distribution to identify strong/weak areas',
    ],
    tips: [
      'Consistent practice shows as darker squares in the heatmap',
      'Focus on tags where you have lower success rates',
      'Track your rating progression to measure long-term improvement',
    ],
  },
  {
    id: '4',
    title: 'Managing Upsolve Problems',
    description: 'Track and organize problems you need to solve from contests',
    category: 'Upsolve',
    duration: '4 min',
    difficulty: 'Beginner',
    popular: false,
    steps: [
      'Navigate to the Upsolve page from the main menu',
      'View your list of problems that need upsolving',
      'Click on any problem to view details and solve it',
      'Mark problems as completed when you solve them',
      'Use filters to organize problems by contest or difficulty',
      'Set reminders for problems you want to solve later',
    ],
    tips: [
      'Upsolve problems shortly after contests for better learning',
      'Focus on problems just above your current skill level',
      'Read editorials after solving to learn alternative approaches',
    ],
  },
  {
    id: '5',
    title: 'Syncing Your Codeforces Profile',
    description: 'Keep your profile data up-to-date with latest Codeforces information',
    category: 'Profile',
    duration: '2 min',
    difficulty: 'Beginner',
    popular: false,
    steps: [
      'Click on your profile avatar in the top navigation',
      'Select "Sync Profile" from the dropdown menu',
      'Wait for the synchronization process to complete',
      'Check that your rating and recent submissions are updated',
      'Review any new solved problems in your history',
    ],
    tips: [
      'Sync your profile after participating in contests',
      'Regular syncing ensures accurate statistics',
      'Sync is automatic on login but can be done manually anytime',
    ],
  },
  {
    id: '6',
    title: 'Admin: Creating and Managing Notifications',
    description: 'Learn how to create and manage notifications for all users (Admin only)',
    category: 'Admin',
    duration: '6 min',
    difficulty: 'Advanced',
    popular: false,
    steps: [
      'Access the admin panel at /admin/notifications',
      'Click "Create New Notification" to start',
      'Fill in the title and detailed message content',
      'Select the appropriate notification type (announcement, feature, etc.)',
      'Set target audience and priority level',
      'Add expiration date if needed',
      'Preview and publish the notification',
    ],
    tips: [
      'Use clear, descriptive titles for better user engagement',
      'Choose appropriate notification types for different content',
      'Set expiration dates for time-sensitive announcements',
    ],
  },
  {
    id: '7',
    title: 'Customizing Your Account Settings',
    description: 'Personalize your experience and manage account security',
    category: 'Settings',
    duration: '4 min',
    difficulty: 'Beginner',
    popular: false,
    steps: [
      'Click on your profile avatar and select settings',
      'Review your current account information',
      'Change your PIN using the "Change PIN" option',
      'Toggle between dark and light themes',
      'Adjust notification preferences if available',
      'Save your changes',
    ],
    tips: [
      'Choose a memorable but secure PIN',
      'Dark mode can be easier on the eyes during long practice sessions',
      'Regular PIN changes improve account security',
    ],
  },
];

const categories = ['All', 'Training', 'Notifications', 'Analytics', 'Upsolve', 'Profile', 'Admin', 'Settings'];

export default function FeatureTutorials({ onBack }: FeatureTutorialsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);

  const filteredTutorials = tutorials.filter(
    tutorial => selectedCategory === 'All' || tutorial.category === selectedCategory
  );

  const popularTutorials = tutorials.filter(tutorial => tutorial.popular);

  if (selectedTutorial) {
    const tutorial = tutorials.find(t => t.id === selectedTutorial);
    if (!tutorial) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setSelectedTutorial(null)} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{tutorial.title}</h1>
            <p className="text-muted-foreground">{tutorial.description}</p>
          </div>
        </div>

        {/* Tutorial Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                  {tutorial.difficulty}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{tutorial.duration}</span>
                </div>
                <Badge variant="outline">{tutorial.category}</Badge>
                {tutorial.popular && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tutorial Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
              <CardDescription>Follow these steps to complete the tutorial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tutorial.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
              <CardDescription>Additional tips to help you succeed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tutorial.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedTutorial(null)}>
                ← Back to Tutorials
              </Button>
              <div className="flex space-x-2">
                <Button onClick={() => window.location.href = `/${tutorial.category.toLowerCase()}`}>
                  Try It Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Feature Tutorials</h1>
          <p className="text-muted-foreground">
            Step-by-step guides to help you master every feature
          </p>
        </div>
      </div>

      {/* Category Filter */}
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

      {/* Popular Tutorials */}
      {selectedCategory === 'All' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Popular Tutorials</span>
            </CardTitle>
            <CardDescription>
              Most viewed tutorials by our users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {popularTutorials.map((tutorial) => (
                <Card
                  key={tutorial.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTutorial(tutorial.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{tutorial.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {tutorial.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{tutorial.duration}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tutorials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedCategory === 'All' ? 'All Tutorials' : `${selectedCategory} Tutorials`}
          </h2>
          <Badge variant="secondary">
            {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredTutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => setSelectedTutorial(tutorial.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {tutorial.difficulty}
                      </Badge>
                      {tutorial.popular && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {tutorial.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>{tutorial.steps.length} steps</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <Badge variant="outline" className="text-xs">
                      {tutorial.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
