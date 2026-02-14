import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEmployee } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign } from 'lucide-react';
import SalaryBreakdownCard from '@/components/salary/SalaryBreakdownCard';

export default function HrEmployeeSalaryPage() {
  const { employeeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const employeeIdNum = employeeId ? parseInt(employeeId, 10) : 0;

  const { data: employee, isLoading } = useGetEmployee(employeeIdNum);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading salary details...</p>
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
          <h1 className="text-2xl font-bold">Salary Details for {employee.name}</h1>
          <p className="text-muted-foreground">View complete salary breakdown</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Salary Breakdown</h2>
      </div>
      
      <SalaryBreakdownCard employee={employee} />
    </div>
  );
}
