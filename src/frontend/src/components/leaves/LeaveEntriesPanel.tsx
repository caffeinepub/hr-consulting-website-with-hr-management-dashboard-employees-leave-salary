import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetEmployeeLeaveEntries } from '@/hooks/useQueries';
import LeaveEntryForm from './LeaveEntryForm';
import { Plus, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/utils/formatters';

interface LeaveEntriesPanelProps {
  employeeId: number;
}

export default function LeaveEntriesPanel({ employeeId }: LeaveEntriesPanelProps) {
  const { data: leaveEntries, isLoading } = useGetEmployeeLeaveEntries(employeeId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalLeavesTaken = leaveEntries?.length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>
                Track and manage employee leave entries
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Leave
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col gap-0 p-0">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 shrink-0 border-b">
                  <DialogTitle>Add Leave Entry</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
                  <LeaveEntryForm
                    employeeId={employeeId}
                    onSuccess={() => setDialogOpen(false)}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Leaves Taken</p>
            <p className="text-2xl font-bold">{totalLeavesTaken} days</p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : leaveEntries && leaveEntries.length > 0 ? (
            <div className="w-full rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Start Date</TableHead>
                      <TableHead className="min-w-[120px]">End Date</TableHead>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[200px]">Reason</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveEntries.map((entry) => (
                      <TableRow key={Number(entry.id)}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(Number(entry.startDate))}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(Number(entry.endDate))}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{entry.leaveType}</TableCell>
                        <TableCell className="break-words max-w-[300px]">{entry.reason}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {entry.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No leave entries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
