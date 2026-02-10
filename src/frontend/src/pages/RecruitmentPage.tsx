import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Briefcase } from 'lucide-react';
import { useGetAllOpenJobRoles } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecruitmentPage() {
  const { data: jobRoles, isLoading } = useGetAllOpenJobRoles();

  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Current Openings</h1>
          <p className="text-lg text-muted-foreground">
            Explore exciting career opportunities with our clients. We connect talented professionals
            with leading organizations across various industries.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobRoles && jobRoles.length > 0 ? (
            <div className="space-y-6">
              {jobRoles.map((role) => (
                <Card key={Number(role.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-base">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {role.location.city}, {role.location.country}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 whitespace-pre-line">
                      {role.description}
                    </p>
                    <Button asChild>
                      <a
                        href={role.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        View on LinkedIn
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Open Positions</h3>
                <p className="text-muted-foreground">
                  There are currently no open positions. Please check back later for new opportunities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
