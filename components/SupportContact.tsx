'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, Github, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface SupportContactProps {
  onBack: () => void;
}

const supportOptions = [
  {
    id: 'github',
    title: 'GitHub Issues',
    description: 'Report bugs, request features, or contribute to the project',
    icon: Github,
    action: 'Visit GitHub',
    link: 'https://github.com/Mohamediibra7im/cf-training-tracker',
    recommended: true,
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us a detailed message about your issue',
    icon: Mail,
    action: 'Send Email',
    link: 'mailto:mohamed.ibra7im011@gmail.com',
    recommended: false,
  },
  {
    id: 'contact-form',
    title: 'Contact Form',
    description: 'Fill out our contact form for general inquiries',
    icon: MessageCircle,
    action: 'Fill Form',
    link: '#contact-form',
    recommended: false,
  },
];

export default function SupportContact({ onBack }: SupportContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: 'general',
        });
      } else {
        // Show error message
        alert(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Thank You!</h1>
            <p className="text-muted-foreground">Your message has been sent successfully</p>
          </div>
        </div>

        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Message Sent Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              We have received your message and will get back to you within 24-48 hours.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Help Center
              </Button>
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
          <h1 className="text-3xl font-bold">Contact Support</h1>
          <p className="text-muted-foreground">
            Get help from our support team or connect with the community
          </p>
        </div>
      </div>

      {/* Support Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {supportOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${option.recommended ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => {
                if (option.link.startsWith('#')) {
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.open(option.link, '_blank');
                }
              }}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-lg ${option.recommended ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${option.recommended ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
                <CardTitle className="text-lg">
                  {option.title}
                  {option.recommended && (
                    <Badge className="ml-2" variant="default">Recommended</Badge>
                  )}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant={option.recommended ? "default" : "outline"} className="w-full">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Form */}
      <Card id="contact-form">
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we will get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                className="w-full p-2 border border-input bg-background rounded-md"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="general">General Inquiry</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="account">Account Issues</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <Input
                placeholder="Brief description of your inquiry"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                placeholder="Please provide as much detail as possible about your issue or inquiry..."
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            Other ways to get help and stay updated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Response Times</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GitHub Issues: 24-48 hours</li>
                <li>• Email Support: 1-2 business days</li>
                <li>• Contact Form: 1-2 business days</li>
                <li>• Bug Reports: Priority handling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Before Contacting Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check our FAQ section</li>
                <li>• Search existing GitHub issues</li>
                <li>• Try the troubleshooting guide</li>
                <li>• Clear browser cache and cookies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
