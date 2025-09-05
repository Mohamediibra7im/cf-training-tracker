'use client';

import { ArrowLeft, CheckCircle, User, Settings, Play, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuickStartGuideProps {
  onBack: () => void;
}

const quickStartSteps = [
  {
    id: 1,
    title: 'Create Your Account',
    description: 'Sign up with your Codeforces handle and create a secure PIN',
    icon: User,
    time: '2 minutes',
    steps: [
      'Go to the homepage and click on the register/login area',
      'Enter your Codeforces handle exactly as it appears on Codeforces',
      'Create a secure 4-digit PIN (remember this for future logins)',
      'The system will automatically fetch your profile data',
      'Complete the registration process',
    ],
    tips: [
      'Make sure your Codeforces handle is spelled correctly',
      'Choose a PIN that you can remember but others cannot guess',
      'Your profile will sync automatically with Codeforces data',
    ],
  },
  {
    id: 2,
    title: 'Set Up Your Profile',
    description: 'Sync your Codeforces data and configure your preferences',
    icon: Settings,
    time: '3 minutes',
    steps: [
      'After logging in, click on your profile avatar',
      'Select "Sync Profile" to update your latest data',
      'Review your statistics and performance metrics',
      'Adjust theme settings (dark/light mode) if desired',
      'Explore the notification center (bell icon)',
    ],
    tips: [
      'Profile sync updates your rating, solved problems, and submissions',
      'Sync regularly to keep your data current',
      'Check notifications for important updates and announcements',
    ],
  },
  {
    id: 3,
    title: 'Start Your First Training Session',
    description: 'Generate problems and begin practicing with customized difficulty',
    icon: Play,
    time: '5 minutes',
    steps: [
      'Navigate to the "Training" page from the main menu',
      'Select your preferred difficulty level or set a custom rating range',
      'Choose specific problem tags to focus on (optional)',
      'Set the number of problems you want to practice',
      'Click "Generate Problems" to start your session',
      'Work through problems and track your progress',
    ],
    tips: [
      'Start with easier problems if you are new to competitive programming',
      'Focus on specific tags to improve weak areas',
      'Take breaks between problems to avoid fatigue',
    ],
  },
  {
    id: 4,
    title: 'Track Your Progress',
    description: 'Monitor your performance and analyze your improvement',
    icon: BarChart,
    time: '2 minutes',
    steps: [
      'Visit the "Statistics" page to view your analytics',
      'Review your activity heatmap to see daily practice',
      'Analyze your rating progression over time',
      'Check your problem-solving speed and accuracy',
      'Identify areas for improvement based on tag performance',
    ],
    tips: [
      'Regular practice shows better results in the heatmap',
      'Focus on consistency rather than solving many problems at once',
      'Use statistics to identify your strong and weak problem categories',
    ],
  },
];

export default function QuickStartGuide({ onBack }: QuickStartGuideProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Quick Start Guide</h1>
          <p className="text-muted-foreground">
            Get up and running with CF Training Tracker in just a few minutes
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Complete Setup in ~12 minutes</h3>
              <p className="text-sm text-muted-foreground">
                Follow these 4 simple steps to get started with competitive programming practice
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">4</div>
              <div className="text-sm text-muted-foreground">Steps</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        {quickStartSteps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <Card key={step.id} className="relative">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">
                        Step {step.id}: {step.title}
                      </CardTitle>
                      <Badge variant="secondary">{step.time}</Badge>
                    </div>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Steps */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      What to do
                    </h4>
                    <div className="space-y-2">
                      {step.steps.map((stepItem, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{stepItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Helpful tips
                    </h4>
                    <div className="space-y-2">
                      {step.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Step connector line */}
              {index < quickStartSteps.length - 1 && (
                <div className="absolute left-9 bottom-0 w-0.5 h-6 bg-border translate-y-full"></div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Completion Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold">You are all set! 🎉</h3>
              <p className="text-muted-foreground">
                You have completed the quick start guide. Start practicing and improve your competitive programming skills!
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.location.href = '/training'}>
                Start Training
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/statistics'}>
                View Statistics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
