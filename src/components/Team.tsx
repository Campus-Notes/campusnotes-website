import { Code, Database, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';

const teamMembers = [
  {
    icon: Code,
    role: 'Flutter Developers',
    description: 'Building beautiful and performant mobile experiences',
  },
  {
    icon: Database,
    role: 'Backend Developer',
    description: 'Creating robust and scalable server infrastructure',
  },
  {
    icon: Lightbulb,
    role: 'Product Manager',
    description: 'Driving product vision and user experience',
  },
];

export function Team() {
  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated professionals building CampusNotes+
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[#0057FF] to-[#00C97E] flex items-center justify-center">
                  <member.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{member.role}</h3>
                <p className="text-muted-foreground">{member.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
