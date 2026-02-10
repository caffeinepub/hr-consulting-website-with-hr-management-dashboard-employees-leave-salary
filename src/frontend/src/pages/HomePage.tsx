import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Users, TrendingUp, Shield, Briefcase } from 'lucide-react';
import { useEffect } from 'react';
import { scrollToSection } from '@/utils/scrollToSection';
import ContactSection from '@/components/contact/ContactSection';
import { useGetOpenJobRolesCount } from '@/hooks/useQueries';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: openJobsCount } = useGetOpenJobRolesCount();

  const features = [
    {
      icon: Users,
      title: 'HR Consulting',
      description: 'Expert guidance for all your human resource needs',
    },
    {
      icon: TrendingUp,
      title: 'Payroll Management',
      description: 'Streamlined payroll processing and compliance',
    },
    {
      icon: Shield,
      title: 'Compliance & Legal',
      description: 'Stay compliant with labor laws and regulations',
    },
    {
      icon: Briefcase,
      title: 'Recruitment Services',
      description: 'Find the right talent for your organization',
    },
  ];

  // Handle hash-based navigation on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # prefix
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          scrollToSection(hash);
        }, 100);
      }
    };

    // Scroll on initial load if hash exists
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      {/* Home Section */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Workforce Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional HR consulting and management services tailored for modern businesses in India
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => {
                scrollToSection('contact');
                window.history.pushState({}, '', '#contact');
              }}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                scrollToSection('services');
                window.history.pushState({}, '', '#services');
              }}>
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted/40 scroll-mt-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">About Us</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                HR Solutions is a leading HR consulting firm dedicated to transforming workforce management for businesses across India. With years of expertise in human resources, we provide comprehensive solutions that help organizations optimize their HR operations and achieve their strategic goals.
              </p>
              <p>
                Our team of experienced professionals brings deep industry knowledge and a commitment to excellence. We understand the unique challenges faced by modern businesses and deliver tailored solutions that drive real results.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      To empower businesses with innovative HR solutions that foster growth and success
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      To be the most trusted HR partner for businesses across India
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Our Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Excellence, integrity, innovation, and client success
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 scroll-mt-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive HR solutions to help your business thrive
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/services' })}>
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Recruitment Section */}
      <section id="recruitment" className="py-16 bg-muted/40 scroll-mt-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Team</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're always looking for talented individuals to join our growing team. Explore our current openings and take the next step in your career.
            </p>
            {openJobsCount !== undefined && openJobsCount > 0 && (
              <div className="mb-8">
                <Card className="inline-block">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary mb-2">{Number(openJobsCount)}</div>
                    <div className="text-sm text-muted-foreground">Open Positions</div>
                  </CardContent>
                </Card>
              </div>
            )}
            <Button size="lg" onClick={() => navigate({ to: '/recruitment' })}>
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 scroll-mt-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <ContactSection showBusinessHours={false} />
          </div>
        </div>
      </section>
    </div>
  );
}
