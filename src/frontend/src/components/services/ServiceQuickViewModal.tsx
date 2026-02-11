import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Service } from '@/data/services';
import { ArrowRight } from 'lucide-react';

interface ServiceQuickViewModalProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ServiceQuickViewModal({
  service,
  open,
  onOpenChange,
}: ServiceQuickViewModalProps) {
  const navigate = useNavigate();

  if (!service) return null;

  const Icon = service.icon;

  const handleViewFullDetails = () => {
    onOpenChange(false);
    navigate({ to: `/services/${service.slug}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl motion-reduce:transition-none">
        <DialogHeader>
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-3xl">{service.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {service.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Key Features:</h4>
            <ul className="space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleViewFullDetails} className="flex items-center gap-2">
            View Full Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
