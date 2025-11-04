import { Upload, Shield, Wifi, MessageCircle, Award, Heart } from 'lucide-react';
import { Card } from './ui/card';

const features = [
  {
    icon: Upload,
    title: 'Upload & Sell Notes',
    description: 'Contribute your knowledge and earn by uploading quality academic notes to the platform.',
  },
  {
    icon: Shield,
    title: 'Secure Razorpay Payments',
    description: 'All transactions are protected with secure Razorpay payment gateway integration.',
  },
  {
    icon: Wifi,
    title: 'Offline Access',
    description: 'Download purchased notes and access them anytime, anywhere without internet.',
  },
  {
    icon: MessageCircle,
    title: 'Chat with Sellers',
    description: 'Connect directly with note sellers to clarify doubts and ask questions.',
  },
  {
    icon: Award,
    title: 'Reward Points',
    description: 'Earn points for contributing notes and unlock exclusive benefits through gamification.',
  },
  {
    icon: Heart,
    title: 'Donate Notes',
    description: 'Support your juniors by contributing notes for free and build a collaborative community.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to access, exchange, and manage academic notes effectively.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#0057FF] to-[#00C97E] flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}