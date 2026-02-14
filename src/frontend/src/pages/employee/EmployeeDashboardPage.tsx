import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetAssociatedEmployee, useGetEmployeeTasks, useGetEmployeePayslips } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SalaryBreakdownCard from '@/components/salary/SalaryBreakdownCard';
import PayslipsList from '@/components/payslips/PayslipsList';
import { formatDate } from '@/utils/formatters';
import { ListTodo, DollarSign, FileText, LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

export default function EmployeeDashboardPage() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useGetAssociatedEmployee();
  const { data: tasks = [], isLoading: tasksLoading } = useGetEmployeeTasks(employee?.id ? Number(employee.id) : 0);
  const { data: payslips = [], isLoading: payslipsLoading } = useGetEmployeePayslips(employee?.id ? Number(employee.id) : 0);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  if (employeeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131E3A' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (employeeError || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#131E3A' }}>
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Employee Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Your account is not associated with an employee profile. Please contact HR to set up your profile.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
                Go to Home
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="flex-1">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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
    <div className="min-h-screen" style={{ backgroundColor: '#131E3A' }}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {employee.name}</h1>
            <p className="text-gray-400">Your employee dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate({ to: '/' })} variant="outline" size="sm">
              Back to Site
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                <CardTitle>My Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks assigned to you
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salary Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-white" />
              <h2 className="text-xl font-semibold text-white">Salary Details</h2>
            </div>
            <SalaryBreakdownCard employee={employee} />
          </div>

          {/* Payslips Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>My Payslips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {payslipsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading payslips...</p>
                </div>
              ) : (
                <PayslipsList payslips={payslips} employeeName={employee.name} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
