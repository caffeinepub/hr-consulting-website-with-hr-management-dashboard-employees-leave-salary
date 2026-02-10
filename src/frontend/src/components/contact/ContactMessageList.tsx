import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContactMessage } from '@/backend';
import { formatDate } from '@/utils/formatters';
import { Mail } from 'lucide-react';

interface ContactMessageListProps {
  messages: ContactMessage[];
}

export default function ContactMessageList({ messages }: ContactMessageListProps) {
  const sortedMessages = [...messages].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return (
    <div className="space-y-4">
      {sortedMessages.map((message) => (
        <Card key={Number(message.id)}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {message.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {message.email} • {formatDate(Number(message.timestamp))}
                </CardDescription>
              </div>
              <Badge variant={message.isOpen ? 'default' : 'secondary'}>
                {message.isOpen ? 'New' : 'Read'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{message.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
