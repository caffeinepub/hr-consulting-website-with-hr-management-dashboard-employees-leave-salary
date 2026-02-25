import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Service } from '@/data/services';

interface ServiceCardProps {
  service: Service;
  onQuickView: () => void;
}

export default function ServiceCard({ service, onQuickView }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const Icon = service.icon;

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView();
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: `/services/${service.slug}` });
  };

  const handleComplianceFirst = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: '/compliance-first' });
  };

  return (
    <Card
      className="h-full cursor-pointer transition-all duration-300 motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-110">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>{service.title}</span>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{service.description}</p>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Key Features:</h4>
              <ul className="space-y-1">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickView}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </Button>
          <Button
            size="sm"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
          {service.slug === 'compliance-legal' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleComplianceFirst}
              className="flex items-center gap-2"
            >
              Compliance First
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
