import { useQuery } from '@tanstack/react-query';

export interface ComplianceArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  source?: string;
  date?: string;
}

async function fetchComplianceNews(): Promise<ComplianceArticle[]> {
  // Using The Guardian API which supports CORS and provides legal/compliance news
  // Free tier allows up to 500 requests per day without API key
  const apiUrl = 'https://content.guardianapis.com/search';
  const params = new URLSearchParams({
    q: 'compliance OR legal OR regulation OR "labor law"',
    section: 'law|business',
    'page-size': '12',
    'show-fields': 'trailText,byline',
    'order-by': 'newest',
    'api-key': 'test', // Public test key for development
  });

  const response = await fetch(`${apiUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch compliance news');
  }

  const data = await response.json();

  if (!data.response || !data.response.results) {
    return [];
  }

  return data.response.results.map((article: any) => ({
    id: article.id,
    title: article.webTitle,
    description: article.fields?.trailText || undefined,
    url: article.webUrl,
    source: 'The Guardian',
    date: article.webPublicationDate,
  }));
}

export function useComplianceFirstFeed() {
  return useQuery<ComplianceArticle[]>({
    queryKey: ['complianceFirstFeed'],
    queryFn: fetchComplianceNews,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
