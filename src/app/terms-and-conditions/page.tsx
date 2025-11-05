import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsAndConditions() {
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
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using CampusNotes+, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to these terms, 
                please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
              <p>
                To access certain features of CampusNotes+, you must register for an account. 
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Content Guidelines</h2>
              <p>Users who upload content to CampusNotes+ agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Only upload original content or content they have rights to share</li>
                <li>Not upload copyrighted material without permission</li>
                <li>Ensure accuracy of academic information</li>
                <li>Not upload inappropriate, offensive, or illegal content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Payments and Refunds</h2>
              <p>
                All payments are processed through Razorpay. By making a purchase, you agree 
                to Razorpay's terms of service. Please refer to our Refund Policy for information 
                about refunds and cancellations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p>
                The CampusNotes+ platform, including its design, features, and functionality, 
                is owned by CampusNotes+ and is protected by copyright and other intellectual 
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p>
                CampusNotes+ shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p>
                For questions about these Terms & Conditions, please contact us at:{' '}
                <a href="mailto:teamcampusnotes@gmail.com" className="text-[#0057FF] hover:underline">
                  teamcampusnotes@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}