import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundPolicy() {
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">Refund & Cancellation Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p>
                At CampusNotes+, we strive to ensure customer satisfaction. This Refund & 
                Cancellation Policy outlines the conditions under which refunds and cancellations 
                are processed for purchases made on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
              <p>You may be eligible for a refund if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You accidentally purchased the same notes multiple times</li>
                <li>The notes purchased are significantly different from their description</li>
                <li>The files are corrupted or cannot be accessed</li>
                <li>You were charged incorrectly due to a technical error</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Request Period</h2>
              <p>
                Refund requests must be submitted within 48 hours of purchase. After this period, 
                refund requests will be reviewed on a case-by-case basis at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Non-Refundable Situations</h2>
              <p>Refunds will not be provided in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind after downloading the notes</li>
                <li>Notes that meet the description but don't match your expectations</li>
                <li>Purchases made more than 7 days ago (except in exceptional circumstances)</li>
                <li>Notes that have been downloaded and accessed successfully</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
              <p>
                Orders can be cancelled before the notes are downloaded. Once downloaded, 
                cancellations are not possible, but you may request a refund following the 
                refund eligibility criteria above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
              <p>
                Approved refunds will be processed within 5-7 business days. The refund will be 
                credited back to your original payment method via Razorpay. Please allow additional 
                time for your bank to process the refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
              <p>To request a refund, please:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact us at team@campusnotesplus.com</li>
                <li>Include your order ID and transaction details</li>
                <li>Explain the reason for your refund request</li>
                <li>Provide any supporting evidence (screenshots, etc.)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                For any questions regarding refunds or cancellations, please contact us at:{' '}
                <a href="mailto:team@campusnotesplus.com" className="text-[#0057FF] hover:underline">
                  team@campusnotesplus.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
