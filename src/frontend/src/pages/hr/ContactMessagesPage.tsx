import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllContactMessages } from '@/hooks/useQueries';
import ContactMessageList from '@/components/contact/ContactMessageList';
import { Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactMessagesPage() {
  const { data: messages, isLoading } = useGetAllContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Contact Messages</h2>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Messages</CardTitle>
          <CardDescription>
            Messages submitted through the contact form
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            <ContactMessageList messages={messages} />
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Messages</h3>
              <p className="text-muted-foreground">
                Contact form submissions will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
