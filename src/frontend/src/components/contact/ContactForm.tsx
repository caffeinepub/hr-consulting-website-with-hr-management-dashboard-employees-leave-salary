import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSubmitContactMessage } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submitMutation = useSubmitContactMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await submitMutation.mutateAsync({ name, email, message });
      toast.success('Message sent successfully! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name *
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          disabled={submitMutation.isPending}
          className="transition-all duration-200 motion-safe:hover:border-primary/50 motion-safe:focus:scale-[1.01] motion-reduce:focus:scale-100 focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          disabled={submitMutation.isPending}
          className="transition-all duration-200 motion-safe:hover:border-primary/50 motion-safe:focus:scale-[1.01] motion-reduce:focus:scale-100 focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message *
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us how we can help you..."
          rows={6}
          required
          disabled={submitMutation.isPending}
          className="transition-all duration-200 motion-safe:hover:border-primary/50 motion-safe:focus:scale-[1.01] motion-reduce:focus:scale-100 focus-visible:ring-2 focus-visible:ring-primary resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={submitMutation.isPending}
        className="w-full transition-all duration-300 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100 motion-safe:hover:shadow-lg motion-reduce:hover:shadow-none"
      >
        {submitMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
