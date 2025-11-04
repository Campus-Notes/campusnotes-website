import { UserPlus, Search, CreditCard, Download } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Register / Login',
    description: 'Create your account to get started with CampusNotes+',
    number: '01',
  },
  {
    icon: Search,
    title: 'Upload or Browse Notes',
    description: 'Upload your notes or explore quality materials from peers',
    number: '02',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Complete transactions safely using Razorpay integration',
    number: '03',
  },
  {
    icon: Download,
    title: 'Download & Access',
    description: 'Access your purchased notes offline anytime, anywhere',
    number: '04',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with CampusNotes+ in just four simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-to-br from-[#0057FF] to-[#00C97E] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-[#0057FF]" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#0057FF] to-[#00C97E]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}