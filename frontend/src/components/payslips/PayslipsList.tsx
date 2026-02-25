import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Payslip } from '@/backend';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { downloadPayslip } from '@/utils/payslipDownload';

interface PayslipsListProps {
  payslips: Payslip[];
  employeeName: string;
}

export default function PayslipsList({ payslips, employeeName }: PayslipsListProps) {
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  };

  const handleDownload = (payslip: Payslip) => {
    downloadPayslip(payslip, employeeName);
  };

  if (payslips.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payslips available
      </div>
    );
  }

  // Sort payslips by year and month (most recent first)
  const sortedPayslips = [...payslips].sort((a, b) => {
    if (Number(a.year) !== Number(b.year)) {
      return Number(b.year) - Number(a.year);
    }
    return Number(b.month) - Number(a.month);
  });

  return (
    <div className="space-y-3">
      {sortedPayslips.map((payslip) => (
        <div key={Number(payslip.id)} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold">
              {getMonthName(Number(payslip.month))} {Number(payslip.year)}
            </h3>
            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              <p>Generated: {formatDate(Number(payslip.createdAt))}</p>
              <p>Final Payable: {formatCurrency(Number(payslip.salaryDetails.finalPayable))}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(payslip)}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      ))}
    </div>
  );
}
