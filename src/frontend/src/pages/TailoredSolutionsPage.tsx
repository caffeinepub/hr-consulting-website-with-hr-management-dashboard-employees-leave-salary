import { useTailoredSolutionsFeed } from '@/hooks/useTailoredSolutionsFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, AlertCircle, Lightbulb } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function TailoredSolutionsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useTailoredSolutionsFeed();
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
            Tailored Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover innovative HR strategies and customized solutions from industry experts
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading tailored solutions...</p>
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
                    <h3 className="font-semibold text-lg mb-2">Unable to load tailored solutions</h3>
                    <p className="text-muted-foreground mb-4">
                      We encountered an issue while fetching the latest HR solutions and insights. Please try again.
                    </p>
                    {error && (
                      <p className="text-sm text-muted-foreground/80 mb-4">
                        Error: {error instanceof Error ? error.message : 'Unknown error'}
                      </p>
                    )}
                    <Button
                      onClick={() => refetch()}
                      disabled={isFetching}
                      variant="outline"
                      className="gap-2"
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
            <Lightbulb className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No solutions available</h3>
            <p className="text-muted-foreground">
              Check back soon for the latest HR solutions and insights.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !isError && data && data.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((article, index) => (
              <Card
                key={article.id}
                className="motion-safe:animate-fade-in-up hover:shadow-lg motion-safe:transition-shadow motion-safe:duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {article.title}
                  </CardTitle>
                  {article.source && (
                    <p className="text-sm text-muted-foreground">
                      {article.source}
                      {article.date && ` • ${new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {article.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
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
