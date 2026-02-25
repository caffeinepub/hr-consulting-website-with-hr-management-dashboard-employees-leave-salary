import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Employee } from '@/backend';
import { formatCurrency } from '@/utils/formatters';

interface SalaryBreakdownCardProps {
  employee: Employee;
}

export default function SalaryBreakdownCard({ employee }: SalaryBreakdownCardProps) {
  const { salary } = employee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b">
          <span className="text-sm text-muted-foreground">Base Salary</span>
          <span className="font-medium break-words">{formatCurrency(Number(salary.base))}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b">
          <span className="text-sm text-muted-foreground">Bonus</span>
          <span className="font-medium text-green-600 break-words">
            +{formatCurrency(Number(salary.bonus))}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b">
          <span className="text-sm text-muted-foreground">PF Deduction</span>
          <span className="font-medium text-red-600 break-words">
            -{formatCurrency(Number(salary.pfDeduction))}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-3 bg-muted rounded-lg px-3 mt-4">
          <span className="font-semibold">Final Payable</span>
          <span className="text-lg font-bold text-primary break-words">
            {formatCurrency(Number(salary.finalPayable))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
