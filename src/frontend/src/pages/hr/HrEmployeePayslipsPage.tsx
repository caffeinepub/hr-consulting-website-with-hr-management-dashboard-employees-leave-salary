import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEmployee, useGetEmployeePayslips, useGenerateMonthlyPayslips } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import PayslipsList from '@/components/payslips/PayslipsList';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function HrEmployeePayslipsPage() {
  const { employeeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const employeeIdNum = employeeId ? parseInt(employeeId, 10) : 0;

  const { data: employee, isLoading: employeeLoading } = useGetEmployee(employeeIdNum);
  const { data: payslips = [], isLoading: payslipsLoading } = useGetEmployeePayslips(employeeIdNum);
  const generatePayslips = useGenerateMonthlyPayslips();

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('1');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const handleGeneratePayslips = async () => {
    try {
      await generatePayslips.mutateAsync({
        month: BigInt(selectedMonth),
        year: BigInt(selectedYear),
      });
      toast.success('Payslips generated successfully');
      setGenerateDialogOpen(false);
    } catch (error: any) {
      console.error('Error generating payslips:', error);
      toast.error(error.message || 'Failed to generate payslips');
    }
  };

  if (employeeLoading || payslipsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payslips...</p>
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Payslips for {employee.name}</h1>
          <p className="text-muted-foreground">View and generate payslips</p>
        </div>
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Payslips
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Monthly Payslips</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGeneratePayslips}
                disabled={generatePayslips.isPending}
                className="w-full"
              >
                {generatePayslips.isPending ? 'Generating...' : 'Generate for All Employees'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Payslips</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <PayslipsList payslips={payslips} employeeName={employee.name} />
        </CardContent>
      </Card>
    </div>
  );
}
