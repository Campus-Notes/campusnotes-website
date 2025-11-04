import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { ApkDownload } from '@/components/ApkDownload';
import { Team } from '@/components/Team';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <ApkDownload />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}