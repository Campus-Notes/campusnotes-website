import Image from 'next/image';
import { Button } from './ui/button';
import { Download, Mail } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <div className="text-sm font-semibold text-[#0057FF] bg-[#0057FF]/10 px-4 py-2 rounded-full">
                Affordable. Accessible. Academic.
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Buy, Sell & Donate{' '}
              <span className="bg-gradient-to-r from-[#0057FF] to-[#00C97E] bg-clip-text text-transparent">
                Academic Notes
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Affordable. Secure. Offline Access. Connect with students, access quality notes, and earn rewards for contributing to the academic community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#0057FF] hover:bg-[#0057FF]/90 text-white text-base h-12 px-8"
                asChild
              >
                <a href="https://example.com/apk-download" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download APK
                </a>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8"
                asChild
              >
                <a href="#contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Join Waitlist
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/0931e685-f5cd-465f-b8ae-6411d9229751/generated_images/modern-mobile-app-interface-mockup-for-c-07b24b7d-20251104195156.jpg"
                    alt="CampusNotes+ App Interface"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/0931e685-f5cd-465f-b8ae-6411d9229751/generated_images/mobile-app-chat-interface-mockup-for-cam-8e50de0e-20251104195156.jpg"
                    alt="CampusNotes+ Chat Interface"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}