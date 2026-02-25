import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { LeaveEntry, LeaveSummary } from '@/backend';
import { formatDate } from '@/utils/formatters';

interface MyLeavePanelProps {
  leaveEntries: LeaveEntry[];
  leaveSummary?: LeaveSummary;
  isLoading: boolean;
}

export default function MyLeavePanel({ leaveEntries, leaveSummary, isLoading }: MyLeavePanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Available leave days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {leaveSummary ? Number(leaveSummary.leaveBalance) : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Leaves Taken</CardTitle>
            <CardDescription>This year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">
              {leaveSummary ? Number(leaveSummary.totalLeavesTaken) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>Your leave requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {leaveEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leave entries found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveEntries.map((entry) => (
                    <TableRow key={Number(entry.id)}>
                      <TableCell className="font-medium">{entry.leaveType}</TableCell>
                      <TableCell>{formatDate(Number(entry.startDate))}</TableCell>
                      <TableCell>{formatDate(Number(entry.endDate))}</TableCell>
                      <TableCell className="max-w-xs break-words">{entry.reason}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(entry.status)}>{entry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
