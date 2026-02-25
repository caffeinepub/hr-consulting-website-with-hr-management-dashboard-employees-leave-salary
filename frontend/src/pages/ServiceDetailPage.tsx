import { useParams, useNavigate } from '@tanstack/react-router';
import { getServiceBySlug } from '@/data/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams({ strict: false });
  const navigate = useNavigate();
  const service = getServiceBySlug(slug as string);

  if (!service) {
    return (
      <div className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the service you're looking for. It may have been moved or doesn't exist.
            </p>
            <Button onClick={() => navigate({ to: '/services' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/services' })}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>

          <Card className="motion-safe:animate-fade-in">
            <CardHeader>
              <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center mb-6 motion-safe:animate-scale-in">
                <Icon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-4xl md:text-5xl mb-4">{service.title}</CardTitle>
              <p className="text-lg text-muted-foreground">{service.description}</p>
            </CardHeader>

            <CardContent className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <div className="grid gap-4">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 motion-safe:hover:bg-muted transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
                <p className="text-muted-foreground mb-6">
                  Ready to transform your HR operations? Contact us today to learn more about how our {service.title.toLowerCase()} can benefit your organization.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" onClick={() => navigate({ to: '/contact' })}>
                    Contact Us
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate({ to: '/services' })}
                  >
                    View All Services
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
