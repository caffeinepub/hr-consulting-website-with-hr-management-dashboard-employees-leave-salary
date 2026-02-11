import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllEmployees, useQuickLeaveMark } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { CalendarCheck, Loader2 } from 'lucide-react';

export default function QuickLeaveMarkPage() {
  const { data: employees = [], isLoading: employeesLoading } = useGetAllEmployees();
  const quickLeaveMarkMutation = useQuickLeaveMark();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [leaveDate, setLeaveDate] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedEmployeeId) {
      toast.error('Please select an employee');
      return;
    }
    if (!leaveDate) {
      toast.error('Please select a leave date');
      return;
    }
    if (!leaveType) {
      toast.error('Please select a leave type');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for the leave');
      return;
    }

    try {
      const leaveDateTimestamp = BigInt(new Date(leaveDate).getTime()) * BigInt(1000000);

      await quickLeaveMarkMutation.mutateAsync({
        employeeId: BigInt(selectedEmployeeId),
        leaveDate: leaveDateTimestamp,
        leaveType,
        reason: reason.trim(),
      });

      toast.success('Leave marked successfully');

      // Reset form
      setSelectedEmployeeId('');
      setLeaveDate('');
      setLeaveType('');
      setReason('');
    } catch (error: any) {
      console.error('Error marking leave:', error);
      const errorMessage = error?.message || 'Failed to mark leave';
      if (errorMessage.includes('Employee not found')) {
        toast.error('Employee not found');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('You do not have permission to mark leaves');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Quick Leave Mark</h1>
          <p className="text-muted-foreground">Quickly mark a leave for any employee</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Leave Entry</CardTitle>
          <CardDescription>
            Select an employee and enter leave details to quickly mark a leave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
                disabled={employeesLoading}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder={employeesLoading ? 'Loading employees...' : 'Select an employee'} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id.toString()} value={employee.id.toString()}>
                      {employee.name} (ID: {employee.id.toString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveDate">Leave Date *</Label>
              <Input
                id="leaveDate"
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                  <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                  <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                  <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for leave"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={quickLeaveMarkMutation.isPending}
                className="flex-1"
              >
                {quickLeaveMarkMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Marking Leave...
                  </>
                ) : (
                  'Mark Leave'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedEmployeeId('');
                  setLeaveDate('');
                  setLeaveType('');
                  setReason('');
                }}
                disabled={quickLeaveMarkMutation.isPending}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
