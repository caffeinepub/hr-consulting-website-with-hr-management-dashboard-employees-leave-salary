import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function ContactMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Contact Messages</h2>
        <p className="text-muted-foreground">View messages from the contact form</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Messages</CardTitle>
          </div>
          <CardDescription>Contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Contact message viewing is not yet implemented</p>
            <p className="text-sm mt-2">Backend support for querying contact messages is required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
