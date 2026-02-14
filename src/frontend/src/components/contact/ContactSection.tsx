import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from './ContactForm';
import { useInView } from '@/hooks/useInView';

interface ContactSectionProps {
  showTitle?: boolean;
  showDescription?: boolean;
  showBusinessHours?: boolean;
}

export default function ContactSection({
  showTitle = true,
  showDescription = true,
  showBusinessHours = true,
}: ContactSectionProps) {
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1 });
  const { ref: formRef, isInView: formInView } = useInView({ threshold: 0.1 });
  const { ref: infoRef, isInView: infoInView } = useInView({ threshold: 0.1 });

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@hrsolutions.com',
      href: 'mailto:info@hrsolutions.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
    },
    {
      icon: MapPin,
      label: 'Office',
      value: 'Nagpur, Maharashtra, India',
      href: null,
    },
  ];

  return (
    <div ref={sectionRef}>
      {showTitle && (
        <div
          className={`text-center mb-12 transition-all duration-700 motion-safe:transform ${
            sectionInView
              ? 'opacity-100 motion-safe:translate-y-0'
              : 'opacity-0 motion-safe:translate-y-8'
          } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          {showDescription && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Form */}
        <div
          ref={formRef}
          className={`transition-all duration-700 delay-100 motion-safe:transform ${
            formInView
              ? 'opacity-100 motion-safe:translate-x-0'
              : 'opacity-0 motion-safe:-translate-x-8'
          } motion-reduce:opacity-100 motion-reduce:translate-x-0`}
        >
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 motion-safe:hover:shadow-lg motion-reduce:hover:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div
          ref={infoRef}
          className={`space-y-6 transition-all duration-700 delay-200 motion-safe:transform ${
            infoInView
              ? 'opacity-100 motion-safe:translate-x-0'
              : 'opacity-0 motion-safe:translate-x-8'
          } motion-reduce:opacity-100 motion-reduce:translate-x-0`}
        >
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 motion-safe:hover:shadow-lg motion-reduce:hover:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((detail, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-3 rounded-lg transition-all duration-300 motion-safe:hover:bg-muted/50 motion-safe:hover:translate-x-2 motion-reduce:hover:bg-muted/50 motion-reduce:hover:translate-x-0 ${
                    infoInView
                      ? 'opacity-100 motion-safe:translate-y-0'
                      : 'opacity-0 motion-safe:translate-y-4'
                  } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
                  style={{
                    transitionDelay: `${300 + index * 100}ms`,
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 motion-safe:group-hover:scale-110 transition-transform duration-300">
                    <detail.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground mb-1">{detail.label}</div>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <div className="text-muted-foreground break-words">{detail.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {showBusinessHours && (
                <div
                  className={`flex items-start gap-4 p-3 rounded-lg transition-all duration-300 motion-safe:hover:bg-muted/50 motion-safe:hover:translate-x-2 motion-reduce:hover:bg-muted/50 motion-reduce:hover:translate-x-0 ${
                    infoInView
                      ? 'opacity-100 motion-safe:translate-y-0'
                      : 'opacity-0 motion-safe:translate-y-4'
                  } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
                  style={{
                    transitionDelay: `${300 + contactInfo.length * 100}ms`,
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 motion-safe:group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground mb-1">Business Hours</div>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                      <div>Saturday: 10:00 AM - 2:00 PM</div>
                      <div>Sunday: Closed</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
