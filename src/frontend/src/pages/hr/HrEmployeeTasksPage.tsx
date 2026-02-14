import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEmployee, useGetEmployeeTasks } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ListTodo } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export default function HrEmployeeTasksPage() {
  const { employeeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const employeeIdNum = employeeId ? parseInt(employeeId, 10) : 0;

  const { data: employee, isLoading: employeeLoading } = useGetEmployee(employeeIdNum);
  const { data: tasks = [], isLoading: tasksLoading } = useGetEmployeeTasks(employeeIdNum);

  if (employeeLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Employee not found</p>
            <Button onClick={() => navigate({ to: '/hr/employees' })} className="mt-4">
              Back to Employees
            </Button>
          </CardContent>
        </Card>
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/hr/employees/$employeeId', params: { employeeId: String(employeeIdNum) } })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tasks for {employee.name}</h1>
          <p className="text-muted-foreground">View all tasks assigned to this employee</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            <CardTitle>Assigned Tasks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks assigned to this employee
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={Number(task.id)} className="border rounded-lg p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.isComplete && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Due: {formatDate(Number(task.dueDate))}</span>
                    <span>Created: {formatDate(Number(task.createdAt))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
