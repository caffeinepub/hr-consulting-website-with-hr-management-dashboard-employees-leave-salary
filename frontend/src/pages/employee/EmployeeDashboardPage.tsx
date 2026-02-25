import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, ClipboardList, FileText, Calendar, BarChart3 } from 'lucide-react';
import {
  useGetCallerUserProfile,
  useGetMyEmployee,
  useGetMyTasks,
  useGetMyLeaveEntriesAndSummary,
  useGetMyPayslips,
} from '@/hooks/useQueries';
import SalaryBreakdownCard from '@/components/salary/SalaryBreakdownCard';
import PayslipsList from '@/components/payslips/PayslipsList';
import TimeOffRequestForm from '@/components/employee/TimeOffRequestForm';
import MyTasksList from '@/components/employee/MyTasksList';
import MyLeavePanel from '@/components/employee/MyLeavePanel';
import { formatDate } from '@/utils/formatters';

export default function EmployeeDashboardPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useGetMyEmployee();
  const { data: tasks, isLoading: tasksLoading } = useGetMyTasks();
  const { data: leaveData, isLoading: leaveLoading } = useGetMyLeaveEntriesAndSummary();
  const { data: payslips, isLoading: payslipsLoading } = useGetMyPayslips();

  const isLoading = profileLoading || employeeLoading;
  const hasError = employeeError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load your employee dashboard. Please try again or contact HR for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-md">
          <AlertDescription>
            No employee record found. Please contact HR for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.name || employee.name}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="payslips" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Payslips</span>
            </TabsTrigger>
            <TabsTrigger value="time-off" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Time Off</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Leave</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="font-medium">{userProfile?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="font-medium">{userProfile?.email || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employee Details</CardTitle>
                  <CardDescription>Your employment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Employee Name</span>
                    <span className="font-medium">{employee.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Joining Date</span>
                    <span className="font-medium">{formatDate(Number(employee.joiningDate))}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Employee ID</span>
                    <span className="font-medium">#{Number(employee.id)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <SalaryBreakdownCard employee={employee} />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Tasks assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                <MyTasksList tasks={tasks || []} isLoading={tasksLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payslips Tab */}
          <TabsContent value="payslips">
            <Card>
              <CardHeader>
                <CardTitle>My Payslips</CardTitle>
                <CardDescription>Download your salary payslips</CardDescription>
              </CardHeader>
              <CardContent>
                {payslipsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <PayslipsList payslips={payslips || []} employeeName={employee.name} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Off Request Tab */}
          <TabsContent value="time-off">
            <Card>
              <CardHeader>
                <CardTitle>Request Time Off</CardTitle>
                <CardDescription>Submit a leave request</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeOffRequestForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Tab */}
          <TabsContent value="leave">
            <MyLeavePanel
              leaveEntries={leaveData?.[0] || []}
              leaveSummary={leaveData?.[1]}
              isLoading={leaveLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
