import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitMyTimeOffRequest } from '@/hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TimeOffRequestForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');

  const submitMutation = useSubmitMyTimeOffRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !leaveType || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    if (endTimestamp < startTimestamp) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        startDate: BigInt(startTimestamp * 1000000),
        endDate: BigInt(endTimestamp * 1000000),
        leaveType,
        reason,
      });

      toast.success('Time off request submitted successfully');
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setLeaveType('');
      setReason('');
    } catch (error: any) {
      console.error('Failed to submit time off request:', error);
      toast.error(error.message || 'Failed to submit time off request');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
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
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="leaveType">Leave Type</Label>
        <Select value={leaveType} onValueChange={setLeaveType} required>
          <SelectTrigger id="leaveType">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sick Leave">Sick Leave</SelectItem>
            <SelectItem value="Casual Leave">Casual Leave</SelectItem>
            <SelectItem value="Annual Leave">Annual Leave</SelectItem>
            <SelectItem value="Personal Leave">Personal Leave</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for your time off request"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={submitMutation.isPending} className="w-full">
        {submitMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </Button>
    </form>
  );
}
