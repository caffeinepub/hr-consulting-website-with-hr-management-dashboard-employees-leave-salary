import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddLeaveEntry } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LeaveEntryFormProps {
  employeeId: number;
  onSuccess?: () => void;
}

export default function LeaveEntryForm({ employeeId, onSuccess }: LeaveEntryFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const addMutation = useAddLeaveEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const startDateNano = BigInt(start.getTime()) * BigInt(1000000);
      const endDateNano = BigInt(end.getTime()) * BigInt(1000000);

      await addMutation.mutateAsync({
        employeeId: BigInt(employeeId),
        startDate: startDateNano,
        endDate: endDateNano,
        reason,
      });

      toast.success('Leave entry added successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add leave entry');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="startDate">Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          disabled={addMutation.isPending}
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date *</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          disabled={addMutation.isPending}
        />
      </div>
      <div>
        <Label htmlFor="reason">Reason *</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for leave..."
          rows={3}
          required
          disabled={addMutation.isPending}
        />
      </div>
      <Button type="submit" disabled={addMutation.isPending} className="w-full">
        {addMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Leave Entry'
        )}
      </Button>
    </form>
  );
}
