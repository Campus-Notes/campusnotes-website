'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Send, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#0057FF] to-[#00C97E] bg-clip-text text-transparent">
                CampusNotes+
              </div>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Reach out to our team 
              and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#0057FF] to-[#00C97E]">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[150px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0057FF] to-[#00C97E] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                {submitStatus === 'success' && (
                  <p className="text-sm text-[#00C97E] text-center">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </p>
                )}
              </form>
            </div>

            {/* Contact Info & Open Source */}
            <div className="space-y-6">
              {/* Email Contact */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#0057FF] to-[#00C97E]">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Email Us Directly</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Prefer email? Send your queries directly to our team inbox:
                </p>
                <a
                  href="mailto:teamcampusnotes@gmail.com"
                  className="text-lg font-medium text-[#0057FF] hover:underline inline-flex items-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  teamcampusnotes@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-3">
                  Response time: 24-48 hours
                </p>
              </div>

              {/* Open Source Contribution */}
              <div className="bg-gradient-to-br from-[#0057FF]/10 to-[#00C97E]/10 border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#0057FF] to-[#00C97E]">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Open Source Project</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  CampusNotes+ is open source! Contribute to the project, report issues, 
                  or request features on GitHub. Join our developer community and help us 
                  make education more accessible.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href="https://github.com/Campus-Notes/campus_notes_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#0057FF] to-[#00C97E] text-white"
                    asChild
                  >
                    <a
                      href="https://github.com/Campus-Notes/campus_notes_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Star Repository
                    </a>
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We're a student-run project, so response times may vary. We typically 
                  respond within 24-48 hours on business days.
                </p>
                <h3 className="text-lg font-semibold mb-3">Support Areas</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Technical support & bug reports</li>
                  <li>• Account & payment issues</li>
                  <li>• Partnership inquiries</li>
                  <li>• Feature requests & feedback</li>
                  <li>• General questions about CampusNotes+</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Links to Other Pages */}
          <div className="bg-muted/50 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Need More Information?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy-policy" className="text-[#0057FF] hover:underline">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/terms-and-conditions" className="text-[#0057FF] hover:underline">
                Terms & Conditions
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/refund-policy" className="text-[#0057FF] hover:underline">
                Refund Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/shipping-policy" className="text-[#0057FF] hover:underline">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
