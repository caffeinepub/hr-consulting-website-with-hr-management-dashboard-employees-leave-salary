import { Building2, Users, FileCheck, UserPlus, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ServiceCard from '@/components/ServiceCard';
import ServiceQuickViewModal from '@/components/services/ServiceQuickViewModal';
import { services, Service } from '@/data/services';
import ContactSection from '@/components/contact/ContactSection';
import LeadershipCard from '@/components/LeadershipCard';
import HoverSlideInText from '@/components/animations/HoverSlideInText';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useInView({ threshold: 0.2, triggerOnce: true });
  const servicesRef = useInView({ threshold: 0.2, triggerOnce: true });
  const recruitmentRef = useInView({ threshold: 0.2, triggerOnce: true });
  const contactRef = useInView({ threshold: 0.2, triggerOnce: true });

  const [heroWords, setHeroWords] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const headline = "Transform Your Workforce with Expert HR Solutions";
    const words = headline.split(' ');
    setHeroWords(words);
  }, []);

  const handleQuickView = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCardClick = (title: string) => {
    if (title === 'Expert Team') {
      navigate({ to: '/team' });
    } else if (title === 'Compliance First') {
      navigate({ to: '/compliance-first' });
    } else if (title === 'Tailored Solutions') {
      navigate({ to: '/tailored-solutions' });
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, title: string) => {
    if ((title === 'Expert Team' || title === 'Compliance First' || title === 'Tailored Solutions') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (title === 'Expert Team') {
        navigate({ to: '/team' });
      } else if (title === 'Compliance First') {
        navigate({ to: '/compliance-first' });
      } else if (title === 'Tailored Solutions') {
        navigate({ to: '/tailored-solutions' });
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#131E3A' }}>
      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            {heroWords.map((word, index) => {
              // Apply HoverSlideInText to "HR Solutions" only
              if (word === 'HR' || word === 'Solutions') {
                return (
                  <HoverSlideInText
                    key={index}
                    delay={index * 0.1}
                    className="mr-3"
                  >
                    {word}
                  </HoverSlideInText>
                );
              }
              return (
                <span
                  key={index}
                  className="hero-word-animate inline-block mr-3"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto motion-safe:animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            Comprehensive HR consulting, payroll management, and recruitment services tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center motion-safe:animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <a
              href="#contact"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 motion-safe:transition-all motion-safe:duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started
            </a>
            <a
              href="#services"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/90 motion-safe:transition-all motion-safe:duration-300 shadow-lg"
            >
              Our Services
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef.ref}
        className="py-24 scroll-mt-16 about-section-bg"
      >
        <div className="container px-4">
          <div className={`text-center mb-16 ${aboutRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Trusted HR Partner
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive HR solutions that help businesses streamline operations, ensure compliance, and build exceptional teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Seasoned HR professionals with decades of combined experience across industries.',
              },
              {
                icon: FileCheck,
                title: 'Compliance First',
                description: 'Stay ahead of regulations with our proactive compliance management services.',
              },
              {
                icon: UserPlus,
                title: 'Tailored Solutions',
                description: 'Customized HR strategies designed to meet your unique business requirements.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`about-card p-8 rounded-2xl border border-border/50 hover:border-primary/50 motion-safe:transition-all motion-safe:duration-300 hover:shadow-xl hover:shadow-primary/10 ${
                  aboutRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
                } ${(item.title === 'Expert Team' || item.title === 'Compliance First' || item.title === 'Tailored Solutions') ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => handleCardClick(item.title)}
                onKeyDown={(e) => handleCardKeyDown(e, item.title)}
                tabIndex={(item.title === 'Expert Team' || item.title === 'Compliance First' || item.title === 'Tailored Solutions') ? 0 : undefined}
                role={(item.title === 'Expert Team' || item.title === 'Compliance First' || item.title === 'Tailored Solutions') ? 'button' : undefined}
                aria-label={(item.title === 'Expert Team' || item.title === 'Compliance First' || item.title === 'Tailored Solutions') ? `View ${item.title} page` : undefined}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 mb-6 ring-4 ring-primary/10">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>

          <div className={`${aboutRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold uppercase tracking-wider text-primary">Leadership</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Meet Our HR Director</h3>
              <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>
            <div className="max-w-2xl mx-auto">
              <LeadershipCard
                name="Vishwesh Shivankar"
                title="HR Director"
                description="With over 15 years of experience in human resources management, Vishwesh leads our team with a vision to transform workplace cultures and drive organizational excellence. His expertise spans talent acquisition, employee relations, and strategic HR planning."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        ref={servicesRef.ref}
        className="py-24 scroll-mt-16"
      >
        <div className="container px-4">
          <div className={`text-center mb-16 ${servicesRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive HR solutions designed to help your business thrive
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.slug}
                className={servicesRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <ServiceCard 
                  service={service} 
                  onQuickView={() => handleQuickView(service)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Section */}
      <section
        id="recruitment"
        ref={recruitmentRef.ref}
        className="py-24 bg-muted/30 scroll-mt-16"
      >
        <div className="container px-4">
          <div className={`text-center mb-16 ${recruitmentRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore exciting career opportunities and become part of our growing team
            </p>
          </div>
          <div className={`text-center ${recruitmentRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <a
              href="/recruitment"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 motion-safe:transition-all motion-safe:duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30"
            >
              <UserPlus className="h-5 w-5" />
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 scroll-mt-16"
      >
        <div className="container px-4">
          <ContactSection
            showTitle={true}
            showDescription={true}
            showBusinessHours={false}
          />
        </div>
      </section>

      {/* Service Quick View Modal */}
      <ServiceQuickViewModal
        service={selectedService}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
