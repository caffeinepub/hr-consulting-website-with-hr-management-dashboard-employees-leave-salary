import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { Task } from '@/backend';
import { formatDate } from '@/utils/formatters';

interface MyTasksListProps {
  tasks: Task[];
  isLoading: boolean;
}

export default function MyTasksList({ tasks, isLoading }: MyTasksListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks assigned to you
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={Number(task.id)}
          className="border rounded-lg p-4 space-y-3 hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {task.isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold break-words">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 break-words">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={getPriorityColor(task.priority)} className="shrink-0">
              {task.priority}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Due:</span> {formatDate(Number(task.dueDate))}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              {task.isComplete ? (
                <span className="text-green-600">Completed</span>
              ) : (
                <span className="text-orange-600">Pending</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
