import Image from 'next/image';
import { Button } from './ui/button';
import { Download, Smartphone } from 'lucide-react';

export function ApkDownload() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-[#0057FF] to-[#00C97E] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center p-12">
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-semibold">Beta Version Available</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold">
                Try the App Today
              </h2>
              
              <p className="text-xl text-white/90">
                Download the latest beta APK to explore the CampusNotes+ experience. Get early access to all features and help us shape the future of academic collaboration.
              </p>
              
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-white text-[#0057FF] hover:bg-white/90 text-base h-12 px-8"
                  asChild
                >
                  <a href="https://example.com/apk-download" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Download APK
                  </a>
                </Button>
                <p className="text-sm text-white/70 mt-3">
                  Compatible with Android 6.0 and above
                </p>
              </div>
            </div>
            
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-[280px] transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/0931e685-f5cd-465f-b8ae-6411d9229751/generated_images/mobile-app-profile-dashboard-mockup-for--317c8329-20251104195156.jpg"
                    alt="CampusNotes+ App Download"
                    fill
                    className="object-contain drop-shadow-2xl"
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
