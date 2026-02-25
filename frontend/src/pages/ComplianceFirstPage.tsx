import { useComplianceFirstFeed } from '@/hooks/useComplianceFirstFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function ComplianceFirstPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useComplianceFirstFeed();
  const headerRef = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div style={{ backgroundColor: '#131E3A' }} className="min-h-screen py-24">
      <div className="container px-4">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={`text-center mb-16 ${headerRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Compliance First
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest compliance and legal news from trusted sources
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading compliance news...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Unable to load compliance news</h3>
                    <p className="text-muted-foreground mb-4">
                      We encountered an issue while fetching the latest compliance and legal updates. Please try again.
                    </p>
                    <Button
                      onClick={() => refetch()}
                      disabled={isFetching}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                      {isFetching ? 'Retrying...' : 'Retry'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && data && data.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles available</h3>
            <p className="text-muted-foreground mb-6">
              There are currently no compliance or legal articles to display.
            </p>
            <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && !isError && data && data.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
              <Card
                key={item.id}
                className={`h-full flex flex-col motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-300 ${
                  headerRef.isInView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-3">{item.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-2">
                    {item.source && (
                      <span className="font-medium text-primary">{item.source}</span>
                    )}
                    {item.date && (
                      <span>• {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {item.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {item.description}
                    </p>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mt-auto"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read Article
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
