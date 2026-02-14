import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddLeaveEntry } from '@/hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface LeaveEntryFormProps {
  employeeId: number;
  onSuccess?: () => void;
}

export default function LeaveEntryForm({ employeeId, onSuccess }: LeaveEntryFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const addLeaveEntry = useAddLeaveEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !reason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    if (endTimestamp < startTimestamp) {
      alert('End date must be after start date');
      return;
    }

    try {
      await addLeaveEntry.mutateAsync({
        employeeId: BigInt(employeeId),
        startDate: BigInt(startTimestamp * 1000000),
        endDate: BigInt(endTimestamp * 1000000),
        reason: reason.trim(),
      });
      
      setStartDate('');
      setEndDate('');
      setReason('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add leave entry:', error);
      alert('Failed to add leave entry. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for leave..."
          required
          rows={4}
          className="w-full resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={addLeaveEntry.isPending}
        className="w-full"
      >
        {addLeaveEntry.isPending ? (
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
