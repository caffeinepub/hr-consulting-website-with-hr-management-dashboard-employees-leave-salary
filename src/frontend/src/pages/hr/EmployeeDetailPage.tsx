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
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <Card>
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/hr/employees' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">{employee.name}</h2>
          <p className="text-muted-foreground">
            Joined {formatDate(Number(employee.joiningDate))}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="edit">Edit Details</TabsTrigger>
        </TabsList>

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
                  <p className="font-medium">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joining Date</p>
                  <p className="font-medium">{formatDate(Number(employee.joiningDate))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PF Details</p>
                  <p className="font-medium">{employee.pfDetails}</p>
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
