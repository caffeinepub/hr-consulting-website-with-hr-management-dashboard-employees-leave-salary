import { Users } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Senior HR Consultant',
    description: 'With over 12 years of experience in organizational development and talent management, Sarah specializes in creating strategic HR frameworks that drive business growth and employee engagement.',
    image: '/assets/generated/team-1.dim_512x512.png',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Payroll & Compliance Specialist',
    description: 'Michael brings 10 years of expertise in payroll systems and regulatory compliance. He ensures seamless payroll operations while keeping organizations ahead of evolving labor laws and tax regulations.',
    image: '/assets/generated/team-2.dim_512x512.png',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Recruitment Manager',
    description: 'A recruitment expert with 8 years of experience across multiple industries, Emily excels at identifying top talent and building high-performing teams that align with organizational culture and goals.',
    image: '/assets/generated/team-3.dim_512x512.png',
  },
];

export default function TeamPage() {
  const headerRef = useInView({ threshold: 0.2, triggerOnce: true });
  const teamRef = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div style={{ backgroundColor: '#131E3A' }} className="min-h-screen">
      <section className="py-24">
        <div className="container px-4">
          {/* Header */}
          <div
            ref={headerRef.ref}
            className={`text-center mb-20 ${headerRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">Our Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Expert Team
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated professionals who bring expertise, passion, and innovation to every client engagement.
            </p>
          </div>

          {/* Team Grid */}
          <div ref={teamRef.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`group ${teamRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-border/50 hover:border-primary/50 motion-safe:transition-all motion-safe:duration-300 hover:shadow-xl hover:shadow-primary/10 bg-card">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={`Team member photo: ${member.name}`}
                      className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 motion-safe:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary motion-safe:transition-colors motion-safe:duration-300">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4">{member.role}</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
