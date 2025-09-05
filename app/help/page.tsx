import { Metadata } from 'next';
import HelpCenter from '../../components/HelpCenter';

export const metadata: Metadata = {
  title: 'Help Center - CF Training Tracker',
  description: 'Get help and learn how to use CF Training Tracker effectively. Find tutorials, FAQs, and support resources.',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <HelpCenter />
      </div>
    </div>
  );
}
