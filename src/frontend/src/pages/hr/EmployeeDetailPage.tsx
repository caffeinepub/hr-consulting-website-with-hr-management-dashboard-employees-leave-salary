import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetEmployee } from '@/hooks/useQueries';
import { ArrowLeft, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import LeaveEntriesPanel from '@/components/leaves/LeaveEntriesPanel';
import SalaryBreakdownCard from '@/components/salary/SalaryBreakdownCard';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function EmployeeDetailPage() {
  const { employeeId } = useParams({ from: '/hr/employees/$employeeId' });
  const navigate = useNavigate();
  const { data: employee, isLoading } = useGetEmployee(Number(employeeId));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Employee Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The employee you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate({ to: '/hr/employees' })}>
            Back to Employees
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/hr/employees' })}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold break-words">{employee.name}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Joined {formatDate(Number(employee.joiningDate))}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="overview" className="flex-1 sm:flex-initial">Overview</TabsTrigger>
            <TabsTrigger value="leaves" className="flex-1 sm:flex-initial">Leave Management</TabsTrigger>
            <TabsTrigger value="edit" className="flex-1 sm:flex-initial">Edit Details</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{Number(employee.id)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium break-words">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joining Date</p>
                  <p className="font-medium">{formatDate(Number(employee.joiningDate))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PF Details</p>
                  <p className="font-medium break-words">{employee.pfDetails}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leave Balance</p>
                  <p className="font-medium">{Number(employee.leaveBalance)} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Leaves Taken</p>
                  <p className="font-medium">{Number(employee.totalLeavesTaken)} days</p>
                </div>
              </CardContent>
            </Card>

            <SalaryBreakdownCard employee={employee} />
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <LeaveEntriesPanel employeeId={Number(employee.id)} />
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Employee Details</CardTitle>
              <CardDescription>
                Update employee information and salary details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeForm employee={employee} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
