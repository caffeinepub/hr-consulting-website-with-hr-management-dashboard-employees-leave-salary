import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllTasks } from '@/hooks/useQueries';
import TasksTable from '@/components/tasks/TasksTable';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useGetAllTasks();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground">Assign and manage employee tasks</p>
        </div>
        <Button className="w-full sm:w-auto shrink-0" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tasks. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Card */}
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            View and manage all assigned tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table Section */}
          <div className="w-full">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : tasks && tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No tasks found. Create your first task to get started.</p>
              </div>
            ) : (
              <TasksTable tasks={tasks || []} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
