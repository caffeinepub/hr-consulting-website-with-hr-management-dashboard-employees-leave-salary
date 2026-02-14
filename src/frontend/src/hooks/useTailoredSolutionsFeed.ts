import { useQuery } from '@tanstack/react-query';

export interface TailoredSolutionArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  source?: string;
  date?: string;
}

async function fetchTailoredSolutions(): Promise<TailoredSolutionArticle[]> {
  // Using The Guardian API which supports CORS and provides HR/business solutions content
  // Free tier allows up to 500 requests per day without API key
  const apiUrl = 'https://content.guardianapis.com/search';
  const params = new URLSearchParams({
    q: 'HR OR "human resources" OR "workplace solutions" OR "employee management" OR "talent management"',
    section: 'business|technology|careers',
    'page-size': '12',
    'show-fields': 'trailText,byline',
    'order-by': 'newest',
    'api-key': 'test', // Public test key for development
  });

  const response = await fetch(`${apiUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tailored solutions');
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

export function useTailoredSolutionsFeed() {
  return useQuery<TailoredSolutionArticle[]>({
    queryKey: ['tailoredSolutionsFeed'],
    queryFn: fetchTailoredSolutions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
