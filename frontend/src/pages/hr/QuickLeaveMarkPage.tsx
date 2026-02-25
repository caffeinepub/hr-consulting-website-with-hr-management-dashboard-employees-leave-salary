import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllEmployees, useQuickLeaveMark } from '@/hooks/useQueries';
import { Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuickLeaveMarkPage() {
  const { data: employees, isLoading: employeesLoading } = useGetAllEmployees();
  const quickLeaveMark = useQuickLeaveMark();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId || !leaveDate || !leaveType || !reason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const timestamp = new Date(leaveDate).getTime();

    try {
      await quickLeaveMark.mutateAsync({
        employeeId: BigInt(selectedEmployeeId),
        leaveDate: BigInt(timestamp * 1000000),
        leaveType,
        reason: reason.trim(),
      });
      
      setSelectedEmployeeId('');
      setLeaveDate('');
      setLeaveType('');
      setReason('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to mark leave:', error);
      alert('Failed to mark leave. Please try again.');
    }
  };

  if (employeesLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Quick Leave Mark</h2>
        <p className="text-sm text-muted-foreground">
          Quickly mark a single day leave for an employee
        </p>
      </div>

      {showSuccess && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">Leave marked successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mark Leave
          </CardTitle>
          <CardDescription>
            Select an employee and enter leave details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger id="employee" className="w-full">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp) => (
                    <SelectItem key={Number(emp.id)} value={String(emp.id)}>
                      {emp.name} (ID: {Number(emp.id)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveDate">Leave Date</Label>
              <Input
                id="leaveDate"
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leaveType" className="w-full">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
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
                placeholder="Enter reason for leave..."
                required
                rows={4}
                className="w-full resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={quickLeaveMark.isPending}
              className="w-full"
            >
              {quickLeaveMark.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Marking Leave...
                </>
              ) : (
                'Mark Leave'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
