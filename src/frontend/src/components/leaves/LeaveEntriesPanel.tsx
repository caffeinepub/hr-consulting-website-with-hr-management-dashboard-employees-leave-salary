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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>
                Track and manage employee leave entries
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Leave Entry</DialogTitle>
                </DialogHeader>
                <LeaveEntryForm
                  employeeId={employeeId}
                  onSuccess={() => setDialogOpen(false)}
                />
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
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : leaveEntries && leaveEntries.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveEntries.map((entry) => (
                    <TableRow key={Number(entry.id)}>
                      <TableCell>{formatDate(Number(entry.startDate))}</TableCell>
                      <TableCell>{formatDate(Number(entry.endDate))}</TableCell>
                      <TableCell>{entry.reason}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {entry.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Leave Entries</h3>
              <p className="text-muted-foreground">
                Add leave entries to track employee absences.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
