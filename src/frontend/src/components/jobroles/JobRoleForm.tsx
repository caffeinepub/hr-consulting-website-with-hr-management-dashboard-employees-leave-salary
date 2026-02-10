import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateJobRole } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface JobRoleFormProps {
  onSuccess?: () => void;
}

export default function JobRoleForm({ onSuccess }: JobRoleFormProps) {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [description, setDescription] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const createMutation = useCreateJobRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !city.trim() || !country.trim() || !description.trim() || !linkedInUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!linkedInUrl.includes('linkedin.com')) {
      toast.error('Please enter a valid LinkedIn URL');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title,
        location: { city, country },
        description,
        linkedInUrl,
      });

      toast.success('Job role created successfully!');
      setTitle('');
      setCity('');
      setCountry('India');
      setDescription('');
      setLinkedInUrl('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create job role');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Job Title *</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Senior HR Manager"
          required
          disabled={createMutation.isPending}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
            required
            disabled={createMutation.isPending}
          />
        </div>
        <div>
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="India"
            required
            disabled={createMutation.isPending}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={5}
          required
          disabled={createMutation.isPending}
        />
      </div>
      <div>
        <Label htmlFor="linkedInUrl">LinkedIn URL *</Label>
        <Input
          id="linkedInUrl"
          type="url"
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          placeholder="https://www.linkedin.com/jobs/..."
          required
          disabled={createMutation.isPending}
        />
      </div>
      <Button type="submit" disabled={createMutation.isPending} className="w-full">
        {createMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Job Role'
        )}
      </Button>
    </form>
  );
}
