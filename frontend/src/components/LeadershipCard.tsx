import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface LeadershipCardProps {
  name: string;
  title: string;
  description: string;
}

export default function LeadershipCard({ name, title, description }: LeadershipCardProps) {
  return (
    <Card className="about-card border-2 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-300">
      <CardHeader className="pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/10">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl md:text-3xl mb-2">{name}</CardTitle>
            <p className="text-lg md:text-xl text-primary font-medium">{title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
