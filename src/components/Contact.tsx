"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Mail, Send, Github, Star } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your inquiry..."
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#0057FF] hover:bg-[#0057FF]/90">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </Card>
          
          <div className="space-y-8">
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#0057FF] to-[#00C97E] flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-2">
                    For general inquiries and support
                  </p>
                  <a
                    href="mailto:teamcampusnotes@gmail.com"
                    className="text-[#0057FF] hover:underline font-medium"
                  >
                    teamcampusnotes@gmail.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-[#0057FF]/10 to-[#00C97E]/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#0057FF] to-[#00C97E] flex items-center justify-center flex-shrink-0">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Open Source Contribution</h3>
                  <p className="text-muted-foreground mb-4">
                    CampusNotes+ is open source! We welcome contributions from the community. Star our repository and help us build the future of academic knowledge sharing.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open('https://github.com/Campus-Notes/campus_notes_app', '_blank')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
                <Button 
                  className="flex-1 bg-[#0057FF] hover:bg-[#0057FF]/90"
                  onClick={() => window.open('https://github.com/Campus-Notes/campus_notes_app', '_blank')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Star Repository
                </Button>
              </div>
            </Card>
            
            <Card className="p-8 bg-gradient-to-br from-[#00C97E]/10 to-[#0057FF]/10">
              <h3 className="text-lg font-semibold mb-3">Join Our Community</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to know about updates, new features, and special offers. Join our waitlist today!
              </p>
              <Button variant="outline" className="w-full">
                Join Waitlist
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}