import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Employee } from '@/backend';
import { formatCurrency } from '@/utils/formatters';
import { calculateSalaryBreakdown } from '@/utils/salary';

interface SalaryBreakdownCardProps {
  employee: Employee;
}

export default function SalaryBreakdownCard({ employee }: SalaryBreakdownCardProps) {
  const breakdown = calculateSalaryBreakdown(employee);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Salary</span>
          <span className="font-medium">{formatCurrency(breakdown.base)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bonus</span>
          <span className="font-medium text-green-600">+{formatCurrency(breakdown.bonus)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">PF Deduction</span>
          <span className="font-medium text-red-600">-{formatCurrency(breakdown.pfDeduction)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Leave Deduction</span>
          <span className="font-medium text-red-600">-{formatCurrency(breakdown.leaveDeduction)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Final Payable</span>
          <span className="font-bold text-primary">{formatCurrency(breakdown.finalPayable)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
