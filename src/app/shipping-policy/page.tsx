import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Shipping Policy | CampusNotes+',
  description: 'Shipping and delivery information for CampusNotes+ digital products',
};

export default function ShippingPolicy() {
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
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-gradient-to-r from-[#0057FF] to-[#00C97E]">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold">Shipping Policy</h1>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="bg-gradient-to-r from-[#0057FF]/10 to-[#00C97E]/10 p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-semibold mb-4 mt-0">Digital Products - No Physical Shipping</h2>
              <p className="mb-0">
                CampusNotes+ is a <strong>100% digital platform</strong>. All products, including academic notes 
                and course materials, are delivered electronically through our mobile application. 
                <strong> There is no physical shipping involved.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How Delivery Works</h2>
              <p>
                When you purchase notes on CampusNotes+, the delivery process is instant and automatic:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Instant Access:</strong> Notes are available immediately after successful payment</li>
                <li><strong>Download to Device:</strong> All purchased content can be downloaded directly to your mobile device</li>
                <li><strong>Offline Access:</strong> Once downloaded, access your notes anytime without internet connection</li>
                <li><strong>No Waiting Period:</strong> No shipping time or delivery delays</li>
                <li><strong>Secure Delivery:</strong> All digital content is encrypted and securely transferred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Accessing Your Purchased Content</h2>
              <p>
                After completing your purchase through Razorpay:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>You will receive a confirmation notification in the app</li>
                <li>The purchased notes will appear in your "My Notes" or "Purchased" section</li>
                <li>Tap the download button to save the content for offline access</li>
                <li>Access your notes anytime from the app, even without internet</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What If I Don't Receive My Content?</h2>
              <p>
                In rare cases where purchased content is not immediately available:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check your internet connection and try refreshing the app</li>
                <li>Verify the payment was successfully processed through Razorpay</li>
                <li>Contact our support team at{' '}
                  <a href="mailto:teamcampusnotes@gmail.com" className="text-[#0057FF] hover:underline">
                    teamcampusnotes@gmail.com
                  </a>
                </li>
                <li>Include your transaction ID and registered email address</li>
              </ul>
              <p className="mt-4">
                We typically resolve delivery issues within 24 hours. You will receive full access 
                to your purchased content or a complete refund as per our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Technical Requirements</h2>
              <p>
                To ensure smooth delivery and access to your digital content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensure you have the latest version of the CampusNotes+ app installed</li>
                <li>Have a stable internet connection during the purchase and download process</li>
                <li>Ensure sufficient storage space on your device for downloaded content</li>
                <li>Keep your account logged in to maintain access to purchased materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">International Access</h2>
              <p>
                Since all our products are digital, they are available to students worldwide. 
                There are no geographical restrictions or international shipping concerns. 
                Access your purchased notes from anywhere with the CampusNotes+ app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
              <p>
                If you have questions about accessing your digital content or experience any 
                delivery issues, please contact us:
              </p>
              <p className="mt-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:teamcampusnotes@gmail.com" className="text-[#0057FF] hover:underline">
                  teamcampusnotes@gmail.com
                </a>
              </p>
              <p className="mt-2">
                <strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 hours
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Related Policies</h2>
              <p>For more information, please review our related policies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <Link href="/refund-policy" className="text-[#0057FF] hover:underline">
                    Refund & Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-[#0057FF] hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-[#0057FF] hover:underline">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
